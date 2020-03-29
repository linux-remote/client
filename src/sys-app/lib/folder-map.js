const map = Object.create(null);

export function getOrInit(address){
  let info = map[address];
  if(!info){
    info = map[address] = {
      isRequest: false,
      showHidden: true,
      error: null,
      link: 0,
      map: Object.create(null)
    }
  }
  return info;
}

export function syncFolderMap(list, map){
  const newMap = Object.create(null);
  list.forEach(item => {
    let key = item.name;
    let v = map[key];
    if(v){
      Object.assign(v, item);
    } else {
      v = item;
    }
    newMap[key] = v;
  });
  return newMap;
}

export default map;