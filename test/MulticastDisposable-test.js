import {describe, it} from 'mocha'
import assert from 'assert'

import MulticastDisposable from '../src/MulticastDisposable'

describe('MulticastDisposable', () => {
  it('should dispose when sinks reaches zero', () => {
    const expectedSink = {}
    const expectedResult = {}
    let removeCalled = 0
    const source = {
      remove (sink) {
        removeCalled += 1
        assert.strictEqual(expectedSink, sink)
        return 0
      },

      _dispose () {
        return expectedResult
      }
    }

    const md = new MulticastDisposable(source, expectedSink)

    const result = md.dispose()

    assert.strictEqual(1, removeCalled)
    assert.strictEqual(expectedResult, result)
  })

  it('should not dispose when sinks > 0', () => {
    const expectedSink = {}
    const failedResult = {}
    let removeCalled = 0
    const source = {
      remove (sink) {
        removeCalled += 1
        assert.strictEqual(expectedSink, sink)
        return 1
      },

      _dispose () {
        return failedResult
      }
    }

    const md = new MulticastDisposable(source, expectedSink)

    const result = md.dispose()

    assert.strictEqual(1, removeCalled)
    assert.notStrictEqual(failedResult, result)
  })

  it('should dispose only once', () => {
    const expectedSink = {}
    const expectedResult = {}
    let disposeCalled = 0
    const source = {
      remove (sink) {
        return 0
      },

      _dispose () {
        disposeCalled += 1
        return expectedResult
      }
    }

    const md = new MulticastDisposable(source, expectedSink)

    md.dispose()
    md.dispose()

    assert.strictEqual(1, disposeCalled)
  })
})
