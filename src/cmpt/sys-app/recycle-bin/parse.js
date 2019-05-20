import { getDirAndBase } from '../util';
export default function(parsedLsResult) {
  const result = [];
  var map = Object.create(null);
  let errArr = [];
  console.log('parsedLsResult', parsedLsResult)
  parsedLsResult.forEach((v) => {

    let key, 
        isDeledItem,
        lastLinkIndex = v.name.lastIndexOf('.lnk');

    if(lastLinkIndex === -1){
      key = v.name; // Source
      isDeledItem = true;
      
    }else{
      key = v.name.substr(0, lastLinkIndex);
    }

    v.id = key;

    if(!map[key]){
      map[key] = {
        id: key
      };
    }

    let mergeItem = map[key];

    if(isDeledItem){
      mergeItem._isDeledItem = true;
      Object.assign(mergeItem, v);

    }else {

      let source = getDirAndBase(v.symbolicLink);
      source.delTime = v.mtime;
      source.path = v.symbolicLink;
      mergeItem.source = source;
      
    }
    //map[key][subKey] = v;
  });

  for(let i in map){
    let v = map[i];
    if(v._isDeledItem && v.source){
      delete(v._isDeledItem);
      v.size = Number(v.size);
      result.push(v);
    } else {
      errArr.push(v);
    }
  }
  return {
          list: result, 
          error: errArr
        };
}