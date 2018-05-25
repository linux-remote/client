function getFileType(t){
  //https://en.wikipedia.org/wiki/Unix_file_types
  let type;
  switch(t){
    case '-':
      type = 'RegularFile'
      break;
    case 'd':
      type = 'Directory'
      break;
    case 'l':
      type = 'SymbolicLink'
      break;
    case 'p':
      type = 'NamedPipe'
      break;
    case 's':
      type = 'Socket'
      break;
    case 'c':
      type = 'CharacterDevice'
      break;
    case 'b':
      type = 'BlockDevice'
      break;
    case 'D':
      type = 'Door'
      break;
    default:
      type = 'Unknown'
  }
  return type;
}

// function ssUpper(code) {
//     return code === code.toUpperCase()
// }
function isLowerCase(code) {
  return code !== code.toUpperCase()
}

function _get_x(x){
  if(x === 'x') return true;
  if(x === '-') return false;
  return isLowerCase(x);
}

function _get_rwx(i, word){
  return {
    r: word[i] === 'r',
    w: word[i + 1] === 'w',
    x: _get_x(word[i + 2])
  }
}

function getPer(word){
  return {
    owner: _get_rwx(0, word),
    group: _get_rwx(3, word),
    other: _get_rwx(6, word),
  }
}

function isSticky(t){
  //console.log('t', t);
  return 't' === t.toLowerCase()
}

export const perFormet = (permission) => {
  const typeStr = permission[0];
  const mid = permission.substr(1, 9);
  const rwxs = getPer(mid);
  const isMask = permission[10] === '+';
  return {
    type: getFileType(typeStr),
    rwxs,
    isSticky: isSticky(mid[8]),
    isMask
  }
}

export const getNameSuffix = (name) => {
  const index = name.lastIndexOf('.');
  if(index !== 0 && index !== -1){
    return name.substr(index + 1);
  }
}

// export const folderPer = (item) => {
//   const rwxs = item.rwxs;
//   item.readable = rwxs.other.r || rwxs.group.r || rwxs.owner.r
//   item.writeable = rwxs.other.w || rwxs.group.w || rwxs.owner.w
//   console.log('rwxs', rwxs)
//   console.log('item.readable', item.readable)
//   console.log('item.writeable', item.writeable);
//   //item.executable = rwxs.other.x || rwxs.group.x || rwxs.owner.x
//
// }
