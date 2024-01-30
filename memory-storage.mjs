/** @module memorystorage */

/**
* @typedef {Object.<string, any>} GenericObject
* @link module:memorystorage.MemoryStorage
*/

// API methods and properties will be cloaked
const API = { id: 1, key: 1, length: 1, clear: 1, getItem: 1, setItem: 1, removeItem: 1 }

// A space to store 'cloaked' key/values: items that have a key
// that collides with Web Storage API method names.
const cloak = {}

/**
* @class module:memorystorage.MemoryStorage
* @implements Storage
* @name MemoryStorage
* @type GenericObject
*
* @property {Function} getItem {@link module:memorystorage.MemoryStorage#getItem}
* @property {Function} setItem {@link module:memorystorage.MemoryStorage#setItem}
* @property {Function} removeItem {@link module:memorystorage.MemoryStorage#removeItem}
* @property {Function} clear {@link module:memorystorage.MemoryStorage#clear}
* @property {Function} key {@link module:memorystorage.MemoryStorage#key}
*
* @description
* Creates a new MemoryStorage object implementing the Web Storage API using memory.
* If no arguments are given, the created memory storage object will read from and write to the
* global memory storage. If a string argument is given, the new storage object will read from
* and write to its own segment of memory. Any data written to such a memory storage object will
* only show up in other memory storage objects that have been created with the same id.
* This data will not show up in the global memory space. As such it is recommended
* to always construct a memory storage object with a unique string id as argument.
*
* @link http://www.w3.org/TR/webstorage
*/
export class MemoryStorage
{
  /**
  * @param {?String} [id]
  * @returns {MemoryStorage}
  */
  static init = (id) => new MemoryStorage(id)

  /**
  * @param {?String} [id]
  */
  constructor(id = 'global')
  {
    Object.defineProperty(this, 'id', {
      configurable: true,
      enumerable: true,
      value: id
    })

    Object.defineProperty(this, 'length', {
      configurable: true,
      enumerable: true,
      get: () => {
        return this.enumerableKeys().length
      }
    })

    Object.defineProperty(this, 'ownKeys', {
      get: () => this.enumerableKeys()
    })
  }

  uncloakedKeys()
  {
    return Object.keys(this).filter((x) => !(x in API))
  }

  cloakedKeys()
  {
    return Object.keys(cloak)
  }

  enumerableKeys()
  {
    return this.uncloakedKeys().concat(this.cloakedKeys())
  }

  /**
  * @method
  * @name MemoryStorage.getItem
  * @param {String} key
  * @returns {String|null}
  */
  getItem(key)
  {
    return (key in API ? cloak[key] : this[key]) || null
  }

  /**
  * @method
  * @name MemoryStorage.setItem
  * @param {String} key
  * @param {String} val
  */
  setItem(key, val)
  {
    key in API ? cloak[key] = val : this[key] = val
  }

  /**
  * @method
  * @name MemoryStorage.removeItem
  * @param {String} key
  */
  removeItem(key)
  {
    key in API ? delete cloak[key] : delete this[key]
  }

  /**
  * @method
  * @name MemoryStorage.key
  * @param {Number} idx
  * @returns {string|null}
  */
  key(idx)
  {
    const keys = this.enumerableKeys()

    return idx >= 0 && idx < keys.length
      ? keys[idx]
      : null
  }

  /**
  * @method
  * @name MemoryStorage.clear
  * @return {void}
  */
  clear()
  {
    let keys

    keys = this.uncloakedKeys()
    for (let i= 0, key; (key = keys[i]); i++) {
      delete this[key]
    }

    keys = this.cloakedKeys()
    for (let i= 0, key; (key = keys[i]); i++) {
      delete cloak[key]
    }
  }
}
