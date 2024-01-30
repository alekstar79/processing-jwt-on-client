/** @module webdevep */

import { APP_ID, CONFIRM_CODE } from './constants.mjs'
import { Api } from './webdevep-api.mjs'
import { Emitter } from './emitter.mjs'
import { jwtDecode } from './jwt.mjs'
import { create } from './storage.mjs'
import { log } from './utils.mjs'

/**
* @name Webdevep
* @class module.webdevep.Webdevep
* @property {Api} api {@link module:api.Api}
* @property {Storage} store
*
* @property {Function} bindings {@link module:webdevep.Webdevep#bindings}
* @property {Function} init {@link module:webdevep.Webdevep#init}
* @property {Function} checkToken {@link module:webdevep.Webdevep#checkToken}
* @property {Function} conditionalLogout {@link module:webdevep.Webdevep#conditionalLogout}
* @property {Function} setTokens {@link module:webdevep.Webdevep#setTokens}
* @property {Function} readStorage {@link module:webdevep.Webdevep#readStorage}
* @property {Function} writeStorage {@link module:webdevep.Webdevep#writeStorage}
* @property {Function} isTokenExpired {@link module:webdevep.Webdevep#isTokenExpired}
*/
export class Webdevep extends Emitter
{
  get needRegister()
  {
    return this.refreshToken === ''
  }

  get loggedIn()
  {
    return this.accessToken !== '' && !this.isTokenExpired(this.accessToken)
  }

  /**
  * @constructor
  */
  constructor(...args)
  {
    super()

    this.api = Api.init(...args)
    this.store = create()

    this.bindings()
    this.init()
  }

  /**
  * @method
  * @name Webdevep#bindings
  * @return void
  */
  bindings()
  {
    this.setTokens = this.setTokens.bind(this)
    this.checkToken = this.checkToken.bind(this)
    this.conditionalLogout = this.conditionalLogout.bind(this)
    this.isTokenExpired = this.isTokenExpired.bind(this)
    this.writeStorage = this.writeStorage.bind(this)
    this.readStorage = this.readStorage.bind(this)
    this.ready = this.ready.bind(this)
  }

  /**
  * @method
  * @name Webdevep#init
  * @return void
  */
  init()
  {
    this.setTokens({})

    this.readStorage()
      .then(this.checkToken)
      .then(this.conditionalLogout)
      .then(this.setTokens)
      .then(this.ready)
      .catch(log)
  }

  ready()
  {
    this.emit('ready')
  }

  /**
  * @method
  * @name Webdevep#checkToken
  * @param {{accessToken: String, refreshToken: String}} data
  * @return {Promise<{accessToken: String, refreshToken: String}>}
  */
  async checkToken({ accessToken, refreshToken })
  {
    if (accessToken !== '' && this.isTokenExpired(accessToken)) {
      accessToken = ''
    }

    await this.writeStorage({ accessToken, refreshToken })

    return {
      accessToken,
      refreshToken
    }
  }

  /**
  * @method
  * @name Webdevep#conditionalLogout
  * @param {{accessToken: String, refreshToken: String}} data
  * @return {Promise<{accessToken, refreshToken}>}
  */
  async conditionalLogout({ accessToken, refreshToken })
  {
    if (this.expired && refreshToken) {
      await this.api.logoutUser(refreshToken)
    }

    return {
      accessToken,
      refreshToken
    }
  }

  /**
  * @method
  * @name Webdevep#setTokens
  * @param {{accessToken?: String, refreshToken?: String}} data
  * @return void
  */
  setTokens({ accessToken = '', refreshToken = '' })
  {
    this.refreshToken = refreshToken
    this.accessToken = accessToken
  }

  /**
  * @method
  * @name Webdevep#isTokenExpired
  * @param {String} accessToken
  * @return {Boolean}
  */
  isTokenExpired(accessToken)
  {
    const timestamp = Math. floor(Date.now() / 1000)
    const { exp } = jwtDecode(accessToken)

    this.expired = exp < timestamp

    return this.expired
  }

