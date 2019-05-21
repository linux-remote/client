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

      
      if(this.shouldFocusItemName && v.name === this.shouldFocusItemName){
        this.focusNewItem(v);
        this.shouldFocusItemName = null;
      }
      if(this.shouldSelectItemNames){
        let shouldSelectIndex = this.shouldSelectItemNames.indexOf(v.name);
        if( shouldSelectIndex !== -1){
          this.selectItem(v);
          this.shouldSelectItemNames.splice(shouldSelectIndex, 1);
        }
      }
    }
  }

}