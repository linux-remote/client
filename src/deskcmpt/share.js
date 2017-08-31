const obj = {};

export default function share(name, value){
  obj[name] = value;
}

export function unShare(name){
  delete(obj[name]);
}
