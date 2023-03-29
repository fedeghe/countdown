var assert = require('assert'),
    countdown = require('../dist/index.js');

describe('basic operations', () => {
    
    it('should end within a good range (2s run, 0.01% tolerance)', done => {
        var horizont = 2e3,
            tolerance = horizont * 0.01,
            start = + new Date,
            end,
            c1 = countdown(function () {
                end = + new Date;
            }, horizont).run();

        setTimeout(function () {
            assert.equal(end- start - horizont < tolerance, true);
            done();
        }, horizont+10);
        
    }).timeout(3000);

    it('should pause-resume and end within a good range (2s run, 5 s pause in the middle, 0.01% tolerance)', done => {
        var horizont = 2e3,
            tolerance = horizont * 0.01,
            start = + new Date,
            end,
            pause = 5e3,
            startPauseAfter = 1e3;
        var cd = countdown(function () {
                
                end = +new Date();
            }, horizont).run();

        setTimeout(function (){
            cd.pause()
        }, startPauseAfter)

        setTimeout(function (){
            cd.resume()
        }, startPauseAfter + pause)
        
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
            cd = countdown(function () {
                end = + new Date;
            }, horizont)
            .onPause(() => {paused = true})
            .onResume(() => {resumed = true})
            .onTick(({elapsed, remaining, cycle, progress}) => {
                progresses.push(progress);
                ticks.push(+new Date);
            }, tick)
            .onEnd(() => {
                ended = true
            })
            .run( i => {
                setTimeout(() => {
                    status = i.getStatus();
                }, pause)
            });
            
        
        setTimeout(function (){
            cd.pause();
        }, startPauseAfter);
        setTimeout(function (){
            cd.resume();
        }, startPauseAfter + pause);
        setTimeout(function () {
            assert.equal(end- start - horizont - pause < tolerance, true);
            assert.ok(ticks.length >= 19);
            assert.ok(ticks.length <= 21);
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



    it('should update as expected the countdown (0.01% tolerance)', done => {
        var horizont = 2e3,
            tolerance = 0.01,
            up = 5e3,
            after = 1e3,
            start,
            end,
            updated = false,
            cd = countdown(function () {
                end = + new Date;
            }, horizont).run(() => {
                start = + new Date;
            }).onUpdate(() => {
                updated = true;
            });
        setTimeout(function (){
            cd.update(up);
            cd.update(up);
            cd.update(up);
            cd.update(up);
        }, after);
        
        setTimeout(function () {
            var e = end - start;
            assert.equal(e < (horizont + up*4) * (1 + tolerance), true);
            assert.ok(updated);
            done();
        }, horizont + up*4 + 10);
    }).timeout(25000);




    it('should throw an error', done => {
        var horizont = 2e3,
            failed = false;
        countdown(function () {
            throw "this is an error"
        }, horizont)
        .onErr(() => {
            failed = true
        })
        .run();
            
        
        setTimeout(function () {
            assert.ok(failed);
            done();
        }, horizont + 10);
    }).timeout(8000);


});
