import {Stream} from 'most'
import MulticastSource from './MulticastSource'

function multicast (stream) {
  const source = stream.source
  return source instanceof MulticastSource
    ? stream
    : new Stream(new MulticastSource(source))
}

export {multicast as default, MulticastSource}
