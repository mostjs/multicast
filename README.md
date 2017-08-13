# @most/multicast-prioritise

Efficient source sharing of an underlying stream to multiple observers.

`most.multicast()` emits values to sinks in the order they were added - potentially causing problems if you need to create streams asynchronously subscribed to the same source & then combine those streams.

This package lets you control the order `multicast()` emits values to sinks as they are added via `prioritise()`.

## Example

```js
import {multicast, prioritise} from '@most/multicast-prioritise'

const s = most.of(undefined).thru(multicast)

const a = s.constant('a')
const b = s.constant('b')
const c = s.constant('c')

// later
setTimeout(() => {
  const before = s.constant('before-all').thru(prioritise(1))
  most
    .mergeArray([a, b, c, before])
    .reduce((pv, v) => pv.concat(v), [])
    .then(console.log.bind(console)) // ['before-all', 'a', 'b', 'c']
})
```

The default priority is `0`. Negative priority is possible.
