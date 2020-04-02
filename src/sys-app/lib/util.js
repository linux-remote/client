function cwdPathJoin(rawCwd, filename){
  if(filename[0] === '/'){
    return filename;
  }
  let cwd = (rawCwd === '/') ? rawCwd : rawCwd + '/';
  let i = filename.indexOf('/');
  if(i === -1){
    return cwd + filename;
  }
  if(i === 1){// ./
    filename = filename.substr(2);
    return cwd + filename;
  }
  const arr = filename.split('/');
  const cwdArr = cwd.split('/');
  let len = cwdArr.length - arr.length;
  if(len < 1){
    throw new Error('cwdPathJoin Error: ' + filename + ' not have dir');
  }
  let newPathArr = [];
  for(let i = 0; i < len; i++){
    newPathArr.push(cwdArr[i]);
  }
  const name = arr[arr.length - 1];
  if(name){ // !../
    newPathArr.push(arr[arr.length - 1]);
  }
  return newPathArr.join('/');
}

module.exports = {
  cwdPathJoin
}