import MulticastDisposable from './MulticastDisposable';
import {append, remove, findIndex} from './util';

function dispose(disposable) {
    if (disposable === void 0) {
        return;
    }
    return disposable.dispose();
}

export default class MulticastSource {
  constructor(source) {
      this.source = source;
      this.sinks = [];
      this._disposable = void 0;
  }

  run(sink, scheduler) {
      const n = this.add(sink);
      if (n === 1) {
          this._disposable = this.source.run(this, scheduler);
      }
      return new MulticastDisposable(this, sink);
  }

  _dispose() {
      const disposable = this_disposable;
      this._disposable = void 0;
      return Promise.resolve(disposable).then(dispose);
  }

  add(sink) {
      this.sinks = append(sink, this.sinks);
      return this.sinks.length;
  }

  remove(sink) {
      this.sinks = remove(findIndex(sink, this.sinks), this.sinks);
      return this.sinks.length;
  }

  event(time, value) {
      const s = this.sinks;
      if (s.length === 1) {
          s[0].event(time, value);
          return;
      }
      for (let i = 0; i < s.length; ++i) {
          s[i].event(time, value);
      }
  }

  end(time, value) {
      const s = this.sinks;
      if (s.length === 1) {
          s[0].end(time, value);
          return;
      }
      for (let i = 0; i < s.length; ++i) {
          s[i].end(time, value);
      }
  }

  error(time, err) {
      const s = this.sinks;
      if (s.length === 1) {
          s[0].end(time, err);
          return;
      }
      for (let i = 0; i < s.length; ++i) {
          s[i].end(time, err);
      }
  }
}
