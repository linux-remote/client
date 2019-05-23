import lsParse from '../../../lib/ls-parse';
import {initIconAttr, parseName} from '../util';

export default  {
  computed: {
    publicEvent(){
      return this.$store.state.fsPublicEvent
    }
  },
  watch: {
    publicEvent(e){
      if(e.address === this.address){
        let methodKey = 'on_public_' + e.type;
        if(this[methodKey]){
          this[methodKey](e);
        } else {
          console.warn('un handle fs event: ' + methodKey);
        }
      }
    }
  },
  methods: {
    on_public_add(){
      // type, address, filename, data
      
      this.getData();
    },
    on_public_rename({newName, oldName}){
      // type, address, oldName, newName
      let item = this.list.find(v => v.name === oldName);
      if(item){
        item.name = newName;
        Object.assign(item, parseName(newName));
        if(item.type === 'RegularFile'){
          initIconAttr(item);
        }
        this.reHiddenBottomSortByItem(item);
      }
    },
    on_public_update(e){
      const myItem = this.list.find(v => v.name === e.filename);
      if(myItem){
        let newItem = lsParse(e.data, true);
        
        this.wrapItem(newItem);
        Object.assign(myItem, newItem);

        this.reHiddenBottomSortByItem(myItem);
      }
    },
    on_public_del(){
      this.getData();
    },
    on_public_cut_in(){
      this.getData();
    },
    on_public_cut_out(){
      this.getData();
    },
    on_public_copy_in(){
      this.getData();
    },
    on_public_restore(){
      this.getData();
    },
    on_public_getList(e) {
      this.reAcitveItemBefore();

      const data = lsParse(e.data);
      const result = this.getFormatedListAndDir(data);
      this.dir = result.dir;
      this.error = null;
      this.list = result.list;
      this.sort();

      this.reAcitveItemAfter();
    }

  }

}
// Focus 逻辑:
// 选中多个时,不 Focus.
// Focus 一率回显.

// 选中逻辑:
// 添加时: 回显
// 删除时: 清除 // win 10 是清除. 本项目不清除
// 更新时: 回显