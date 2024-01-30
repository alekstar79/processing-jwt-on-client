/** @module base */

import axios from 'axios'

/**
* @typedef {Object} Endpoints
* @property {function({}): {request: {}, url: string}} getPublicKey
* @property {function({}): {request: {}, url: string}} getUserInfo
* @property {function({}): {request: {}, url: string}} resetPassword
* @property {function({}): {request: {}, url: string}} sendPasswordResetLink
* @property {function({}): {request: {}, url: string}} sendConfirmCode
* @property {function({}): {request: {}, url: string}} register
* @property {function({}): {request: {}, url: string}} login
* @property {function({}): {request: {}, url: string}} logout
*/

/**
* @name BaseApi
* @class module:base.BaseApi
* @property {String} baseUrl {@link module:base.BaseApi#baseUrl}
* @property {Endpoints} endpoints {@link module:base.BaseApi#endpoints}
* @property {Function} fetchRequest {@link module:base.BaseApi#fetchRequest}
*/
export class BaseApi
{
  /**
  * @constructor
  * @param {String} baseURL
  * @param {String[]} endpoints
  */
  constructor(baseURL, endpoints)
  {
    this.endpoints = endpoints.reduce((acc, endpoint) => {
      return { ...acc, [endpoint]: request => ({ url: `/${endpoint}`, request }) }
    }, {})

    this.axios = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
  * @method
  * @name BaseApi#fetchRequest
  * @param {{url: String, request: Object}} data
  * @returns {Promise<{}>}
  */
  async fetchRequest({ url, request })
  {
    try {

      const { status, data } = await this.axios.post(url, request)

      if (status === 200) {
        return data
      }

    } catch (e) {
      console.error(e)
    }

    return undefined
  }
}
