
import { parseName } from './util';

import { getOpenInfo } from './open-register';

const iconTypeMap = {
  regularFile: 'nuvola/unknown.png',
  directory: 'nuvola/folder-blue_open.png',
  symbolicLink: 'nuvola/link.png',
  socket: 'nuvola/socket.png',
  blockDevice: 'nuvola/blockdevice-3.png',
  characterDevice: 'nuvola/chardevice.png',
  namedPipe: 'nuvola/pipe.png',
  unknown: 'nuvola/unknown.png'
}

const iconIndexs = Object.keys(iconTypeMap);

function parseList(list){
  let result = [];
  list.forEach(line => {
    const obj = Object.create(null);
    obj.name = line[0];
    obj.type = iconIndexs[line[1]];
    obj.icon = iconTypeMap[obj.type];
    const isFolder = obj.type === 'directory';
    obj.isFolder = isFolder;
    const isFile = obj.type === 'regularFile';
    obj.isFile = isFile;
    obj.isSymLink = obj.type === 'symbolicLink';
    obj.linkTarget = null;
    if(isFile){
      Object.assign(obj, parseName(obj.name));
      const openInfo = getOpenInfo(obj.suffix);
      Object.assign(obj, openInfo);
    }
    result.push(obj);
  });
  return result;
}

export default parseList;
