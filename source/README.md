[![Coverage Status](https://coveralls.io/repos/github/fedeghe/countdown/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/countdown?branch=master)

# countdown <sub><small>(v. $PACKAGE.version$)</small></sub>

A really simple function to provide and extended isomorphic version of the native `setTimeout` which can be
- paused / resumed
- updated while running
- have a ticking function

``` js
let end, start;
countdown(function () {
    // this will be called when the countdown is over
    end = +new Date();
    console.log(`ENDED in ${end-start}ms`, +new Date());
}, 1000)
// onTick is optional
.onTick(({ remaining, elapsed, cycle, progress }) => {
    console.log(`tick #${cycle} : ${progress}% [${remaining} | ${elapsed}]`, +new Date());
}, 100)
// run is not, if we want to start the countdown
.run(() => {
    start = +new Date();
    console.log(`STARTED at ${start}`)
});
```
will produce
```
STARTED at 1680118831385
tick #0 : 10.1% [899 | 101] 1680118831487
tick #1 : 20.1% [799 | 201] 1680118831586
tick #2 : 30.1% [699 | 301] 1680118831686
tick #3 : 40.1% [599 | 401] 1680118831786
tick #4 : 50.2% [498 | 502] 1680118831887
tick #5 : 60.1% [399 | 601] 1680118831986
tick #6 : 70.2% [298 | 702] 1680118832087
tick #7 : 80.1% [199 | 801] 1680118832186
tick #8 : 90.2% [98 | 902] 1680118832287
tick #9 : 100.1% [-1 | 1001] 1680118832386
ENDED in 1008ms 1680118832393
```


<details>
<summary>but one might want to add or subtract time while running</summary>

``` js
var start, end;
countdown(function () {
    end = +new Date();
    console.log(`ENDED in ${end-start}ms`, +new Date());
}, 1000)
    .onTick(({ remaining, elapsed, cycle, progress }) => {
        console.log(`tick #${cycle} : ${progress}% [${remaining} | ${elapsed}]`, +new Date());
    }, 100)
    .onUpdate(() => console.log(`updating after ${+new Date() - start}`))
    // run is not, if we want to start the countdown
    .run(i => {
        start = +new Date();
        console.log(`STARTED at ${start}`);
        setTimeout(() => i.update(1000), 500);
        setTimeout(() => i.update(-300), 700);
    });
```
getting
```
STARTED at 1680120475512
tick #0 : 10.100% [899 | 101] 1680120475613
tick #1 : 20.100% [799 | 201] 1680120475713
tick #2 : 30.100% [699 | 301] 1680120475813
tick #3 : 40.100% [599 | 401] 1680120475913
tick #4 : 50.100% [499 | 501] 1680120476013
updating after 510
tick #6 : 30.050% [1399 | 601] 1680120476113
tick #7 : 35.050% [1299 | 701] 1680120476213
updating after 709
tick #9 : 47.059% [900 | 800] 1680120476312
tick #10 : 53.000% [799 | 901] 1680120476413
tick #11 : 58.824% [700 | 1000] 1680120476512
tick #12 : 64.765% [599 | 1101] 1680120476614
tick #13 : 70.647% [499 | 1201] 1680120476713
tick #14 : 76.471% [400 | 1300] 1680120476812
tick #15 : 82.353% [300 | 1400] 1680120476912
tick #16 : 88.353% [198 | 1502] 1680120477014
tick #17 : 94.176% [99 | 1601] 1680120477113
ENDED in 1700ms 1680120477212
```

</details>



---
---
---


### _API_
the `countdown` function expects as parameters:  
- **a function** : meant to be executed when the countdown is over 
- **an integer**: the _"event horizont"_; number of milliseconds for the coundown to complete 

returns an instance of a simple object where the following methods are available:  

- **`run(ƒn)`** to start it, optionally accepts a function that will be called once started receiving the countdown instance

- **`onTick(fn, tickInterval)`** to pass a function that will be called with a tick interval passing an object `{cycle, remaining, elapsed, progress}` 
- **`update(number)`** to live add (positive number) or remove (negative number) `number` milliseconds to the event horizont    
- **`getStatus()`** returns an object `{remaining, elapsed, progress}`
- **`onUpdate(fn)`** to pass a function that will be invoked when update is called `fn` will be invoked receiving the instance 
- **`onErr(fn)`** to pass a function that will handle any thrown err; `fn` will be invoked receiving the error and the instance 
- **`end()`** to stop it
- **`onEnd(fn)`** to pass a function that will be called additionally when `end` will be called; `fn` will be invoked receiving the instance 
- **`pause()`** to pause it manually
- **`onPause(fn)`** to pass a function that will be called when `pause` will be called; `fn` will be invoked receiving the instance   
- **`resume()`** to resume it manually
- **`onResume(fn)`** to pass a function that will be called when `resume` will be called; `fn` will be invoked receiving the instance   


