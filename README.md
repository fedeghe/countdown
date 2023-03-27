[![Coverage Status](https://coveralls.io/repos/github/fedeghe/countdown/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/countdown?branch=master)

# countdown

A really simple function to provide an extented pausable/resumable version of `setTimeout`

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
on longer runs the stability of the ticking function si anyway quite good since internally it is dinamically changing, thus trying with 60 seconds for example one gets:
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
the `countdown` function expects:  
- **a function** : meant to be executed when the countdown is over 
- **an integer**: number of milliseconds for the coundown to finish  

returns an instance of a simple object where the following methods are available:  

- **run(ƒn)** to start it, optionally accepts a function that will be called once started passing the countdown instance
- **end()** to stop it
- **update(exp)** to update the event horizont in milliseconds, valid values are `1000`, `"+1000"`, `"-1000"`, `"*2*"`, `"/2*"`.

- **onErr(fn)** to pass a function that will handle any thrown err
- **onEnd(fn)** to pass a function that will be called additionally when `end` will be called
- **onTick(fn, tickInterval)** to pass a function that will be called with a tick interval passing an object `{cycle, remaining, elapsed}` 
- **onPause(fn)** to pass a function that will be called when `pause` will be called  
- **pause()** to pause it manually
- **onResume(fn)** to pass a function that will be called when `resume` will be called  
- **resume()** to resume it manually


