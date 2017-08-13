class Prioritise {
  constructor (priority, source) {
    this.source = source
    this.priority = priority
  }
  run (sink, scheduler) {
    sink.priority = this.priority
    return this.source.run(sink, scheduler)
  }
}

export default Prioritise
