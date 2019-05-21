import { sortByStrKey , sortByNumberKey} from '../../../util';

export default  {
  methods: {    
    sort(arr){
      arr = arr || this.list;
      const key = this.sortKey;
      switch(key) {
        case 'size':
        // case 'mtime':
          sortByNumberKey(arr, key);
        break;
        // case 'mtime':
        //   sortByNumberKey(arr, '_mtime', true);
        //   break;
        default:
          sortByStrKey(arr, key);
      }
    },
    concat(arr){
      const map = {
        normal: {
          folderArr: [],
          fileArr: []
        },
        hidden: {
          folderArr: [],
          fileArr: []
        }
      }
      arr.forEach(v => {
        let key = 'normal'
        if(v.isHidden){
          key = 'hidden';
        }
        if(v.isFolder){
          map[key].folderArr.push(v);
        }else{
          map[key].fileArr.push(v);
        }
      });
      this.$options._listMap = map;
      this.concatList();
    },
    getMapArr(v){
      const map = this.$options._listMap;
      var key = v.isHidden ? 'hidden' : 'normal';
      var key2 = v.isFolder ? 'folderArr' : 'fileArr';
      return map[key][key2];
    },
    sortBy(key){
      this.sortKey = key;
      this.sort();
      this.concat(this.list);
    },

    // reSortByItem(v, isNew){
    //   const arr = this.getMapArr(v);
    //   if(isNew){
    //     arr.push(v);
    //   }
    //   this.concatList();
    // },
    concatList(){
      const map = this.$options._listMap;

      this.list = [].concat(map.normal.folderArr)
      .concat(map.normal.fileArr)
      .concat(map.hidden.folderArr)
      .concat(map.hidden.fileArr);

    }
  }

}