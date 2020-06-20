const termMap = Object.create(null);

export function termWrite(data){
  const pid = data[1];
  const strData = data[2];
  const term = termMap[pid];
  if(typeof term === 'object'){
    term.write(strData);
  } else {
    if(typeof term !== 'string'){
      termMap[pid] = '';
    }
    termMap[pid] = termMap[pid] + strData;
  }
}

export function termExit(data){
  const pid = data[1];
  const term = termMap[pid];
  if(term){
    delete(termMap[pid]);
    term.close();
  }
}

export default termMap;
