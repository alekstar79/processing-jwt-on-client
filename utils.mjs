/** @module utils */

/**
* @function
* @name prettyJSON
* @link module:utils#prettyJSON
* @param {any} data
* @return {String}
*/
export const prettyJSON = (data) => JSON.stringify(data, null, 2)

/**
* @function
* @name log
* @link module:utils#log
* @param {...any[]} data
* @return {void}
*/
export const log = console.log.bind(console)
