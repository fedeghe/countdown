'use strict';
/*
Countdown v0.0.7
fedeghe <fedeghe@gmail.com>
$description$
*/
const interval=require("@fedeghe/interval"),countdown=function(){function Countdown(t,n){this.fn=t,this.horizont=n,this.to=null,this.active=!1,this.paused=!1,this._onErr=null,this._onEnd=null,this._onTick=null,this.tick=null,this.ticker=null,this.startPause=0,this.pauseSpan=0,this.updates=0,this._onUpdate=null,this._update=null,this._onPause=null,this._pause=null,this._onResume=null,this._resume=null}var isFunction=function(t){return"function"==typeof t},checkop=function(op,b){var rx=/^([*/+-]{1})?((\d{1,})(\.\d*)?)$/,m=op.match(rx),whole="",oper;return m&&(whole=m[0],oper=m[1]),oper||(whole="+"+whole),!!m&&eval((b||0)+""+whole)};return Countdown.prototype.end=function(){return this.active=!1,this._onEnd&&this._onEnd(),this.ticker&&this.ticker.end(),clearTimeout(this.to),this},Countdown.prototype.onEnd=function(t){return isFunction(t)&&(this._onEnd=t),this},Countdown.prototype.onErr=function(t){return isFunction(t)&&(this._onErr=t),this},Countdown.prototype.onPause=function(t){return isFunction(t)&&(this._onPause=t),this},Countdown.prototype.onResume=function(t){return isFunction(t)&&(this._onResume=t),this},Countdown.prototype.onUpdate=function(t){return isFunction(t)&&(this._onUpdate=t),this},Countdown.prototype.pause=function(){return this.paused=!0,this._onPause&&this._onPause(this),this.to&&clearTimeout(this.to),this.startPause=+new Date,this.ticker&&this.ticker.pause(),this},Countdown.prototype.resume=function(){return this.paused=!1,this._onResume&&this._onResume(this),this.pauseSpan=+new Date-this.startPause,this.horizont-=this.pauseSpan,this.run(!1,!0),this.ticker&&this.ticker.resume(),this},Countdown.prototype.run=function(t,n){var i=this;return this.startTime=this.startTime||+new Date,this.active=!0,t&&t(i),this.to=setTimeout(function(){try{i.fn(),i.end(),i.ticker&&i.ticker.end()}catch(t){i._onErr&&i._onErr(t,i),i.active=!1}},this.horizont),!n&&this.ticker&&this.ticker.run(),this},Countdown.prototype.getStatus=function(){var t=+new Date,n=t-this.startTime-this.pauseSpan;return{elapsed:n,remaining:this.horizont-n+this.updates,progress:100*n/this.horizont}},Countdown.prototype.update=function(t){this.updates=checkop(String(t),this.updates);var n=+new Date,i=n-this.startTime-this.pauseSpan,o=this.horizont-i,e=checkop(String(t),o);return e&&e>0&&(this._onUpdate&&this._onUpdate(this),this.horizont=e,this.to&&clearTimeout(this.to),this.run()),this},Countdown.prototype.onTick=function(t,n){var i=this;return this.ticker=interval(function(n){var o=+new Date,e=o-i.startTime-i.pauseSpan,s=i.horizont-e+i.updates,r=100*e/i.horizont;t({cycle:n,elapsed:e,remaining:s,progress:r})},n),this},function(t,n){return new Countdown(t,n)}}();"object"==typeof exports&&(module.exports=countdown);