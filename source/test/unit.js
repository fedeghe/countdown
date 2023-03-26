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
            startPauseAfter = 1e3,
            cd = countdown(function () {
                end = + new Date;
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
        }, horizont+10);
    }).timeout(8000);


    it('should pause-resume using a ticker and end within a good range (2s run, 5 s pause in the middle, 0.01% tolerance)', done => {
        var horizont = 2e3,
            tolerance = horizont * 0.01,
            start = + new Date,
            end,
            pause = 1e3,
            startPauseAfter = 1e3,
            tick = 100,
            ticks = [],
            ended = false,
            cd = countdown(function () {
                end = + new Date;
            }, horizont)
            .onTick(({elapsed, remaining}) => {
                ticks.push(+new Date);
            }, tick)
            .onEnd(() => {
                ended = true
            })
            .run();
            
        
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
            done();
        }, horizont + pause + 10);
    }).timeout(8000);
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