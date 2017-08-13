import { remove, findIndex } from '@most/prelude';

var MulticastDisposable = function MulticastDisposable (source, sink) {
  this.source = source
  this.sink = sink
  this.disposed = false
};

MulticastDisposable.prototype.dispose = function dispose () {
  if (this.disposed) {
    return
  }
  this.disposed = true
  var remaining = this.source.remove(this.sink)
  return remaining === 0 && this.source._dispose()
};

function tryEvent (t, x, sink) {
  try {
    sink.event(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

function tryEnd (t, x, sink) {
  try {
    sink.end(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

var dispose = function (disposable) { return disposable.dispose(); }

var emptyDisposable = {
  dispose: function dispose$1 () {}
}

function insertWhen (x, a, f) {
  var l = a.length
  var b = new Array(l + 1)

  var i = 0
  for (; i < l; ++i) {
    if (f(x, a[i])) {
      break
    }
    b[i] = a[i]
  }

  b[i] = x

  for (; i < l; ++i) {
    b[i + 1] = a[i]
  }

  return b
}

function comparePriority (a, b) {
  return (a.priority || 0) > (b.priority || 0)
}

var MulticastSource = function MulticastSource (source) {
  this.source = source
  this.sinks = []
  this._disposable = emptyDisposable
};

MulticastSource.prototype.run = function run (sink, scheduler) {
  var n = this.add(sink)
  if (n === 1) {
    this._disposable = this.source.run(this, scheduler)
  }
  return new MulticastDisposable(this, sink)
};

MulticastSource.prototype._dispose = function _dispose () {
  var disposable = this._disposable
  this._disposable = emptyDisposable
  return Promise.resolve(disposable).then(dispose)
};

MulticastSource.prototype.add = function add (sink) {
  this.sinks = insertWhen(sink, this.sinks, comparePriority)
  return this.sinks.length
};

MulticastSource.prototype.remove = function remove$1 (sink) {
  var i = findIndex(sink, this.sinks)
  // istanbul ignore next
  if (i >= 0) {
    this.sinks = remove(i, this.sinks)
  }

  return this.sinks.length
};

MulticastSource.prototype.event = function event (time, value) {
  var s = this.sinks
  if (s.length === 1) {
    return s[0].event(time, value)
  }
  for (var i = 0; i < s.length; ++i) {
    tryEvent(time, value, s[i])
  }
};

MulticastSource.prototype.end = function end (time, value) {
  var s = this.sinks
  for (var i = 0; i < s.length; ++i) {
    tryEnd(time, value, s[i])
  }
};

MulticastSource.prototype.error = function error (time, err) {
  var s = this.sinks
  for (var i = 0; i < s.length; ++i) {
    s[i].error(time, err)
  }
};

var Prioritise = function Prioritise (priority, source) {
  this.source = source
  this.priority = priority
};
Prioritise.prototype.run = function run (sink, scheduler) {
  sink.priority = this.priority
  return this.source.run(sink, scheduler)
};

function multicast (stream) {
  var source = stream.source
  return source instanceof MulticastSource
    ? stream
    : new stream.constructor(new MulticastSource(source))
}

function prioritise (priority, stream) {
  return !stream
    ? prioritise.bind(this, priority)
    : new stream.constructor(new Prioritise(priority, stream.source))
}

export { multicast, MulticastSource, prioritise, Prioritise };
//# sourceMappingURL=multicast-prioritise.es.js.map
