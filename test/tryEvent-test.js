import { describe, it } from 'mocha'
import assert from 'assert'
import { sinkSpy, eventErrorSinkSpy, endErrorSinkSpy } from './helper/sinkSpy'

import { tryEvent, tryEnd } from '../src/tryEvent'

describe('tryEvent', () => {
  it('should call sink event', () => {
    const sink = sinkSpy()
    const t = 1
    const x = {}

    tryEvent(t, x, sink)

    assert.strictEqual(1, sink.eventCalled)
    assert.strictEqual(t, sink.eventTime)
    assert.strictEqual(x, sink.eventValue)

    assert.strictEqual(0, sink.endCalled)
    assert.strictEqual(0, sink.errorCalled)
  })

  it('should call sink error if sink event throws', () => {
    const error = new Error()
    const sink = eventErrorSinkSpy(error)
    const t = 1
    const x = {}

    tryEvent(t, x, sink)

    assert.strictEqual(1, sink.eventCalled)
    assert.strictEqual(t, sink.eventTime)
    assert.strictEqual(x, sink.eventValue)

    assert.strictEqual(1, sink.errorCalled)
    assert.strictEqual(t, sink.errorTime)
    assert.strictEqual(error, sink.errorValue)

    assert.strictEqual(0, sink.endCalled)
  })
})

describe('tryEnd', () => {
  it('should call sink end', () => {
    const sink = sinkSpy()
    const t = 1
    const x = {}

    tryEnd(t, x, sink)

    assert.strictEqual(1, sink.endCalled)
    assert.strictEqual(t, sink.endTime)
    assert.strictEqual(x, sink.endValue)

    assert.strictEqual(0, sink.eventCalled)
    assert.strictEqual(0, sink.errorCalled)
  })

  it('should call sink error if sink end throws', () => {
    const error = new Error()
    const sink = endErrorSinkSpy(error)
    const t = 1
    const x = {}

    tryEnd(t, x, sink)

    assert.strictEqual(1, sink.endCalled)
    assert.strictEqual(t, sink.endTime)
    assert.strictEqual(x, sink.endValue)

    assert.strictEqual(1, sink.errorCalled)
    assert.strictEqual(t, sink.errorTime)
    assert.strictEqual(error, sink.errorValue)

    assert.strictEqual(0, sink.eventCalled)
  })
})
