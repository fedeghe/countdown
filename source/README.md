[![codecov](https://codecov.io/gh/fedeghe/countdown/graph/badge.svg?token=6A5Y8909U6)](https://codecov.io/gh/fedeghe/countdown)

# countdown <sub><small>(v. $PACKAGE.version$)</small></sub>

A really simple function to provide and extended version of the native `setTimeout` which can be
- paused / resumed
- updated while running
- have a ticking function

``` js
let end, start;
countdown(
    ({ at }) =>
        console.log(`ENDED in ${at-start}ms (${at})`),
    1000,
    ({ remaining, elapsed, cycle, progress, at }) => 
        console.log(
            `tick #${cycle} : ${progress}%`,
            `[${remaining} | ${elapsed}]`,
            at
        ),
    100
)
// run is not, if we want to start the countdown
.run(({ at }) => {
    start = at;
    console.log(`STARTED at ${start}`);
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
ENDED in 1008ms
```


<details>
<summary>but one might want to add or subtract time while running</summary>

``` js
var start, end;
countdown(
    ({ at }) => 
        console.log(`ENDED in ${at-start}ms`, at),
    1000,
    ({ remaining, elapsed, cycle, progress, at }) => 
        console.log(
            `tick #${cycle} : ${progress}%`,
            `[${remaining} | ${elapsed}]`,
            at
        ),
    100
)
.onTune(({ at }) =>
    console.log(`updating after ${at - start}`)
)
.at(500, ({ i }) => i.tune(1000))
.at(700, ({ i }) => i.tune(-300))
// run is not, if we want to start the countdown
.run(({ at }) => {
    start = at;
    console.log(`STARTED at ${start}`);
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
**`countdown(endƒn, horizont ms, tickƒn, tick ms)`**  

factory method expects as parameters:  
- **endƒn** \<ƒunction\> : meant to be executed when the countdown is over 
- **horizont** \<integer\>: the _"event horizont"_; number of milliseconds for the coundown to complete  
- _tickƒn_ \<tickƒn\>: meant to be executed when ticking  (default () => {})
- _tick_ \<integer\>: the _"tick period"_; number of milliseconds between two consequtive ticks (default 100ms))  


returns an instance of a simple object where the following methods are available:  

- **`run(ƒn)`** to start it, optionally accepts a function that will be called once started receiving the countdown instance


- **`pause(_slide_ <bool>)`** to pause it manually; when a truthy value is passed for _slide_ then this pause will not only stop the tick notifications (if any set) but will also slide forward the end of the countdown set as _horizont_.
- **`resume()`** to resume it manually
- **`tune(number)`** to live add (positive number) or remove (negative number) `number` milliseconds to the event horizont    
- **`end()`** to stop it
- **`getStatus()`** returns an object `{remaining, elapsed, progress}`

- **`onPause(ƒn)`** to pass a function that will be called when `pause` will be called; `ƒn` will be invoked receiving _**some info**_   
- **`onResume(ƒn)`** to pass a function that will be called when `resume` will be called; `ƒn` will be invoked receiving _**some info**_   
- **`onTune(ƒn)`** to pass a function that will be invoked when tune is called `ƒn` will be invoked receiving _**some info**_ 
- **`onEnd(ƒn)`** to pass a function that will be called additionally when `end` will be called; `ƒn` will be invoked receiving _**some info**_ 
- **`onErr(ƒn)`** to pass a function that will handle any thrown err; `ƒn` will be invoked receiving the error and _**some info**_ 


_**some info**_ consists in a object containing: 
- **`at`**: the epoch of the event 
- **`cycle`**: an integer containing the currect cycle of notification  
- **`elapsed`**: the elapsed time (pauses included)   
- **`effective`**: the elapsed time (pauses excluded)
- **`remaining`**: the remaining time
- **`progress`**: the progress percentage (float, precision 3)
- **`status`**: the status of the instance among `['init', 'running', 'paused', 'ended', 'error']`