import {describe, it} from 'mocha'
import assert from 'assert'

import { none, addSink, removeSink } from '../src/sink'

describe('none', () => {
  it('should compare by value', () => {
    assert.strictEqual(none(), none())
  })

  it('should return undefined from event, end, error', () => {
    assert.strictEqual(undefined, none().event(0, 0))
    assert.strictEqual(undefined, none().end(0, 0))
    assert.strictEqual(undefined, none().error(0, 0))
  })
})

describe('addSink', () => {
  it('should return sink when adding to none', () => {
    const sink = {}
    assert.strictEqual(sink, addSink(sink, none()))
  })

  it('should return many when adding to sink', () => {
    const sink1 = {}
    const sink2 = {}
    const result = addSink(sink2, addSink(sink1, none()))
    assert.strictEqual(sink1, result.sinks[0])
    assert.strictEqual(sink2, result.sinks[1])
  })
})

describe('removeSink', () => {
  it('should return none when removing from none', () => {
    assert.strictEqual(none(), removeSink({}, none()))
  })

  it('should return sink when removing unknown from sink', () => {
    const sink = {}
    assert.strictEqual(sink, removeSink({}, sink))
  })

  it('should return sink when removing from many with 2', () => {
    const sink1 = {}
    const sink2 = {}
    const sink = addSink(sink2, addSink(sink1, none()))

    const result1 = removeSink(sink2, sink)
    assert.strictEqual(sink1, result1)

    const result2 = removeSink(sink1, sink)
    assert.strictEqual(sink2, result2)
  })

  it('should return sinks when removing unknown from many', () => {
    const sink1 = {}
    const sink2 = {}
    const sink = addSink(sink2, addSink(sink1, none()))

    const result = removeSink({}, sink)
    assert.strictEqual(sink, result)
  })
})
