import lsParse from '../../../lib/ls-parse';
import {timeFormat} from '__ROOT__/lib/util';
import {handleNameAndIcon} from '../util';
export default  {
  computed: {
    publicEvent(){
      return this.$store.state.fs.publicEvent
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
    publicEmit(e){
      e.srcTaskId = this.taskWindow.id;
      this.$store.commit('fs/publicEmit', e);
    },
    execOnce(e, fn){
      if(e.srcTaskId){
        if(e.srcTaskId === this.taskWindow.id){
          fn();
        }
      } else {
        if(!e.is_exec_once){
          e.is_exec_once = true;
          fn();
        }
      } 
    },
    on_public_getList(e) {
      const data = e.data;
      this.dir = data.dir;
      this.isHaveDevice = e.isHaveDevice;
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
      handleNameAndIcon(item);
      this.reHiddenBottomSortByItem(item);
    },

    on_public_update(e){
      // type, address,  data
      let newItem = lsParse(e.data, true);
      this.wrapBaseItem(newItem);
      const item = this.$options._sync.update(newItem);
      this.reHiddenBottomSortByItem(item);
    },
    on_public_del(e){
      this.clearSelected();
      this.currItem.focus = false;

      this.execOnce(e, () => {
        this.getData();
      });
      
    },
    on_public_cut_in(e){
      this.execOnce(e, () => {
        this.getData();
      });
    },
    on_public_cut_out(e){
      this.execOnce(e, () => {
        this.getData();
      });
    },
    on_public_copy_in(e){
      this.execOnce(e, () => {
        this.getData();
      });
    },
    on_public_restore(e){
      this.execOnce(e, () => {
        this.getData();
      });
    },



    on_public_uploadStart(e){
      const rawFile = e.rawFile;
      const uploadItem = {
        isUploading: true,
        status: 'uploadStart',
        name: rawFile.name,
        size: 0,
        totalSize: rawFile.size,
        permission: '----------',
        owner: this.$store.state.username,
        group: this.$store.state.username,
        mtime: timeFormat(rawFile.lastModified)
      }
      this.wrapBaseItem(uploadItem);
      let isNew = !this.$options._sync.has(uploadItem.name);
      const item = this.$options._sync.set(uploadItem);
      this.reHiddenBottomSortByItem(item, isNew);
    },
    on_public_uploadProgress(e){
      if(this.$options._sync.has(e.name)){
        this.$options._sync.update({
          name: e.name,
          isUploading: true,
          status: 'uploading',
          size: e.loaded,
          totalSize: e.total
        });
      }

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

      // this.$options._sync.update({
      //   name: e.name,
      //   isUploading: false,
      //   status: ''
      // });
      // this.execOnce(e, () => {
      //   this.getData();
      // });
      // stdout
      let baseItem = lsParse(e.stdout, true);
      // console.log('baseItem', baseItem);
      this.wrapBaseItem(baseItem);
      this.initItemStatus(baseItem);
      baseItem.isUploading = false;
      baseItem.status = '';
      this.$options._sync.update(baseItem);
    },
    on_public_uploadAbort(e){
      this.$options._sync.update({
        name: e.name,
        status: 'uploadAbort'
      });
      this.execOnce(e, () => { // $TODO: 代理 服务器重启状态.
        this.delItems([e.name], true);
      });
    },
    on_public_uploadError(e){
      this.$options._sync.update({
        name: e.name,
        status: 'uploadError'
      });
    },
    on_public_uploadTimeout(e){
      this.$options._sync.update({
        name: e.name,
        status: 'uploadTimeout'
      });
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
// 删除时: 清除
// 更新时: 回显