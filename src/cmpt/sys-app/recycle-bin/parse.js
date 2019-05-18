export default function(parsedLsResult) {
  const result = [];
  var map = Object.create(null);
  parsedLsResult.forEach((v) => {
    let key, isSource, lastIndex = v.name.lastIndexOf('.lnk');
    if(lastIndex === -1){
      key = v.name;
      isSource = true;
    }else{
      key = v.name.substr(0, lastIndex);
      let linkTarget = v.symbolicLink;
      // let pathObj = path.parse(linkTarget.linkPath);
      v = {
        delTime: v.mtime,
        // sourceDir: pathObj.dir,
        // name: pathObj.base,
        // isCover: !linkTarget.linkTargetError
      }
    }

    if(!map[key]){
      map[key] = {
        id: key
      };
      result.push(map[key]);
    }
    if(isSource){
      delete(v.name);
      map[key].source = v;
    }else {
      Object.assign(map[key], v);
    }
    //map[key][subKey] = v;
  });
  map = null;
  return result;
}