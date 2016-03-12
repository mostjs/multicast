import MulticastDisposable from './MulticastDisposable'
import {append, remove, findIndex} from '@most/prelude'

function dispose (disposable) {
  if (disposable === void 0) {
    return
  }
  return disposable.dispose()
}

export default class MulticastSource {
  constructor (source) {
    this.source = source
    this.sinks = []
    this._disposable = void 0
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
    this._disposable = void 0
    return Promise.resolve(disposable).then(dispose)
  }

  add (sink) {
    this.sinks = append(sink, this.sinks)
    return this.sinks.length
  }

  remove (sink) {
    this.sinks = remove(findIndex(sink, this.sinks), this.sinks)
    return this.sinks.length
  }

  event (time, value) {
    const s = this.sinks
    if (s.length === 1) {
      tryEvent(time, value, s[0])
      return
    }
    for (let i = 0; i < s.length; ++i) {
      tryEvent(time, value, s[i])
    }
  }

  end (time, value) {
    const s = this.sinks
    if (s.length === 1) {
      tryEnd(time, value, s[0])
      return
    }
    for (let i = 0; i < s.length; ++i) {
      tryEnd(time, value, s[i])
    }
  }

  error (time, err) {
    const s = this.sinks
    if (s.length === 1) {
      s[0].error(time, err)
      return
    }
    for (let i = 0; i < s.length; ++i) {
      s[i].error(time, err)
    }
  }
}

function tryEvent (t, x, sink) {
  try {
    sink.event(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

function tryEnd (t, x, sink) {
  try {
    sink.end(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}
