[![Coverage Status](https://coveralls.io/repos/github/fedeghe/countdown/badge.svg?branch=master)](https://coveralls.io/github/fedeghe/countdown?branch=master)

# countdown

A really simple function to provide an extented pausable/resumable version of `setTimeout`

``` js
countdown(function () {
    // this will be called when the countdown is over
    console.log('END: ', +new Date());
}, 1000)
// onTick is optional
.onTick(({ remaining, elapsed }) => {
    console.log('ticking: ', remaining, elapsed, +new Date());
}, 100)
// run is not, if we want to start the countdown
.run();

```
will produce
```
ticking: 898 102 1679868411397
ticking: 798 202 1679868411497
ticking: 699 301 1679868411596
ticking: 598 402 1679868411697
ticking: 500 500 1679868411795
ticking: 400 600 1679868411896
ticking: 300 700 1679868411995
ticking: 199 801 1679868412096
ticking: 98 902 1679868412197
END: 1679868412296
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
the `countdown` function returns an instance of a simple object where the following methods are available:
- **run()** to start it
- **end()** to stop it
- **onErr(fn)** to pass a function that will handle any thrown err
- **onEnd(fn)** to pass a function that will be called additionally when `end` will be called
- **onTick(fn, tickInterval)** to pass a function that will be called with a tick interval passing an object `{remaining, elapsed}` 
- **pause()**
- **resume()**


