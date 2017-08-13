import MulticastSource from './MulticastSource'
import Prioritise from './Prioritise'

function multicast (stream) {
  const source = stream.source
  return source instanceof MulticastSource
    ? stream
    : new stream.constructor(new MulticastSource(source))
}

function prioritise (priority, stream) {
  return !stream
    ? prioritise.bind(this, priority)
    : new stream.constructor(new Prioritise(priority, stream.source))
}

export {multicast, MulticastSource, prioritise, Prioritise}
