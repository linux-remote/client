
import { parseName, getFileType } from './util';

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

function parseList(list){
  // let folderArr = [];
  // let fileArr = [];
  let sysLinkArr = [];
  // const map = Object.create(null);
  list.forEach(file => {
    file.type = getFileType(file.permission);
    file.icon = iconTypeMap[file.type];
    const isFolder = file.type === 'directory';
    file.isFolder = isFolder;
    const isFile = file.type === 'regularFile';
    file.isFile = isFile;
    file.isSymLink = file.type === 'symbolicLink';
    file.linkTarget = null;
    if(isFile){
      Object.assign(file, parseName(file.name));
      const openInfo = getOpenInfo(file.suffix);
      Object.assign(file, openInfo);
    } else {
      if(file.isSymLink){
        sysLinkArr.push(file);
      }
    }
  });
  return {
    list,
    sysLinkArr
  };
}

export default parseList;
