import { getDirAndBase } from '../util';
export default function(folderMap) {
  const result = [];
  var map = Object.create(null);
  Object.keys(folderMap).forEach(k => {
    const item = folderMap[k];
    let key, 
        isDeletedItem,
        lastLinkIndex = item.name.lastIndexOf('.lnk');

    if(lastLinkIndex === -1){
      key = item.name; // Source
      isDeletedItem = true;
      
    }else{
      key = item.name.substr(0, lastLinkIndex);
    }

    item.id = key;

    if(!map[key]){
      map[key] = {
        id: key
      };
    }

    let mergeItem = map[key];

    if(isDeletedItem){
      mergeItem._isDeledItem = true;
      Object.assign(mergeItem, item);

    }else {
      let source = getDirAndBase(item.symbolicLink);
      // source.delTime = item.mtime;
      source.path = item.symbolicLink;
      mergeItem.source = source;
      mergeItem.delTime = item.mtime;
      if(mergeItem.size === undefined){
        mergeItem.size = item.size;
      }
    }
  });

  for(let i in map){
    let v = map[i];
    if(v._isDeledItem && v.source){
      delete(v._isDeledItem);
      v.size = Number(v.size);
      result.push(v);
    } else {
      if(!v.source){
        v.source = {
          base: '???'
        }
      }
      // v.source.base = "Error";
      // if(!v.size){
      //   v.size = 0;
      // }
      v.isError = true;
      console.log(v)
      result.push(v);
    }
  }
  return result;
}