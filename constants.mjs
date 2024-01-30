/** @module constants */

/**
* @constant
* @type {String}
* @name APP_ID
*/
export const APP_ID = 'webdevep'

/**
* @constant
* @type {String}
* @name PROXY_URL
*/
export const PROXY_URL = 'https://usnc.dev-webdevep.ru/auth-back/api/v2'

/**
* @constant
* @type {String}
* @name BASE_URL
*/
export const BASE_URL = 'http://localhost:5173/auth-back/api/v2'

/**
* @constant
* @type {String}
* @name CONFIRM_CODE
*/
export const CONFIRM_CODE = '111111'

export const GET_PUBLIC_KEY = 'getPublicKey'
export const GET_USER_INFO = 'getUserInfo'
export const RESET_PASSWORD = 'resetPassword'
export const PASSWORD_RESET_LINK = 'sendPasswordResetLink'
export const SEND_CONFIRM_CODE = 'sendConfirmCode'
export const REGISTER = 'register'
export const LOGIN = 'login'
export const LOGOUT = 'logout'

export const ENDPOINTS = [
  GET_PUBLIC_KEY,
  GET_USER_INFO,
  RESET_PASSWORD,
  PASSWORD_RESET_LINK,
  SEND_CONFIRM_CODE,
  REGISTER,
  LOGIN,
  LOGOUT
]
