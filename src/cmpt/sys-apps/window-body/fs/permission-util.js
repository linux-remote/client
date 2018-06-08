
export default function initRelation(item, username, groups){
  dataFormat(item);
  const isInGroup = (groups.indexOf(item.group) !== -1);
  const rwxs = item.rwxs;
  let readable = false, writeable = false, accessable = false;
  if(item.owner === username){
    item.is_owner = true;
    readable = rwxs.owner.r;
    writeable = rwxs.owner.w;
    accessable = rwxs.owner.x;
  }
  if(isInGroup){
    item.is_group = true;
    if(!readable){
      readable = rwxs.group.r;
    }
    if(!writeable){
      writeable = rwxs.group.w;
    }
    if(!accessable){
      accessable = rwxs.group.x;
    }
  }
  if(!readable){
    readable = rwxs.other.r;
  }
  if(!writeable){
    writeable = rwxs.other.w;
  }
  if(!accessable){
    accessable = rwxs.group.x;
  }
  item.readable = readable;
  item.writeable = writeable;
  item.accessable = accessable;
  item.is_other = true; //icon 用到了.
  if(item.type === 'Directory'){
    if(!accessable){
      if(readable){
        item.permiss_type = 'list';
      }else{
        item.permiss_type = 'none';
      }
    }else {
      if(item.readable){
        if(item.writeable){
          item.permiss_type = 'full';
        }else{
          item.permiss_type = 'only_read';
        }
      }else {
        if(writeable){
          item.permiss_type = 'only_write';
        }else{
          item.permiss_type = 'none';
        }
      }
    }
  }
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

