
export default class Sync {
  constructor(opts){
    this.onAdd = opts.onAdd;
    this.key = opts.key;
    this.map = new Map;
    this.list = [];
  }
  _tmpMap = null;
  _tmpList = null;
  add(newItem){
    const item = Object.create(null);
    Object.assign(item, newItem);
    this.onAdd(item);
    const key = item[this.key];
    const map = this._tmpMap || this.map;
    const list = this._tmpList || this.list;
    map.set(key, item);
    list.push(item);
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
    const item = this.map.get(key);
    Object.assign(item, newItem);
    return item;
  }
  reload(newList){
    const map = this._tmpMap = new Map;
    const list = this._tmpList = [];
    newList.forEach((v) => {
      const key = v[this.key];
      if(this.map.has(key)){
        const item = this.update(v);
        map.set(key, item);
        list.push(item);
      } else {
        this.add(v);
      }
    });
    
    this.map = map;
    this.list = list;
    this._tmpMap = null;
    this._tmpList = null;
    return this.list;
  }
}

// const obj1 = {a: 'a'}
// Object.assign(obj1, {b: 'b', a: 'c'});
// console.log('obj1', obj1)