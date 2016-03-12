import {describe, it} from 'mocha'
import assert from 'assert'
import sinon from 'sinon'

import {of, map, from, reduce, drain, Stream} from 'most'
import scheduler from 'most/lib/scheduler/defaultScheduler'

import MulticastSource from '../src/MulticastSource'
import FakeDisposeSource from './helper/FakeDisposeSource'

const sentinel = {value: 'sentinel'}
const other = {value: 'other'}

describe('MulticastSource', () => {
  it('should call producer on first observer', () => {
    const eventSpy = sinon.spy()
    const s = new MulticastSource({run: () => {}})

    s.run({event: eventSpy}, scheduler)
    s.event(sentinel)

    assert.strictEqual(eventSpy.calledOnce, true)
  })

  it('should call producer ONLY on the first observer', () => {
    const sourceSpy = sinon.spy()
    const s = new MulticastSource({run: sourceSpy})

    return Promise.all([
      s.run({event: () => {}}, scheduler),
      s.run({event: () => {}}, scheduler),
      s.run({event: () => {}}, scheduler),
      s.run({event: () => {}}, scheduler)
    ]).then(() => {
      assert.strictEqual(sourceSpy.calledOnce, true)
    })
  })

  it('should publish events to all observers', () => {
    const s = new Stream(new MulticastSource(of(sentinel).source))
    const second = (_, y) => y

    return Promise.all([
      reduce(second, other, s),
      reduce(second, other, s)
    ]).then(([a, b]) => {
      assert.strictEqual(a, sentinel)
      assert.strictEqual(b, sentinel)
    })
  })

  it('should propagate errors only to errored observer', () => {
    const s = new Stream(new MulticastSource(from([1, 2]).source))
    const error = new Error()

    const p1 = drain(s)
    const p2 = drain(map(() => { throw error }, s))
        .catch(e => e)

    return Promise.all([p1, p2]).then(([a, b]) => {
      assert.notStrictEqual(a, error)
      assert.strictEqual(b, error)
    })
  })

  it('should call dispose if all observers disconnect', () => {
    const spy = sinon.spy()
    const s = new Stream(new MulticastSource(FakeDisposeSource.from(spy, of(sentinel))))

    return Promise.all([drain(s), drain(s)]).then(() => {
      assert.strictEqual(spy.calledOnce, true)
    })
  })
})
