
export default class Sync {
  constructor(opts){
    this.onAdd = opts.onAdd;
    this.key = opts.key;
    this.map = new Map;
  }
  _tmpMap = null;
  set(newItem){
    const key = newItem[this.key];
    if(this.map.has(key)){
      return this._update(key, newItem);
    } else {
      return this._add(key, newItem);
    }
  }
  add(newItem){
    const key = newItem[this.key];
    // if(this.map.has(key)){
    //   return this.map.get(key);
    // }
    return this._add(key, newItem);
  }
  get(mapKey){
    return this.map.get(mapKey);
  }
  has(mapKey){
    return this.map.has(mapKey);
  }
  _add(key, newItem){
    const item = Object.create(null);
    Object.assign(item, newItem);
    this.onAdd(item);
    const map = this._tmpMap || this.map;
    map.set(key, item);
    return item;
  }
  changeKey(oldKey, newKey){
    const item = this.map[oldKey];
    item[this.key] = newKey;
    this.map.set(newKey, item);
    this.map.delete(oldKey);
    return item;
  }
  update(newItem){
    const key = newItem[this.key];
    return this._update(key, newItem);
  }
  _update(key, newItem){
    const item = this.map.get(key);
    Object.assign(item, newItem);
    return item;
  }
  reload(newList){
    const map = this._tmpMap = new Map;
    const list = [];
    newList.forEach((v) => {
      const key = v[this.key];
      let item;
      if(this.map.has(key)){
        item = this._update(key, v);
      } else {
        item = this._add(key, v);
      }
      map.set(key, item);
      list.push(item);
    });
    this.map = map;
    this._tmpMap = null;
    return list;
  }
}

// const obj1 = {a: 'a'}
// Object.assign(obj1, {b: 'b', a: 'c'});
// console.log('obj1', obj1)