/** @module emitter */

/**
* @name Emitter
* @class module:emitter.Emitter
* @property {Function} applyAwaitEvent {@link module:emitter.Emitter#applyAwaitEvent}
* @property {Function} on {@link module:emitter.Emitter#on}
* @property {Function} once {@link module:emitter.Emitter#once}
* @property {Function} off {@link module:emitter.Emitter#off}
* @property {Function} emit {@link module:emitter.Emitter#emit}
* @property {{}} events
*/
export class Emitter
{
  /**
  * @constructor
  * @param {{}} events
  */
  constructor(events = {})
  {
    this.awaitEventBinding = []
    this.events = events
  }

  /**
  * @method
  * @name Emitter#applyAwaitEvent
  * @param {String} id
  * @param {(function(): void)} fn
  */
  applyAwaitEvent(id, fn)
  {
    const index = this.awaitEventBinding.findIndex(e => e.id === id)

    if (index > -1) {
      fn.apply(this, this.awaitEventBinding[index].data)
      this.awaitEventBinding.splice(
        index,
        1
      )
    }
  }

  /**
  * @method
  * @name Emitter#on
  * @param {String} id
  * @param {(function(): void)} fn
  * @return {(function(): void)}
  */
  on(id, fn)
  {
    (this.events[id] ||= []).push(fn)

    this.applyAwaitEvent(id, fn)

    return () => {
      this.off(id, fn)
    }
  }

  /**
  * @method
  * @name Emitter#once
  * @param {String} id
  * @param {(function(): void)} fn
  */
  once(id, fn)
  {
    this.on(id, function handler(...args) {
      this.off(id, handler)
      fn.apply(this, args)
    })
  }

  /**
  * @method
  * @name Emitter#off
  * @param {String} id
  * @param {(function(): void)} fn
  */
  off(id, fn)
  {
    if (typeof this.events[id] === 'undefined') return

    const idx = this.events[id].indexOf(fn)

    if (idx > -1) {
      this.events[id].splice(idx, 1)
    }
  }

  /**
  * @method
  * @name Emitter#emit
  * @param {String} id
  * @param {any} data
  */
  emit(id, ...data)
  {
    if (typeof this.events[id] === 'undefined') {
      this.awaitEventBinding.push({ id, data })
    }

    (this.events[id] || []).forEach(
      fn => fn.apply(this, data)
    )
  }
}
