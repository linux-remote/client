<template lang="jade">
.lr-fs-folder(@mousedown='handleFsBodyMousedown',
              :class='bodyClass')
  .lr-hourglass(v-if='info.isRequest') Loading...
  CtrlBar(:homeIcon="app.iconUrl")
  .lr-fs-folder_body
    Selectable.lr-fs-folder-inner(@end='handleSelectEnd', ref='selectable')
      pre.lr-fs-error(v-text='info.error', v-if='info.error')
      template(v-else)
        Item(v-for="(item, i) in list",
        @focus="handleItemFocus(item)",
        @mousedown.stop="handleItemMousedown(item, i, $event)",
        :key="item.name", 
        :v="item",
        :class='{lr_file_be_selected: selectedMap[item.name], lr_file_cut: cutMap[item.name]}',
        @dblclick.prevent="handleItemDblClick(item)",
        @remove="removeItem(item)",
        @open="openRealItem(item)",
        @rename="openRenameModal(item, $event)")
  StatusBar(:item="currFocusItem")
    .lr-fs-empty(v-if='!list.length') This folder is empty.
    div(style="height: 1px")
</template>

<script>
import map, {getOrInit, syncFolderMap} from '../../lib/folder-map';
import CtrlBar from './ctrl-bar.vue';
import PreCreate from './pre-create.vue';
import RowItem from './row-item.vue';
import UploadItem from './upload-item.vue';
import Selectable from '__ROOT__/cmpt/unit/selectable.vue';
import initRelation from './permission-util';
import Item from './item.vue';

// import {encodePath} from '__ROOT__/sys-app/util';
import lsParse from '../../lib/ls-parse';
import { sortByStrKey } from '../../util';
import {cwdPathJoin} from '../../lib/util';
// import mixins from './mixins/index';
import SafeBind from '../../../lib/mixins/safe-bind';
import CopyCutPasteMixin from './mixins/copy-cut-paste';
import StatusBar from './status-bar.vue';
import RenameModal from './rename-modal.vue';
import CreateModal from './create-modal.vue';
import OpenWithModal from './open-with-modal.vue';
import parseList from './fs-list-parse';


