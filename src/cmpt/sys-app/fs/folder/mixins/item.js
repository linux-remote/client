import {encodePath} from '__ROOT__/cmpt/sys-app/util';

export default  {
  data(){
    return {
      currItem: {},
      shouldFocusItemName: null,
      shouldSelectItemNames: null
    }
  },
  methods: {

    shouldActiveNewItems(filenames){
      if(filenames.length === 1){
        this.shouldFocusItemName = filenames[0];
      } else {
        this.shouldSelectItemNames = filenames;
      }
    },

    getItemPath(name){
      let address = this.address;
      const a = address === '/' ? address : address + '/';
      return a + name;
    },

    selectItem(item) {
      item.isBeSelected = true;
      this.$options._selectedItems.add(item);
    },

    unSelectItem(item) {
      item.isBeSelected = false;
      this.$options._selectedItems.delete(item);
    },

    focusItem(item) {
      item.focus = true;
      if(this.currItem !== item){
        this.currItem.focus = false;
        this.currItem = item;
      }
    },

    // removeItem(item){
    //   const arr = this.getMapArr(item);
    //   arr.splice(arr.findIndex(v => v === item), 1);
    // },
    handleItemDel() {
      const _set = this.$options._selectedItems;
      let files = [];
      _set.forEach(v => {
        files.push(v.name);
      });
      this.request({
        type: 'post',
        stateKey: 'isRequest',
        url: '~/fs/' + encodePath(this.address),
        data: {
          type: 'del',
          files
        },
        success(){
          this.$store.commit('recycleBinTrigger');
          this.$store.commit('fsPublicEmit', {
            type: 'del',
            files,
            address: this.address
          });
          _set.clear();
        }
      });
    },

    handleItemContentmenu(item){// win 10 list mode have bug.
      if(!item.isBeSelected){
        this.focusNewItem(item);
      }
    },

    focusNewItem(item) {
      this.clearSelected();
      this.selectItem(item);
      this.focusItem(item);
    },

    handleItemClick(item, e) {
      if(e.shiftKey) {
        this.handleItemShiftClick(item);
        this.$options._isPreClickShirt = true;
      } else {
        this.$options._isPreClickShirt = false;
        if(e.ctrlKey){ // ctrl
          this.handleItemCtrlClick(item);
        } else {
          this.focusNewItem(item);
        }
      }
    },

    handleItemCtrlClick(item) {
      this.unFocusCurrItem();
      if(!item.isBeSelected) {
        this.selectItem(item);
        this.focusItem(item);
      } else {
        this.unSelectItem(item);
        this.focusItem(item);
        this.unFocusCurrItem();
      }
    },
    // _checkIsContinuity(i1, i2){
    //   let i = i1;
    //   const arr = this.list;
    //   for(; i < i2; i ++) {
    //     if(!arr[i].isBeSelected){
          
    //     }
    //   }
    // },
    handleItemShiftClick(item){
      const arr = this.list;
      let currIndex = arr.findIndex(v => v === item);
      let firstSelectIndex;
      let focusIndex = arr.findIndex(v => v === this.currItem);
      if (this.$options._isPreClickShirt) {
        firstSelectIndex = arr.findIndex(v => {
          return v.isBeSelected;
        });
      } else {
        firstSelectIndex = focusIndex;
      }
      if(firstSelectIndex === -1) {
        firstSelectIndex = 0;
      }
      let start, max;
      if(currIndex > firstSelectIndex){ // 选择了第一行下面
        start = firstSelectIndex;
        max = currIndex;

      }else { // 选择了上面
        start = currIndex;
        max = focusIndex;
      }
      // console.log('start', start, 'max', max, 'currIndex', currIndex, 'firstSelectIndex', firstSelectIndex);
      this.clearSelected();
      let arr2 = [];
      for(; start <= max; start++){
        arr[start].isBeSelected = true;
        arr2.push(arr[start]);
      }
      this.$options._selectedItems = new Set(arr2);
      this.focusItem(item);
      this.unFocusCurrItem();
    },

    unFocusCurrItem() {
      this.currItem.focus = 0;
    },
  }

}