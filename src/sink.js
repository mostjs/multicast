import { append, remove, findIndex } from '@most/prelude'
import { tryEvent, tryEnd } from './tryEvent'

export const addSink = (sink, sinks) =>
  sinks === NONE ? sink
    : sinks instanceof Many ? new Many(append(sink, sinks.sinks))
    : new Many([sinks, sink])

export const removeSink = (sink, sinks) => // eslint-disable-line complexity
  sinks === NONE || sink === sinks ? NONE
    : sinks instanceof Many ? removeMany(sink, sinks)
    : sinks

const removeMany = (sink, many) => {
  const { sinks } = many
  const i = findIndex(sink, sinks)
  return i < 0 ? many : removeManyAt(i, sinks)
}

const removeManyAt = (i, sinks) => {
  const updated = remove(i, sinks)
  // It's impossible to create a Many with 1 sink
  // so we can't end up with updated.length === 0 here
  return updated.length === 1 ? updated[0]
    : new Many(updated)
}

class None {
  event (t, x) {}
  end (t, x) {}
  error (t, x) {}
}

const NONE = new None()
export const none = () => NONE

class Many {
  constructor (sinks) {
    this.sinks = sinks
  }

  event (t, x) {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      tryEvent(t, x, s[i])
    }
  }

  end (t, x) {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      tryEnd(t, x, s[i])
    }
  }

  error (t, x) {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      s[i].error(t, x)
    }
  }
}