export default {
  inject: ['taskWindow'],
  provide () {
    return {
      folder: this
    }
  },
  mixins: [CopyCutPasteMixin, SafeBind],
  components:{
    CtrlBar,
    PreCreate,
    RowItem,
    UploadItem,
    Selectable,
    Item,
    StatusBar
  },
  props: {
    app: Object,
    address: {
      type: String,
      required: true
    },
    triggerContainSame: {}
  },

  data(){
    return {
      model: 'list',
      theads: ['name',  'owner', 'group' ,'permission', 'mtime'],
      dir: null,
      folderArr: [],
      fileArr: [],
      isHaveDevice: false,
      error: null,

      preCreateItem: null,

      info: this.getOrInitInfo(this.address),
      selectedMap: Object.create(null),
      selectCount: 0,
      currFocusItem: null,
      isRequest: false,

      sortKey: 'name'
    }
  },
  computed: {
    self(){
      return this;
    },
    list(){
      return this.folderArr.concat(this.fileArr);
    },
    username(){
      return this.$store.state.username;
    },
    groups(){
      return this.$store.state.groups;
    },
    bodyClass(){
      var dir = this.dir;
      if(dir){
        if(dir.isMask){
          return 'lr-fs-dir-mask';
        }
        if(!dir.readable){
          return 'lr-fs-dir-unreadable'
        }
        if(!dir.writeable){
          return 'lr-fs-dir-unwriteable'
        }
        if(dir.isSticky && dir.is_other){
          return 'lr-fs-dir-sticky';
        }
      }
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].sys_app_fs;
    },
    go(){
      return this.$parent.$refs.navBar.go;
    }
  },
  watch: {
    triggerContainSame(newVal, oldVal){
      
      if(newVal.address !== oldVal.address){
        
        // Fixed: FS: 父级目录名一样会focus. https://github.com/linux-remote/linux-remote/issues/184
        this.clearSelected();
        this.handleLeaveDir(oldVal.address);
        this.info = this.getOrInitInfo(newVal.address);
        this.handleEnterDir(newVal.address);
        // this.taskWindow.focusenter();
      }
      this.getData();
    },
    'info.map': function(){
      this.genTwoArr();
      if(this.isNeedReFocusenter()){
        this.$nextTick(() => {
          this.taskWindow.focusenter();
        })
      }
      
      // this.$nextTick(() => {
      //   console.log('re focusenter');
      //   this.taskWindow.focusenter();
      // })
    }
  },

  methods: {
    isNeedReFocusenter(){
      if(this.info._requestWindowId === this.taskWindow.id){
        this.info._requestWindowId = null;
        return true;
      }
      return false;
    },
    sort(folderArr, fileArr){
      sortByStrKey(folderArr, 'name', true);
      sortByStrKey(fileArr, 'name', true);
    },
    // ******************* select handler start *******************
    // handleSelectStart(){
    //   count = 0;
    // },
    // handleItemSelecting(){
    //   count = count + 1;
    // },
    handleItemDblClick(item){
      this.openRealItem(item);
    },
    openRealItem(item){
      if(item.isSymLink){
        if(item.linkTarget){
          const address = this.getLinkAddress(item);
          this.openItem(item.linkTarget, address);
        }
      } else {
        this.openItem(item);
      }
      
    },
    getLinkAddress(item){
      return cwdPathJoin(this.address, item.symbolicLink);
    },
    // getItemAddress(item){
    //   if(item.type === 'symbolicLink'){
    //     return;
    //   }
    //   return this.getItemPath(item.name);
    // },
    getItemPath(name){
      let address = this.address;
      const a = address === '/' ? address : address + '/';
      return a + name;
    },
    openItem(item, address){
      
      const itemAddress = address || this.getItemPath(item.name);

      if(item.type === 'directory'){
        this.go(itemAddress);
      }else if(item.isFile){
        if(item.openApp){
          if(item.category === 'text'){
            this.openByTextApp(item, itemAddress);
          } else {
            this.$store.commit('block/add', {
              type: 'alert',
              status: 'warn',
              title: 'Not supported temporarily',
              text: 'Opening ' + item.category + ' file is not supported temporarily.',
              pid: this.taskWindow.id
            });
          }
        } else {
          this.showOpenWidthModal(item, itemAddress);
        }
        // if(item.openType === 'image'){
        //   return this.windowOpen(address);
        // }
        // if(item.openApp){
        //   this.$store.commit('task/add', {
        //     appId: item.openAppId,
        //     filePath: address
        //   }); 
        // }else{
        //   this.$store.commit('openWith', {
        //     filePath: address
        //   });
        // }
      }
    },
    openByTextApp(item, itemAddress, appId){
      this.$store.commit('task/add', {
        appId: appId || item.openApp.id,
        filePath: itemAddress,
        size: item.size
      });
    },
    showOpenWidthModal(item, itemAddress){
      this.$store.commit('block/add', {
        title: 'Open with',
        width: 300,
        height: 100,
        // enterBindBtn: true,
        cmpt: OpenWithModal,
        pid: this.taskWindow.id,
        propsData: {
          ok : (appId) => {
            this.openByTextApp(item, itemAddress, appId);
          }
        }
      });
    },
    handleSelectEnd(){
      // const selectedItems = this.info.list.filter(item => item.isBeSelected);
      // this.$options._selectedItems = new Set(selectedItems);
    },

    // ******************* select handler end *******************

    
    handleKeydown(e){ // 必须 设 tabindex 键盘事件才会生效。
      if(e.ctrlKey){
        const key = e.key.toLowerCase();
        switch(key){
          case 'a':
            this.selectAll();
            break;
          // case 'c':
          //   this.copy();
          //   break;
          // case 'x':
          //   this.cut();
          //   break;
          // case 'v':
          //   this.paste();
          //   break;
        }
        e.preventDefault();
      }
    },


    handleItemFocus(item){
      this.currFocusItem = item;
    },
    clearSelected(){
      this.selectedMap = Object.create(null);
      this.selectCount = 0;
    },
    handleItemMousedown(item, i, e){
      if(e.button === 2){ // right
        if(e.shiftKey || e.ctrlKey){
          return;
        }
        if(this.isItemSelected(item)){
          return;
        }
        this.clearSelected();
        this.selectItem(item);
        return;
      }
      if(e.shiftKey){
          const pre_focus_item = this.currFocusItem;
          if(!pre_focus_item || pre_focus_item === item){
            this.selectItem(item);
            return;
          }
          let index = this.$options._tmp_shift_selected;
          if(typeof index !== 'number'){
            index = this.list.findIndex(v => v === pre_focus_item);
            if(index === -1){
              index = i;
            }
            this.$options._tmp_shift_selected = index;
          }
          if(index === i){
            this.selectItem(item);
            return;
          }

          let startIndex;
          let endIndex;
          if(i < index){
            startIndex = i;
            endIndex = index;
          } else {
            startIndex = index;
            endIndex = i;
          }
          this.clearSelected();
          for(;startIndex <= endIndex; startIndex++){
            this.selectItem(this.list[startIndex]);
          }
      } else {
        this.$options._tmp_shift_selected = null;
        if(e.ctrlKey){
          if(this.isItemSelected(item)){
            this.unSelectItem(item);
          } else {
            this.selectItem(item);
          }
        } else {
          this.clearSelected();
          this.selectItem(item);
        }
      }


    },
    isItemSelected(item){
      return this.selectedMap[item.name] !== undefined;
    },
    selectItem(item){
      this.selectCount = this.selectCount + 1;
      this.$set(this.selectedMap, item.name, item);
    },
    unSelectItem(item){
      this.selectCount = this.selectCount - 1;
      this.$delete(this.selectedMap, item.name);
    },
    selectAll(){
      this.list.forEach(item => {
        this.selectItem(item);
      })
    },
    handleFsBodyMousedown(){
      this.clearSelected();
      this.currFocusItem = null;
    },
    handleEnterDir(address){
      let data = map[address];
      data.link = data.link + 1;
    },
    handleLeaveDir(address){
      let data = map[address];
      data.link = data.link - 1;
      if(data.link === 0){
        delete(map[address]);
      }
    },
    getOrInitInfo(address){
      let info = getOrInit(address);
      info.showHidden = (address !== this.$store.state.homedir);
      return info;
    },

    getData(){
      const info = this.info;
      if(info.isRequest){
        return;
      }
      info.isRequest = true;
      info._requestWindowId = this.taskWindow.id;
      let cwd = this.address;
      let data = {
        cwd,
        all: info.showHidden
      };
      this.$store.commit('wsRequest', {
        method: 'ls',
        data,
        success: (stdout) => {
          if(cwd !== this.address){
            return;
          }
          info.error = null;
          const list = lsParse(stdout);
          const data = parseList(list);
          
          this.info.map = syncFolderMap(data.list, this.info.map);
          // this.folderArr = data.folderArr;
          // this.fileArr = data.fileArr;
          // info.map = data.map;
          if(data.sysLinkArr.length){
            this.getSysLinkInfo(data.sysLinkArr);
          }
          //  
        },
        complete: () => {
          info.isRequest = false;
        },
        error: (err) => {
          info.error = err;
        }
      });
    },
    getSysLinkInfo(arr){
      let filenames = [];
      arr.forEach(file => {
        filenames.push(file.symbolicLink);
      });
      this.$store.commit('wsRequest', {
        method: 'ls',
        data: {
          cwd: this.address,
          filenames,
        },
        success: (stdout) => {
          let list = lsParse(stdout, true);
          const data = parseList(list);
          list = data.list;
          let updateArr = [];
          filenames.forEach((k, i) => {
            updateArr.push({
              name: arr[i].name,
              linkTarget: list[i]
            });
          });
          this.update(updateArr);
        },
        // complete: () => {
        //   info.isRequest = false;
        // },
        // error: (err) => {
        //   info.error = err;
        // }
      });
    },
    update(updateArr){
      const map = this.info.map;
      updateArr.forEach(obj => {
        if(map[obj.name]){
          Object.assign(map[obj.name], obj);
        }
      })
    },

    genTwoArr(){
      const folderArr = [];
      const fileArr = [];
      const map = this.info.map;
      let file;
      for(let i in map){
        file = map[i];
        if(file.isFolder){
          folderArr.push(file);
        } else {
          fileArr.push(file);
        }
      }
      this.sort(folderArr, fileArr);
      this.folderArr = folderArr;
      this.fileArr = fileArr;
    },
    getDirAndWrapBaseList(list) {
      let arr = [], dir;
      list.forEach( v => {
        // if(v.name === '..') { // 后端已过滤
        //   return;
        // }

        if(v.name === '.'){
          dir = v;
          v.size = Number(v.size);
          initRelation(v, this.username, this.groups);
          return;
        }

        this.wrapBaseItem(v);
        arr.push(v);
      });
      return {
        list: arr,
        dir
      };
    },
    handleCreateSuccess(name, stdout){

      this.publicEmit({
        type: 'add',
        address: this.address,
        data: this.createBaseItem(stdout)
      });
      
      this.$nextTick(() => {
        const item = this.$options._sync.get(name);
        this.selectAndFocusItem(item);
      })
      
    },
    removeItem(){
      const files = Object.keys(this.selectedMap);
      this.$store.commit('wsRequest', {
        method: 'mvToRecycleBin',
        data: {
          cwd: this.address,
          files
        },
        success: (idsAndLen) => {
          const info = this.info;
          files.forEach((filename) => {
            this.clearSelected();
            this.$delete(info.map, filename);
          });// $REVIEW: false data, no request backend.
          this.$root.$emit('delFiles', idsAndLen);
          this.$store.commit('recycleBinChange', idsAndLen.len);
        }
      });
    },
    openRenameModal(item, itemEl){
      this.$store.commit('block/add', {
        title: 'Rname - ' + item.name,
        pid: this.taskWindow.id,
        
        width: 340,
        height: 150,
        enterBindBtn: true,
        cmpt: RenameModal,
        propsData: {
          address: this.address,
          currFilename: item.name,
          success: (newName) => {
            this.handleRenamed(newName, item, itemEl);
          }
        }
      });
    },
    handleRenamed(newName, item){
      const oldName = item.name;
      const map = this.info.map;
      this.$delete(map, oldName);
      this.$delete(this.selectedMap, oldName);
      item.name = newName;
      this.$set(map, newName, item);
      this.selectItem(item);
      // itemEl.focus();
    },
    openCreateModal(type){
      this.$store.commit('block/add', {
        title: 'Create ' + type,
        pid: this.taskWindow.id,
        
        width: 340,
        height: 150,
        enterBindBtn: true,
        cmpt: CreateModal,
        propsData: {
          type,
          address: this.address,
          folder: this
        }
      });
    },
    getNewItemInfo(newName){
      this.$store.commit('wsRequest', {
        method: 'ls',
        data: {
          cwd: this.address,
          filenames: [newName],
        },
        success: (stdout) => {
          let list = lsParse(stdout, true);
          const data = parseList(list);
          list = data.list;
          const newItem = list[0];
          this.currFocusItem = newItem;
          this.$set(this.info.map, newName, newItem);
          this.selectItem(newItem);
        },
        // complete: () => {
        //   info.isRequest = false;
        // },
        // error: (err) => {
        //   info.error = err;
        // }
      });
    }


  },
  created(){
    this.$options._selectedItems = new Set;
    this.handleEnterDir(this.address);
    this.getData();
  },
  mounted(){
    this.safeBind(this.taskWindow.$el, 'keydown', (e) => {
      this.handleKeydown(e);
    });
    // console.log('folder', this.$options._safeBindedList);
  },
  destroyed(){
    this.handleLeaveDir(this.address);
  }
}
//- th {{LANG.th.owner}}
//- th {{LANG.th.group}}
//- th {{LANG.th.permission}}
//- th {{LANG.th.mtime}}
//- th {{LANG.th.size}}
//-   span.lr_is_device_type(v-if='isHaveDevice') /{{LANG.th.deviceType}}

</script>
