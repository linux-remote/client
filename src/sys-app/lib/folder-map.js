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

export default map;