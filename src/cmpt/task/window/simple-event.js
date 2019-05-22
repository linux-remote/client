// function SimpleEvent(){
//   this._isPreventDefault = false;
// }

// // https://github.com/eslint/eslint/issues/11752
// SimpleEvent.prototype.preventDef = function(){
//   this._isPreventDefault = false;
// }
export default class SimpleEvent{
  _isPreventDefault = false;
  preventDefault(){
    this._isPreventDefault = true;
  }
}