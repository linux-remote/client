

//   PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
export function parse(stdout) {
  let str = stdout.trim();
  str = str.split('\n\n');
  const total = parseHead(str[0]);
  const list = parseList(str[1]);
  return {
    total,
    list
  };
}
 // up may: 6min, 
// top - 11:33:59 up 20 days, 16:21,  1 user,  load average: 0.00, 0.01, 0.05
// Tasks: 111 total,   1 running, 110 sleeping,   0 stopped,   0 zombie
// %Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
// KiB Mem : 16266996 total,  4642272 free,  9146116 used,  2478608 buff/cache
// KiB Swap:  2097148 total,  2097148 free,        0 used.  6800528 avail Mem
function parseHead(str) {
  str = str.trim();
  str = str.split('\n');
  const result = _up_user_loadave(str[0]);
  result.tasks = _common(str[1]);
  result.cpus = _common(str[2]);
  result.mem = _common(str[3]); // KiB
  let str_4 = str[4].split('.');
  result.swap = _common(str_4[0]); // KiB
  if(str_4[1]){
    result.mem.avail = _avail_mem(str_4[1]);
  }
  return result;
}
function _up_user_loadave(up_user_loadave){
  up_user_loadave = up_user_loadave.substr(up_user_loadave.indexOf('up ') + 3);
  const userIndex = up_user_loadave.indexOf('user');
  let up = up_user_loadave.substr(0, userIndex);
  up = up.trim();
  let _index = up.lastIndexOf(',');
  let users = up.substr(_index + 1);
  users = users.trim();
  up = up.substr(0, _index);
  _index = up_user_loadave.indexOf(': ');
  let loadAverage = up_user_loadave.substr(_index + 2);
  return {
    up,
    users,
    loadAverage
  }
}
function _common(str){
  str = str.split(': ')[1];
  str = str.split(',');
  let obj = Object.create(null);
  str.forEach(v => {
    v = v.trim();
    v = v.split(/ +/);
    obj[v[1]] = Number(v[0]);
  });
  return obj;
}
function _avail_mem(avail){
  avail = avail.trim();
  const i = avail.indexOf(' ');
  const avail_v = avail.substr(0, i);
  return avail_v;
}
// PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
// 27213 root      20   0 1181148  44804  22792 S 15.3  4.4  29:15.75 node
// 27274 dw        20   0 1181652  44768  22660 S  8.0  4.4  15:03.60 node
// 21524 dw        20   0 1181656  27496  12380 S  7.6  2.7  42:50.83 node
function parseList(str) {
  str = str.trim();
  str = str.split('\n');
  str.shift();
  return str.map(line => {
    line = line.trim();
    line = line.split(/ +/);
    line = line.map((v,i) => {
      if(i < 12){
        return v.trim();
      }
    });
    return {
      pid: Number(line[0]),
      user: line[1],
      cpu: Number(line[8]),
      mem: Number(line[9]),
      time: line[10],
      command: line[11]
    }
  })
}