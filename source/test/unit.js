var assert = require('assert'),
    countdown = require('../dist/index.js');

describe('basic operations', () => {
    
    it('should end within a good range, use at,onStart,onEnd,getStatus (2s run, 0.01% tolerance)', done => {
        var horizont = 2e3,
            tolerance = horizont * 0.01,
            start,
            end,
            elapsed,
            status,
            started = false,
            ended = false,
            ated = false,
            cd = countdown(function ({at}) {
                    end = at;
                    elapsed = end - start;
                }, horizont, () => {}, 50)
                .onStart(({ at }) => (started = true, start = at))
                .onEnd(({ at }) => (ended = true, end = at))
                .at(760, () => (ated = true))
                .run();

        setTimeout(() => (status = cd.getStatus()), 450);

        setTimeout(function () {
            assert.equal(end- start - horizont < tolerance, true);
            assert.ok(started);
            assert.ok(ended);
            assert.ok(ated);
            assert.ok(elapsed >= horizont);
            assert.ok(elapsed <= horizont + tolerance);
            assert.ok(status.elapsed >= 450);
            assert.ok(status.elapsed <= 450 * (1.01));
        
            done();
        }, horizont + 10);
        
    }).timeout(3000);

    it('should pause-resume and end within a good range (2s run, 5 s pause in the middle, 0.01% tolerance)', done => {
        var horizont = 2e3,
            tolerance = horizont * 0.01,
            start = + new Date,
            end,
            pause = 5e3,
            startPauseAfter = 1e3,
            ci = countdown(function () {
                    end = +new Date();
                }, horizont)
                .run();
        setTimeout(function () {
            ci.pause()
        }, startPauseAfter);
        setTimeout(function () {
            ci.resume()
        }, startPauseAfter + pause);
        setTimeout(function () {
            assert.equal(end- start - horizont - pause < tolerance, true);
            done();
        }, horizont+pause+10);
    }).timeout(8000);

    it('should pause-resume using a ticker and end within a good range (2s run, 5 s pause in the middle, 0.01% tolerance)', done => {
        var horizont = 2e3,
            tolerance = horizont * 0.01,
            start = + new Date,
            end,
            pause = 1e3,
            paused = false,
            resumed = false,
            startPauseAfter = 1e3,
            tick = 100,
            ticks = [],
            ended = false,
            status = false,
            progresses = [],
            ci = countdown(function () {
                    end = + new Date;
                }, horizont, ({elapsed, remaining, cycle, progress, at}) => {
                    progresses.push(progress);
                    ticks.push(at);
                }, tick)
                .onPause(() => {paused = true})
                .onResume(() => {resumed = true})
                .onEnd(() => { ended = true; })
                .run( ({ i }) => {
                    setTimeout(() => {
                        status = i.getStatus();
                    }, pause)
                });
        setTimeout(function () {
            ci.pause()
        }, startPauseAfter);
        setTimeout(function () {
            ci.resume()
        }, startPauseAfter + pause);
            
        setTimeout(function () {
            assert.equal(end- start - horizont - pause < tolerance, true);
            assert.ok(ticks.length >= 9);
            assert.ok(ticks.length <= 11);
            assert.ok(ended);
            assert.ok(paused);
            assert.ok(resumed);
            assert.ok(progresses.length && progresses.reduce((a, s) => a + s, 0) > 0);
            assert.ok(status.elapsed - startPauseAfter < tolerance);
            assert.ok(status.remaining - (horizont - startPauseAfter) < tolerance);
            assert.ok(status.progress > 45 && status.progress < 55);
            done();
        }, horizont + pause + 10);
    }).timeout(8000);

    it('should tune as expected the countdown (0.01% tolerance)', done => {
        var horizont = 2e3,
            tolerance = 0.01,
            up = 5e3,
            after = 1e3,
            start,
            end,
            tuned = false,
            ci = countdown(function ({at}) {
                    end = at;
                }, horizont)
                .onTune(() => {
                    tuned = true;
                })
                .run(({at}) => {
                    start = at;
                });

        setTimeout(() => {
            ci.tune(up);
            ci.tune(up);
            ci.tune(up);
            ci.tune(up);
        }, after)
        
        setTimeout(function () {
            var e = end - start;
            assert.equal(e < (horizont + up*4) * (1 + tolerance), true);
            assert.ok(tuned);
            done();
        }, horizont + up*4 + 10);
    }).timeout(25000);
    it('should stop as expected', done => {
        var horizont = 1e3,
            start, end;
        cd = countdown(
                ({at}) => (end = at),
                horizont,
                ({cycle}) => {
                    if (cycle > 5) throw new Error("this is an error")
                },
                100
            )
            .onEnd(({at}) => {
                var elapsed = at - start,
                    elapsed2 = end - start;
                assert(elapsed === elapsed2);
                assert(elapsed < 820);
                assert(elapsed > 780);
                done()
            })
            .run(({at}) => {start = at});
        setTimeout(() => {
            cd.end()
        }, 800)
    });
    it('should throw an error', done => {
        var horizont = 1e3;
        countdown(
            ({at}) => console.log(`Ended at ${at}`),
            horizont,
            ({cycle}) => {
                if (cycle > 5) throw new Error("this is an error")
            },
            100
        )
        .onErr(function ({ error }) {
            assert.equal(error instanceof Error, true);
            done()
        })
        .run();
    }).timeout(8000);
});
