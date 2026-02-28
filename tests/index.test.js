var countdown = require('../dist/index.js');

describe('basic operations', () => {
    jest.setTimeout(30000);
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
            expect(end- start - horizont < tolerance).toBe(true);
            expect(started).toBe(true);
            expect(ended).toBe(true);
            expect(ated).toBe(true);
            expect(elapsed >= horizont).toBe(true);
            expect(elapsed <= horizont + tolerance).toBe(true);
            expect(status.elapsed >= 450).toBe(true);
            expect(status.elapsed <= 450 * (1.01)).toBe(true);
        
            done();
        }, horizont + 10);
        
    });
//jest.setTimeout(8000);
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
            expect(end- start - horizont - pause < tolerance).toBe(true);
            done();
        }, horizont+pause+10);
    });

    //jest.setTimeout(8000);
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
            expect(end- start - horizont - pause < tolerance).toBe(true);
            expect(ticks.length >= 9).toBe(true);
            expect(ticks.length <= 11).toBe(true);
            expect(ended).toBe(true);
            expect(paused).toBe(true);
            expect(resumed).toBe(true);
            expect(progresses.length > 0 && progresses.reduce((a, s) => a + s, 0) > 0).toBe(true);
            expect(status.elapsed - startPauseAfter < tolerance).toBe(true);
            expect(status.remaining - (horizont - startPauseAfter) < tolerance).toBe(true);
            expect(status.progress > 45 && status.progress < 55).toBe(true);
            done();
        }, horizont + pause + 10);
    });

    //// jest.setTimeout(25000);
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
            expect(e < (horizont + up*4) * (1 + tolerance)).toBe(true);
            expect(tuned).toBe(true);
            done();
        }, horizont + up*4 + 10);
    });

    
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
                expect(elapsed === elapsed2).toBe(true);
                expect(elapsed < 820).toBe(true);
                expect(elapsed > 780).toBe(true);
                done()
            })
            .run(({at}) => {start = at});
        setTimeout(() => {
            cd.end()
        }, 800)
    });
    //jest.setTimeout(8000);
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
            expect(error instanceof Error).toBe(true);
            done()
        })
        .run();
    });
});
