/** @module api */

import { BaseApi } from './base-api.mjs'

/**
* @name Api
* @class module:api.Api
* @extends module:base.BaseApi
* @property {Function} getPublicKey {@link module:api.Api#getPublicKey}
* @property {Function} getUserInfo {@link module:api.Api#getUserInfo}
* @property {Function} confirmCode {@link module:api.Api#confirmCode}
* @property {Function} passwordResetLink {@link module:api.Api#passwordResetLink}
* @property {Function} resetPassword {@link module:api.Api#resetPassword}
* @property {Function} registerUser {@link module:api.Api#registerUser}
* @property {Function} loginUser {@link module:api.Api#loginUser}
* @property {Function} logoutUser {@link module:api.Api#logoutUser}
*/
export class Api extends BaseApi
{
  /**
  * @static
  * @param {String} url
  * @param {String[]} endpoints
  * @returns {Api}
  */
  static init = (url, endpoints) => new Api(url, endpoints)

  /**
  * @method
  * @name Api#getPublicKey
  * @returns {Promise<{}>}
  */
  getPublicKey()
  {
    return this.fetchRequest(this.endpoints.getPublicKey({}))
  }

  /**
  * @method
  * @name Api#getUserInfo
  * @param {String} accessToken
  * @returns {Promise<{}>}
  */
  getUserInfo(accessToken)
  {
    return this.fetchRequest(this.endpoints.getUserInfo({ accessToken }))
  }

  /**
  * @method
  * @name Api#confirmCode
  * @param {String} email
  * @param {Boolean} use_call
  * @returns {Promise<{}>}
  */
  confirmCode(email, use_call = false)
  {
    return this.fetchRequest(this.endpoints.sendConfirmCode({ email, use_call }))
  }

  /**
  * @method
  * @name *Api#passwordResetLink
  * @param {String} email
  * @return {Promise<{}>}
  */
  passwordResetLink(email)
  {
    return this.fetchRequest(this.endpoints.sendPasswordResetLink({ email }))
  }

  /**
  * @method
  * @name *Api#resetPassword
  * @param {String} email
  * @param {String} password
  * @param {String} code
  * @param {String} token
  * @return {Promise<{}>}
  */
  resetPassword(email, password, code, token)
  {
    return this.fetchRequest(this.endpoints.resetPassword({ email, code, token, password }))
  }

  /**
  * @method
  * @name Api#registerUser
  * @param {String} email
  * @param {String} password
  * @param {String} emailConfirmCode
  * @param {{}} userinfo
  * @returns {Promise<{}>}
  */
  registerUser(email, password, emailConfirmCode, userinfo)
  {
    return this.fetchRequest(this.endpoints.register({ email, password, emailConfirmCode, userinfo }))
  }

  /**
  * @method
  * @name Api#loginUser
  * @param email
  * @param password
  * @returns {Promise<{}>}
  */
  loginUser(email, password)
  {
    return this.fetchRequest(this.endpoints.login({ credential: email, password }))
  }

  /**
  * @method
  * @name Api#logoutUser
  * @param refreshToken
  * @returns {Promise<{}>}
  */
  logoutUser(refreshToken)
  {
    return this.fetchRequest(this.endpoints.logout({ refreshToken }))
  }
}
