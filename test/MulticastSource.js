import {describe, it} from 'mocha'
import assert from 'assert'
import sinon from 'sinon'

import {of, reduce, drain, Stream} from 'most'
import scheduler from 'most/lib/scheduler/defaultScheduler'

import MulticastSource from '../src/MulticastSource'
import FakeDisposeSource from './helper/FakeDisposeSource'

const sentinel = {value: 'sentinel'}
const other = {value: 'other'}

describe('MulticastSource', () => {
	it('should call producer on first subscriber', () => {
		const eventSpy = sinon.spy()
		const s = new MulticastSource({run: () => {}})

		s.run({event: eventSpy}, scheduler)
		s.event(sentinel)

		assert.strictEqual(eventSpy.calledOnce, true)
	})

	it('should call producer ONLY on the first subscriber', () => {
		const sourceSpy = sinon.spy()
		const s = new MulticastSource({run: sourceSpy})

		Promise.all([
			s.run({event: () => {}}, scheduler),
			s.run({event: () => {}}, scheduler),
			s.run({event: () => {}}, scheduler),
			s.run({event: () => {}}, scheduler)
		]).then(() => {
			assert.strictEqual(sourceSpy.calledOnce, true)
		})
	})

	it('should publish events to all subscribers', () => {
		const s = new MulticastSource(of(sentinel).source)
		const second = (_, y) => y

		Promise.all([reduce(second, other, s), reduce(second, other, s)])
		.then(values => {
			assert.strictEqual(values[0], sentinel) /
			assert.strictEqual(values[1], sentinel)
		})
	})

	it('should call dispose if all subscribers disconnect', () => {
		const spy = sinon.spy()
		const s = new Stream(new MulticastSource(FakeDisposeSource.from(spy, of(sentinel))))

		Promise.all([drain(s), drain(s)]).then(() => {
			assert.strictEqual(spy.calledOnce, true)
		})
	})
})
