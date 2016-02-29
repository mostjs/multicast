(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('@most/multicast', ['exports', 'most', '@most/prelude'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('most'), require('@most/prelude'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.most, global.prelude);
        global.mostMulticast = mod.exports;
    }
})(this, function (exports, _most, _prelude) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MulticastSource = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var MulticastDisposable = function () {
        function MulticastDisposable(source, sink) {
            _classCallCheck(this, MulticastDisposable);

            this.source = source;
            this.sink = sink;
        }

        _createClass(MulticastDisposable, [{
            key: 'dispose',
            value: function dispose() {
                var s = this.source;
                var remaining = s.remove(this.sink);
                return remaining === 0 && s._dispose();
            }
        }]);

        return MulticastDisposable;
    }();

    function dispose(disposable) {
        if (disposable === void 0) {
            return;
        }

        return disposable.dispose();
    }

    var MulticastSource = function () {
        function MulticastSource(source) {
            _classCallCheck(this, MulticastSource);

            this.source = source;
            this.sinks = [];
            this._disposable = void 0;
        }

        _createClass(MulticastSource, [{
            key: 'run',
            value: function run(sink, scheduler) {
                var n = this.add(sink);

                if (n === 1) {
                    this._disposable = this.source.run(this, scheduler);
                }

                return new MulticastDisposable(this, sink);
            }
        }, {
            key: '_dispose',
            value: function _dispose() {
                var disposable = this._disposable;
                this._disposable = void 0;
                return Promise.resolve(disposable).then(dispose);
            }
        }, {
            key: 'add',
            value: function add(sink) {
                this.sinks = (0, _prelude.append)(sink, this.sinks);
                return this.sinks.length;
            }
        }, {
            key: 'remove',
            value: function remove(sink) {
                this.sinks = (0, _prelude.remove)((0, _prelude.findIndex)(sink, this.sinks), this.sinks);
                return this.sinks.length;
            }
        }, {
            key: 'event',
            value: function event(time, value) {
                var s = this.sinks;

                if (s.length === 1) {
                    s[0].event(time, value);
                    return;
                }

                for (var i = 0; i < s.length; ++i) {
                    s[i].event(time, value);
                }
            }
        }, {
            key: 'end',
            value: function end(time, value) {
                var s = this.sinks;

                if (s.length === 1) {
                    s[0].end(time, value);
                    return;
                }

                for (var i = 0; i < s.length; ++i) {
                    s[i].end(time, value);
                }
            }
        }, {
            key: 'error',
            value: function error(time, err) {
                var s = this.sinks;

                if (s.length === 1) {
                    s[0].error(time, err);
                    return;
                }

                for (var i = 0; i < s.length; ++i) {
                    s[i].error(time, err);
                }
            }
        }]);

        return MulticastSource;
    }();

    function multicast(stream) {
        var source = stream.source;
        return source instanceof MulticastSource ? stream : new _most.Stream(new MulticastSource(source));
    }

    exports.MulticastSource = MulticastSource;
    exports.default = multicast;
});
