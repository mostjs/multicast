import dispose from 'most/lib/disposable/dispose'

export default class FakeDisposeSource {
  constructor (disposer, source) {
    this.source = source
    this.disposable = dispose.create(disposer)
  }

  run (sink, scheduler) {
    return dispose.all([this.source.run(sink, scheduler), this.disposable])
  }

  static from (disposer, stream) {
    return new FakeDisposeSource(disposer, stream.source)
  }
}
