// function SimpleEvent(){
//   this.preventDefaulted = false;
// }

// // https://github.com/eslint/eslint/issues/11752
// SimpleEvent.prototype.preventDef = function(){
//   this.preventDefaulted = false;
// }
export default class SimpleEvent{
  preventDefaulted = false;
  preventDefault(){
    this.preventDefaulted = true;
  }
}