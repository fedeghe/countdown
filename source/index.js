var interval = require('@fedeghe/interval'),
    countdown = (function () {
        function Countdown (endFn, horizont, onTick, tick) {
            onTick = onTick || function (){}
            tick = tick || 1e3;
            this.Interval = interval(onTick, tick)
                .endsIn(horizont)
                .onEnd(endFn);
        }
        Countdown.prototype.at = function (ms, fn) {this.Interval.at(ms, fn); return this;};
        Countdown.prototype.run = function (onStart) {this.Interval.run(onStart); return this;};
        Countdown.prototype.pause = function (slide) {this.Interval.pause(slide); return this;};
        Countdown.prototype.resume = function () {this.Interval.resume(); return this;};
        Countdown.prototype.tune = function (ms) {this.Interval.tune(ms); return this;};
        Countdown.prototype.end = function () {this.Interval.end(); return this; };

        Countdown.prototype.onStart = function (f, first) { this.Interval.onStart(f, first); return this;};
        Countdown.prototype.onEnd = function (f) { this.Interval.onEnd(f); return this;};
        Countdown.prototype.onErr = function (f) {
            this.Interval.onErr(f); return this;
        };
        Countdown.prototype.onPause = function (f) {this.Interval.onPause(f); return this;};
        Countdown.prototype.onResume = function (f) {this.Interval.onResume(f); return this;};
        Countdown.prototype.onTune = function (f) {this.Interval.onTune(f); return this;};

        Countdown.prototype.getStatus = function () {
            var status = this.Interval.getStatus(),
                invertedProgress = status.progress - 100;
            status.progress = invertedProgress;
            return status;
        };

        return function (endFn, horizont, onTick, tick) {
            return new Countdown(endFn, horizont, onTick, tick);
        };
    })();
(typeof exports === 'object') && (module.exports = countdown);
