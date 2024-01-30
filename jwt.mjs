/** @module jwt */

/**
* JWT Verify
* @see [jwt.io](https://jwt.io/libraries?language=JavaScript)
* @see [jsrsasign](https://github.com/kjur/jsrsasign)
* @see [jose](https://github.com/panva/jose)
*/

export class InvalidTokenError extends Error {}

InvalidTokenError.prototype.name = 'InvalidTokenError'

/**
* @throws {Error}
*/
const errorIncorrectLenght = () => {
  throw new Error('base64 string is not of the correct length')
}

/**
* @function
* @name b64DecodeUnicode
* @link module:jwt#b64DecodeUnicode
* @param {String} str
* @return {String}
*/
function b64DecodeUnicode(str)
{
  return decodeURIComponent(
    atob(str).replace(/(.)/g, (m, p) => {
      let code = p.charCodeAt(0).toString(16).toUpperCase()

      if (code.length < 2) {
        code = '0' + code
      }

      return '%' + code
    })
  )
}

/**
* @function
* @name base64UrlDecode
* @link module:jwt#base64UrlDecode
* @param {String} str
* @return {String}
*/
function base64UrlDecode(str)
{
  let output = str.replace(/-/g, '+').replace(/_/g, '/')

  switch (output.length % 4) {
    case 0:
      break
    case 2:
      output += '=='
      break
    case 3:
      output += '='
      break;
    default:
      errorIncorrectLenght()
  }

  try {
    return b64DecodeUnicode(output)
  } catch (err) {
    return atob(output)
  }
}

/**
* @function
* @name jwtDecode
* @link module:jwt#jwtDecode
* @param {String} token
* @param {{ header?: Boolean }} [options]
* @return {{[any: string]: any}}
*/
export function jwtDecode(token, options)
{
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified: must be a string')
  }

  options ||= {}

  const pos = options.header === true ? 0 : 1
  const part = token.split('.')[pos]

  if (typeof part !== 'string') {
    throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`)
  }

  let decoded

  try {
    decoded = base64UrlDecode(part)
  } catch (e) {
    throw new InvalidTokenError(
      `Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`
    )
  }

  try {
    return JSON.parse(decoded)
  } catch (e) {
    throw new InvalidTokenError(
      `Invalid token specified: invalid json for part #${pos + 1} (${e.message})`
    )
  }
}
