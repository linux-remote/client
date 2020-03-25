
export default function initRelation(item, username, groups){
  dataFormat(item);
  
  const rwxs = item.rwxs;
  let f, is_owner = false, is_group = false, is_other = false;

  
  if(item.owner === username){
    is_owner = true;
    f = rwxs.owner
  } else if(groups.indexOf(item.group) !== -1){
    is_group = true;
    f = rwxs.group;
  } else {
    is_other = true; 
    f = rwxs.other;
  }

  item.is_owner = is_owner;
  item.is_group = is_group;
  item.is_other = is_other;
  item.readable = f.r;
  item.writeable = f.w;
  item.accessable = f.x;
}

function dataFormat(item){
  const per = item.permission;
  const obj = perFormet(per);
  Object.assign(item, obj);
}


function _get_x(x){
  if(x === 'x') return true;
  if(x === '-') return false;
  return _isLowerCase(x);
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
  return 't' === t.toLowerCase();
}

function perFormet(permission){
  const typeStr = permission[0];
  const mid = permission.substr(1, 9);
  const rwxs = getPer(mid);
  const isMask = permission[10] === '+';
  return {
    type: _getFileType(typeStr),
    rwxs,
    isSticky: isSticky(mid[8]),
    isMask
  }
}

function _isLowerCase(code) {
  return code !== code.toUpperCase()
}

function _getFileType(t){
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

