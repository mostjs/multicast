// @flow

import { Stream, just } from 'most'
import multicast, { MulticastSource } from '../src/index.js'

// Save type of stream
multicast(just(1)).observe((d: number) => {})
// $ExpectError
multicast(just(1)).observe((d: string) => {})

// Accept Source and produce Source
new Stream(new MulticastSource(just(1).source))
// $ExpectError
new Stream(new MulticastSource(1))
