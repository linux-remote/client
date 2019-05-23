// copy right from https://github.com/hezedu/SomethingBoring/blob/master/algorithm/only-once-in-time.js
// 2019-5-23 09:56

function OnlyOnceInTime(callback, dealy){
  this.go = callback;
  this.trigger = callback;
  this.dealy = dealy;
  this.isInputing = false;
  this.inputCount = 0;
  this.inputedCount = 0;
  this.timer = null;
}
OnlyOnceInTime.prototype.limit = function () {
  this.trigger = this._limitTrigger;
}
OnlyOnceInTime.prototype.unLimit = function () {
  this.isInputing = false;
  if(this.timer){
    this._clearTimer();
  }
  this.trigger = this.go;
}
OnlyOnceInTime.prototype._limitTrigger = function(){
this.inputCount = this.inputCount + 1;
if(this.isInputing){
  return;
}
this.isInputing = true;
this.inputedCount = this.inputedCount + 1;
this.process();
}
OnlyOnceInTime.prototype._clearTimer = function () {
  this.inputedCount = this.inputCount = 0;
  clearInterval(this.timer);
  this.timer = null;
}
OnlyOnceInTime.prototype.process = function(){
if(this.timer){
  return;
}
this.timer = setInterval(() => {
  this.isInputing = false;
  if(this.inputedCount === this.inputCount){
    this._clearTimer();
  }else{
    this.inputedCount = this.inputCount;
    this.go();
  }
}, this.dealy);
}

export default OnlyOnceInTime;

// console.log('haha')
// let now = Date.now();
// var test = new OnlyOnceInTime(function(){
// let _now = Date.now()
// console.log(_now - now);
// now = _now;
// }, 1000)

// setInterval(() => {
// test.trigger();
// console.log('loop');
// }, 1500)