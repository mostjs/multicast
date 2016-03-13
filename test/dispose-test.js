import {describe, it} from 'mocha'
import assert from 'assert'

import { dispose, emptyDisposable } from '../src/dispose'

describe('dispose', () => {
  it('should call disposable.dispose', () => {
    const expected = {}
    const disposable = {
      dispose () {
        return expected
      }
    }

    assert.strictEqual(expected, dispose(disposable))
  })
})

describe('emptyDisposable', () => {
  it('should return undefined', () => {
    assert.strictEqual(undefined, emptyDisposable.dispose())
  })
})