  /**
  * @method
  * @name Webdevep#readStorage
  * @return {Promise<{accessToken: String, refreshToken: String}>}
  */
  readStorage()
  {
    try {

      const { accessToken = '', refreshToken = '' } = JSON.parse(this.store.getItem(APP_ID) || '{}')
      return Promise.resolve({ accessToken, refreshToken })

    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
  * @method
  * @name Webdevep#writeStorage
  * @param {{accessToken: String, refreshToken: String}} data
  * @return {Promise<void>}
  */
  writeStorage(data)
  {
    try {

      this.store.setItem(APP_ID, JSON.stringify(data))
      this.refreshToken = data.refreshToken
      this.accessToken = data.accessToken

      return Promise.resolve()

    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
  * @method
  * @name Webdevep#getPublicKey
  * @return {Promise<{}>}
  */
  getPublicKey()
  {
    return this.api.getPublicKey()
  }

  /**
  * @method
  * @name Webdevep#confirmCode
  * @param {String} email
  * @return {Promise<{ok: Boolean}|{any}>}
  */
  async confirmCode(email)
  {
    const {
      /** @type {Boolean} */ ok,
      /** @type {{any}} */ ...rest
    } = await this.api.confirmCode(email)

    return ok ? { ok } : rest
  }

  /**
  * @method
  * @name Webdevep#registerUser
  * @param {String} email
  * @param {String} password
  * @param {String=} confirmCode
  * @param {Object=} userinfo
  * @return {Promise<{}>}
  */
  async registerUser(email, password, confirmCode = CONFIRM_CODE, userinfo = {})
  {
    if (!email || !password) {
      return { [!email ? 'email' : 'password']: false }
    }

    const { ok: codeRequested } = await this.confirmCode(email)

    if (!codeRequested) return { codeRequested }

    const {
      /** @type {Boolean} */ ok,
      /** @type {String} */ uid,
      /** @type {{any}} */ ...rest
    } = await this.api.registerUser(email, password, confirmCode, userinfo)

    return ok ? { uid } : rest
  }

  /**
  * @method
  * @name *Webdevep#passwordResetLink
  * @param {String} email
  * @return {Promise<{}>}
  */
  passwordResetLink(email)
  {
    return this.api.passwordResetLink(email)
  }

  /**
  * @method
  * @name *Webdevep#resetPassword
  * @param {String} email
  * @param {String} password
  * @param {String} code
  * @param {String} token
  * @return {Promise<{}>}
  */
  resetPassword(email, password, code, token)
  {
    return this.api.resetPassword(email, password, code, token)
  }

  /**
  * @method
  * @name Webdevep#getUserInfo
  * @param {String?} accessToken
  * @return {Promise<{}>}
  */
  async getUserInfo(accessToken)
  {
    accessToken ||= this.accessToken

    const {
      /** @type {Boolean} */ ok,
      /** @type {{any}} */...info
    } = await this.api.getUserInfo(accessToken)

    return info
  }

  /**
  * @method
  * @name Webdevep#login
  * @param {String} email
  * @param {String} password
  * @return {Promise<{}>}
  */
  async login(email, password)
  {
    if (!email || !password) {
      return { [!email ? 'email' : 'password']: false }
    }

    const {
      /** @type {Boolean} */ ok,
      /** @type {{accessToken: String, refreshToken: String}} */...rest
    } = await this.api.loginUser(email, password)

    return ok ? this.checkToken(rest) : rest
  }

  /**
  * @method
  * @name Webdevep#logout
  * @param {String?} refreshToken
  * @return {Promise<Boolean>}
  */
  async logout(refreshToken)
  {
    refreshToken ||= this.refreshToken

    if (refreshToken !== '') {
      const { /** @type {boolean} */ ok } = await this.api.logoutUser(refreshToken)

      if (ok === true) {
        await this.writeStorage({ accessToken: '', refreshToken })
        return ok
      }
    }

    return false
  }
}
