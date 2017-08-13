import MulticastDisposable from './MulticastDisposable'
import { tryEvent, tryEnd } from './tryEvent'
import { dispose, emptyDisposable } from './dispose'
import { remove, findIndex } from '@most/prelude'

function insertWhen (x, a, f) {
  const l = a.length
  const b = new Array(l + 1)

  let i = 0
  for (; i < l; ++i) {
    if (f(x, a[i])) {
      break
    }
    b[i] = a[i]
  }

  b[i] = x

  for (; i < l; ++i) {
    b[i + 1] = a[i]
  }

  return b
}

function comparePriority (a, b) {
  return (a.priority || 0) > (b.priority || 0)
}

export default class MulticastSource {
  constructor (source) {
    this.source = source
    this.sinks = []
    this._disposable = emptyDisposable
  }

  run (sink, scheduler) {
    const n = this.add(sink)
    if (n === 1) {
      this._disposable = this.source.run(this, scheduler)
    }
    return new MulticastDisposable(this, sink)
  }

  _dispose () {
    const disposable = this._disposable
    this._disposable = emptyDisposable
    return Promise.resolve(disposable).then(dispose)
  }

  add (sink) {
    this.sinks = insertWhen(sink, this.sinks, comparePriority)
    return this.sinks.length
  }

  remove (sink) {
    const i = findIndex(sink, this.sinks)
    // istanbul ignore next
    if (i >= 0) {
      this.sinks = remove(i, this.sinks)
    }

    return this.sinks.length
  }

  event (time, value) {
    const s = this.sinks
    if (s.length === 1) {
      return s[0].event(time, value)
    }
    for (let i = 0; i < s.length; ++i) {
      tryEvent(time, value, s[i])
    }
  }

  end (time, value) {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      tryEnd(time, value, s[i])
    }
  }

  error (time, err) {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      s[i].error(time, err)
    }
  }
}
