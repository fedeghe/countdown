const interval = require('@fedeghe/interval'),
    countdown = (function () {
        var isFunction = function (f) { return typeof f === 'function'; };
        function Countdown (fn, horizont) {
            this.fn = fn;
            this.horizont = horizont;
            this.to = null;
            this.active = false;
            this.paused = false;
            this._onErr = null;
            this._onEnd = null;
            this._onTick = null;
            this.tick = null;
            this.ticker = null;
            this.startPause = 0;
            this.pauseSpan = 0;
        }
        Countdown.prototype.end = function () {
            this.active = false;
            this._onEnd && this._onEnd();
            this.ticker && this.ticker.clear();
            clearTimeout(this.to);
            return this;
        };
        Countdown.prototype.onEnd = function (f) {
            if (isFunction(f)) {
                this._onEnd = f;
            }
            return this;
        };
        Countdown.prototype.onErr = function (f) {
            if (isFunction(f)) {
                this._onErr = f;
            }
            return this;
        };
        Countdown.prototype.pause = function () {
            this.paused = true;
            this.startPause = +new Date();
            this.ticker && this.ticker.pause();
            return this;
        };
        Countdown.prototype.resume = function () {
            this.paused = false;
            // reset horizont removing the pause
            this.pauseSpan = +new Date() - this.startPause;
            this.run(this.horizont - this.pauseSpan);
            this.ticker && this.ticker.resume();
            return this;
        };
        Countdown.prototype.run = function (newHorizont) {
            var self = this;
            this.startTime = this.startTime || +new Date();
            this.active = true;
            this.to = setTimeout(function () {
                try {
                    self.end();
                    self.fn();
                    self.ticker && self.ticker.clear();
                } catch (e) {
                    self._onErr &&
                        self._onErr(e);
                    self.active = false;
                }
            }, newHorizont || this.horizont);
            this.ticker && this.ticker.run();
            return this;
        };
        Countdown.prototype.onTick = function (fn, tick) {
            var self = this;
            this.ticker = interval(function () {
                if (!self.active) return;
                var now = +new Date(),
                    elapsed = now - self.startTime - (self.pauseSpan),
                    remaining = self.horizont - elapsed;
                fn({ elapsed: elapsed, remaining: remaining });
            }, tick);
            return this;
        };
        return function (fn, horizont) {
            return new Countdown(fn, horizont);
        };
    })();
(typeof exports === 'object') && (module.exports = countdown);
