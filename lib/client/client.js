'use strict';

const Hoek = require('@hapi/hoek');
const Wreck = require('@hapi/wreck');
const debug = require('debug')('simple-oauth2:client');
const { RequestOptions } = require('./request-options');

const defaultHttpHeaders = {
  Accept: 'application/json',
};

const defaultHttpOptions = {
  json: 'strict',
  redirects: 20,
  headers: defaultHttpHeaders,
};

module.exports = class Client {
  #config = null;
  #client = null;

  constructor(config) {
    const configHttpOptions = Hoek.applyToDefaults(config.http || {}, {
      baseUrl: config.auth.tokenHost,
    });

    const httpOptions = Hoek.applyToDefaults(defaultHttpOptions, configHttpOptions);

    this.#config = config;
    this.#client = Wreck.defaults(httpOptions);
  }

  async request(url, params, opts) {
    console.log('REQUEST PARAMS');
    console.log('URL', url);
    console.log('PARAMS', JSON.stringify(params, null, 2));
    console.log('OPTIONS', JSON.stringify(opts, null, 2));

    const requestOptions = new RequestOptions(this.#config, params);

    console.log("REQUEST OPTIONS", JSON.stringify(requestOptions, null, 2))
    const options = requestOptions.toObject(opts);
    console.log("OPTIONS OBJECT", JSON.stringify(options, null, 2))

    debug('Creating request to: (POST) %s', url);
    debug('Using request options: %j', options);

    return this.#client.post(url, options).then(r => r.payload)
      .catch(e => console.log('ERROR', e));
  }
};
