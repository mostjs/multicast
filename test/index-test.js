import {describe, it} from 'mocha'
import assert from 'assert'
import sinon from 'sinon'
import {of, map, observe} from 'most'
import multicast from '../src/index'

describe('multicast', () => {
  it('should be identity for already-multicasted stream', () => {
    const s = multicast(of(1))
    assert.strictEqual(s, multicast(s))
  })

  it('should call mapper function once when there are > 1 observer', () => {
    const mapperSpy = sinon.spy()
    const observer1Spy = sinon.spy()
    const observer2Spy = sinon.spy()
    const observer3Spy = sinon.spy()

    const s = of({value: 'sentinel'})
    const mapped = map(mapperSpy, s)
    const multicasted = multicast(mapped)

    const o1 = observe(observer1Spy, multicasted)
    const o2 = observe(observer2Spy, multicasted)
    const o3 = observe(observer3Spy, multicasted)

    Promise.all([o1, o2, o3]).then(() => {
      assert.strictEqual(mapperSpy.calledOnce(), true)
      assert.strictEqual(observer1Spy.calledOnce(), true)
      assert.strictEqual(observer2Spy.calledOnce(), true)
      assert.strictEqual(observer3Spy.calledOnce(), true)
    })
  })
})
