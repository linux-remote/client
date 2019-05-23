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
    on_public_add(e){
      // type, address, filename, data

      let newItem = lsParse(e.data, true);
      this.wrapItem(newItem);
      this.reHiddenBottomSortByItem(newItem, true);

      // this.getData();
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
      // type, address, filename, data

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
    },


    on_public_uploadStart(e){
      const rawFile = e.rawFile;
      const destItem = {
        name: rawFile.name,
        size: 0,
        totalSize: rawFile.size,
        permission: '----------',
        group: '',
        owner: this.$store.state.username,
        mtime: rawFile.lastModified,
        isUploading: true
      }
      this.wrapItem(destItem);
      this.reHiddenBottomSortByItem(destItem, true);
      this.$options[_genUploadOptKey(destItem.name)] = destItem;
    },
    on_public_uploadProgress(e){
      let key = _genUploadOptKey(e.filename);
      let item = this.$options[key];
      if(!item){
        item = this.list.find(v => v.name === e.destItem.name);
        item.isUploading = true;
        item.totalSize = e.total;
        this.$options[key] = item;
      }
      item.size = e.loaded;
    },
    on_public_uploadLoadend(e){
      const key = _genUploadOptKey(e.filename);
      if(this.$options[key]){
        this.$options[key] = null;
        delete(this.$options[key]);
      }
    }

  }

}

function _genUploadOptKey(name) {
  return '_upload_item_' + name;
}
// Focus 逻辑:
// 选中多个时,不 Focus.
// Focus 一率回显.

// 选中逻辑:
// 添加时: 回显
// 删除时: 清除 // win 10 是清除. 本项目不清除
// 更新时: 回显