import { sortByStrKey , sortByNumberKey} from '../../../util';

export default  {
  methods: {    
    sort(arr){
      arr = arr || this.list;
      const key = this.sortKey;
      switch(key) {
        case 'name':
            this.hiddenBottomSort();
          break;
        case 'size':
          sortByNumberKey(arr, key);
          break;
        default:
          sortByStrKey(arr, key);
      }
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
    },


    initHiddenBottomListMap(){
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
      this.list.forEach(v => {
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
    },
    concatHiddenBottomList() {
      const map = this.$options._listMap;
      this.list = [].concat(map.normal.folderArr)
      .concat(map.normal.fileArr)
      .concat(map.hidden.folderArr)
      .concat(map.hidden.fileArr);
    },
    hiddenBottomSort(){
      sortByStrKey(this.list, 'name');
      this.initHiddenBottomListMap();
      this.concatHiddenBottomList();
    },
    reHiddenBottomSortByItem(v){ // 可减少整体排序, 只排 4 处中的 1 处.
      const arr = this.getMapArr(v);
      sortByStrKey(arr, 'name');
      this.concatHiddenBottomList();
    },
  }

}