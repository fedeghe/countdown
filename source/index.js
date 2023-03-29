const interval = require('@fedeghe/interval'),
    countdown = (function () {
        var isFunction = function (f) { return typeof f === 'function'; },
            checkop = function (op, b) {
                var rx = /^([*/+-]{1})?((\d{1,})(\.\d*)?)$/,
                    m = op.match(rx),
                    whole = '', oper;
                if (m) {
                    whole = m[0];
                    oper = m[1];
                }
                if (!oper) whole = '+' + whole;
                // eslint-disable-next-line no-eval
                return m ? eval((b || 0) + '' + whole) : false;
            };
        function Countdown (fn, horizont) {
            this.fn = fn;
            this.horizont = horizont;
            this.baseHorizont = horizont;
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
            this.updates = 0;

            this._onUpdate = null;
            this._update = null;
            this._onPause = null;
            this._pause = null;
            this._onResume = null;
            this._resume = null;
        }

        Countdown.prototype.end = function () {
            this.active = false;
            this._onEnd && this._onEnd();
            this.ticker && this.ticker.end();
            clearTimeout(this.to);
            return this;
        };

        Countdown.prototype.onEnd = function (f) { if (isFunction(f)) { this._onEnd = f; } return this; };

        Countdown.prototype.onErr = function (f) { if (isFunction(f)) { this._onErr = f; } return this; };

        Countdown.prototype.onPause = function (f) { if (isFunction(f)) { this._onPause = f; } return this; };

        Countdown.prototype.onResume = function (f) { if (isFunction(f)) { this._onResume = f; } return this; };

        Countdown.prototype.onUpdate = function (f) { if (isFunction(f)) { this._onUpdate = f; } return this; };

        Countdown.prototype.pause = function () {
            this.paused = true;
            this._onPause && this._onPause(this);
            this.to && clearTimeout(this.to);
            this.startPause = +new Date();
            this.ticker && this.ticker.pause();
            return this;
        };

        Countdown.prototype.resume = function () {
            this.paused = false;
            this._onResume && this._onResume(this);
            // reset horizont removing the pause
            this.pauseSpan = +new Date() - this.startPause;
            this.horizont -= this.pauseSpan;
            this.run(false, true);
            // this.ticker && this.ticker.start();
            this.ticker && this.ticker.resume();
            return this;
        };
        Countdown.prototype.getStatus = function () {
            var now = +new Date(),
                elapsed = now - this.startTime - this.pauseSpan,
                remaining = this.horizont - elapsed + this.updates,
                progress = 100 * elapsed / this.horizont;
            return { elapsed: elapsed, remaining: remaining, progress: progress };
        };
        Countdown.prototype.run = function (onStart, avoid) {
            var self = this;
            this.startTime = this.startTime || +new Date();
            this.active = true;
            onStart && onStart(self);
            this.to = setTimeout(function () {
                try {
                    self.fn();
                    self.end();
                    self.ticker && self.ticker.end();
                } catch (e) {
                    self._onErr &&
                        self._onErr(e, self);
                    self.active = false;
                }
            }, this.horizont);
            !avoid && this.ticker && this.ticker.run();
            return this;
        };

        Countdown.prototype.update = function (amount) {
            this.updates = checkop(String(amount));
            var now = +new Date(),
                elapsed = now - this.startTime - this.pauseSpan,
                remaining = this.baseHorizont - elapsed,
                newHorizont = checkop(String(amount), remaining);
            this.baseHorizont = elapsed + newHorizont;
            if (newHorizont && newHorizont > 0) {
                this._onUpdate && this._onUpdate(this);
                this.horizont = newHorizont;
                this.to && clearTimeout(this.to);
                this.run();
            }
            return this;
        };

        Countdown.prototype.onTick = function (fn, tick) {
            var self = this;
            this.ticker = interval(function (cycle) {
                var now = +new Date(),
                    elapsed = now - self.startTime - self.pauseSpan,
                    remaining = self.baseHorizont - elapsed,
                    progress = 100 * elapsed / self.baseHorizont;
                fn({ cycle: cycle, elapsed: elapsed, remaining: remaining, progress: progress });
            }, tick);
            return this;
        };

        return function (fn, horizont) {
            return new Countdown(fn, horizont);
        };
    })();
(typeof exports === 'object') && (module.exports = countdown);
