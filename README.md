[![Coverage Status](https://coveralls.io/repos/github/fedeghe/countdown/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/countdown?branch=master)

# countdown <sub><small>(v. 0.0.8)</small></sub>

A really simple function to provide and extended version of `[native] setTimeout` which can be
- paused / resumed
- updated while running
- have a ticking function

``` js
countdown(function () {
    // this will be called when the countdown is over
    console.log('END: ', +new Date());
}, 1000)
// onTick is optional
.onTick(({ remaining, elapsed, cycle }) => {
    console.log(`tick ${cycle} : `, remaining, elapsed, +new Date());
}, 100)
// run is not, if we want to start the countdown
.run(() => {
    console.log(`STARTED: ${+new Date()}`)
});
```
will produce
```
STARTED: 1679957709007
tick 0 :  899 101 1679957709109
tick 1 :  799 201 1679957709208
tick 2 :  697 303 1679957709310
tick 3 :  593 407 1679957709414
tick 4 :  496 504 1679957709511
tick 5 :  399 601 1679957709608
tick 6 :  298 702 1679957709709
tick 7 :  199 801 1679957709808
tick 8 :  99 901 1679957709908
tick 9 :  -2 1002 1679957710009
END:  1679957710035
```
on longer runs the stability of the ticking function is anyway quite good since internally it is dinamically changing, thus trying with 60 seconds for example one gets:
```
ticking: 59898 102 1679868459589
ticking: 59800 200 1679868459686
ticking: 59699 301 1679868459787
...
...
...
ticking: 299 59701 1679868519187
ticking: 198 59802 1679868519288
ticking: 100 59900 1679868519386
END: 1679868519487
```




### _API_
the `countdown` function expects as parameters:  
- **a function** : meant to be executed when the countdown is over 
- **an integer**: the _"event horizont"_; number of milliseconds for the coundown to complete 

returns an instance of a simple object where the following methods are available:  

- **`run(ƒn)`** to start it, optionally accepts a function that will be called once started receiving the countdown instance

- **`onTick(fn, tickInterval)`** to pass a function that will be called with a tick interval passing an object `{cycle, remaining, elapsed, progress}` 
- **`update(exp)`** to update the event horizont in milliseconds, it can be used to add subtract time to the horizont and to divide and multiply it:  

    | exp | effect |
    |-----|--------|
    | 1000 | add 1000 ms |
    | "+1000" | add 1000 ms |
    | "-1000" | subtract 1000 ms |
    | "*2" | double the current horizont |
    | "/2" | halve the current horizont |

    Notice: the update will happen only if the result ∈ ℝ
    
- **`getStatus()`** returns an object `{remaining, elapsed, progress}`
- **`onUpdate(fn)`** to pass a function that will be invoked when update is called `fn` will be invoked receiving the instance 
- **`onErr(fn)`** to pass a function that will handle any thrown err; fn will be invoked receiving the error and the instance 
- **`end()`** to stop it
- **`onEnd(fn)`** to pass a function that will be called additionally when `end` will be called; fn will be invoked receiving the instance 
- **`pause()`** to pause it manually
- **`onPause(fn)`** to pass a function that will be called when `pause` will be called; fn will be invoked receiving the instance   
- **`resume()`** to resume it manually
- **`onResume(fn)`** to pass a function that will be called when `resume` will be called; fn will be invoked receiving the instance   


