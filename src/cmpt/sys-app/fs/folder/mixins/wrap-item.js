import initRelation from '../permission-util';
import {initIconAttr, parseName} from '../util';
export default  {
  methods: {    
    wrapItem(v){

      v.size = Number(v.size);
      // v._mtime = (new Date(v.mtime)).getTime();
      initRelation(v, this.username, this.groups);


      if(v.name[0] === '.'){
        v.isHidden = true;
      }else{
        v.isHidden = false;
      }

      if(v.type === 'Directory'){
        v.isFolder = true;
      }else{
        v.isFolder = false; // 非文件夹: basename, suffix
        Object.assign(v, parseName(v.name));
      }

      if(v.type === 'RegularFile'){// 普通文件, 设置 icon.
        initIconAttr(v);
      }
      if(v.device_type && !this.isHaveDevice){
        this.isHaveDevice = true;
      }

      
      v.isCut = false;
      v.focus = false;
      v.isBeSelected = false;

      
      this.reAcitveItem(v);
    },
    reAcitveItemBefore(){
      if(!this.$options._shouldFocusItemName && this.currItem.focus){
        this.$options._shouldFocusItemName = this.currItem.name;
        this.currItem = {};
      }
      if(!this.$options._shouldFocusItemName && !this.$options._shouldSelectItemNames){
        let oldSelecteds = this.$options._selectedItems;
        if(oldSelecteds.size) {
          let arr = [];
          oldSelecteds.forEach(v => {
            arr.push(v.name);
          });
          this.$options._shouldSelectItemNames = arr;
        }
      }

      this.clearSelected();
    },
    reAcitveItem(v){
      if(this.$options._shouldFocusItemName && v.name === this.$options._shouldFocusItemName){
        this.selectAndFocusItem(v);
        this.$options._shouldFocusItemName = null;

      } else if(this.$options._shouldSelectItemNames){
        let newNames = this.$options._shouldSelectItemNames;
        let index = newNames.indexOf(v.name);
        if( index !== -1){
          this.selectItem(v);
          newNames.splice(index, 1);
        }
      }
    },

    reAcitveItemAfter() {
      this.$options._shouldFocusItemName = null;
      this.$options._shouldSelectItemNames = null;
    }
  }

}