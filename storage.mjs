/** @module storage */

import { MemoryStorage } from './memory-storage.mjs'

/**
* @function
* @name create
* @link module:storage#create
* @param {?String=} [type]
* @returns {Storage}
*/
export function create(type = 'web')
{
  return (typeof window === 'undefined' || type === 'memory') ? MemoryStorage.init() : window.localStorage
}
