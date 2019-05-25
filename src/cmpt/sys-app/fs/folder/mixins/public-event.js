import lsParse from '../../../lib/ls-parse';

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
    on_public_getList(e) {
      const data = e.data;
      this.dir = data.dir;
      this.list = this.$options._sync.reload(data.list);
      this.error = null;
      this.sort();
      // this.reAcitveItemBefore();

      // const data = lsParse(e.data);
      // const result = this.getDirAndWrapBaseList(data);
      // this.dir = result.dir;
      
      // this.list = result.list;
      // this.sort();

      // this.reAcitveItemAfter();
    },

    on_public_add(e){
      // type, address, data
      let baseItem = this.getBaseItem(e.data);
      const item = this.$options._sync.add(baseItem);
      this.reHiddenBottomSortByItem(item, true);
    },

    on_public_rename({newName, oldName}){
      // type, address, oldName, newName
      const item = this.$options._sync.changeKey(oldName, newName);
      this.reHiddenBottomSortByItem(item);
    },

    on_public_update(e){
      // type, address,  data
      let newItem = lsParse(e.data, true);
      this.wrapBaseItem(newItem);
      const item = this.$options._sync.update(newItem);
      this.reHiddenBottomSortByItem(item);
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



    on_public_uploadStart(e){
      const rawFile = e.rawFile;
      const destItem = {
        name: rawFile.name,
        size: 0,
        totalSize: rawFile.size,
        permission: '----------',
        group: '',
        owner: this.$store.state.username,
        mtime: rawFile.lastModified
      }
      this.wrapBaseItem(destItem);
      const item = this.$options._sync.add(destItem);
      item.isUploading = true;
      this.reHiddenBottomSortByItem(item, true);
    },
    on_public_uploadProgress(e){
      this.$options._sync.update({
        name: e.name,
        isUploading: true,
        size: e.loaded,
        totalSize: e.total
      });
      // let item = this.$options[key];
      // if(!item){
      //   item = this.list.find(v => v.name === e.destItem.name);
      //   item.isUploading = true;
      //   item.totalSize = e.total;
      //   this.$options[key] = item;
      // }
      // item.size = e.loaded;
    },
    on_public_uploadSuccess(e){
      // stdout
      let baseItem = lsParse(e.stdout, true);
      this.wrapBaseItem(baseItem);
      this.initItemStatus(baseItem);
      this.$options._sync.update(baseItem);
    }
    // on_public_uploadLoadend(e){

    // }

  }

}

// Focus 逻辑:
// 选中多个时,不 Focus.
// Focus 一率回显.

// 选中逻辑:
// reload: 清除 // win 10 是清除. 本项目不清除
// 添加时: 回显
// 删除时: 清除 // win 10 是清除. 本项目不清除
// 更新时: 回显