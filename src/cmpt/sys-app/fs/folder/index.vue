<template lang="jade">
.lr-fs-folder(@mousedown='handleFsBodyMousedown',
              :class='bodyClass')
  .lr-hourglass(v-if='isRequest')
  CtrlBar

  Selectable.lr-fs-folder-inner(@end='handleSelectEnd', ref='selectable')
    pre.lr-fs-error(v-text='error', v-if='error')
    table.lr-fs-table(:class='"lr_file_model_" + model', v-else)
      thead
        tr
          th(v-for="key in theads", :key="key", :class="{active: key === sortKey, ['lr_fs_th_' + key]: true}", @mousedown="sortBy(key)") {{LANG.th[key]}}

      tbody.lr-fs-tbody
        tr(v-if='preCreateItem', class='lr-fs-create-layer', @mousedown.stop='')
          td(colspan='7')
            PreCreate(:p='self', @success="handleCreateSuccess")

        RowItem(v-for='(item, i) in list',
                :p='self',
                :key='item.name',
                :index='i',
                :item='item',
                @del="handleItemDel",
                @click='handleItemClick(item, $event)',
                @contextmenu="handleItemContentmenu(item)"
                :selectedLen="$options._selectedItems.size"
                :class='{lr_file_hidden: item.isHidden, lr_file_focus: item.focus,  lr_file_be_selected: item.isBeSelected, lr_file_former: item.focus === 0, lr_file_cut: item.isCut}')
    .lr-fs-empty(v-if='!list.length') This folder is empty.
    div(style="height: 1px")
  Status
  ContextMenu
    .lr-ctx-item(v-if="fsClipBoard", @click='paste') {{LANG.ctx.paste}}
</template>

<script>

import CtrlBar from './ctrl-bar.vue';
import PreCreate from './pre-create.vue';
import RowItem from './row-item.vue';
import Status from './status.vue';
import Selectable from '__ROOT__/cmpt/unit/selectable.vue';
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
import initRelation from './permission-util';
import lsParse from '../../lib/ls-parse';
import {initIconAttr, encodePath, getNewName, parseName} from './util';
import { sortByStrKey , sortByNumberKey} from '../../util';
import SafeBind from '../../../../lib/extend/safe-bind';
let count = 0;
export default {
  extends: SafeBind,
  inject: ['taskWindow'],
  components:{
    CtrlBar,
    PreCreate,
    Status,
    RowItem,
    Selectable,
    ContextMenu
  },
  props: {
    address: {
      type: String,
      required: true
    },
    triggerContainSame: {}
  },

  data(){
    return {
      theads: ['name',  'owner', 'group' ,'permission', 'mtime',  'size'],
      list: [],
      error: null,
      model: 'list',
      listMap: {},
      preCreateItem: null,
      
      currItem: {},
      dir: null,
      isHaveDevice: false,
      isRequest: false,
      sortKey: 'name',

      shouldFocusItemName: null,
      shouldSelectItemNames: null
    }
  },
  computed: {
    self(){
      return this;
    },
    username(){
      return this.$store.state.username
    },
    groups(){
      return this.$store.state.groups
    },
    fsClipBoard() {
      return this.$store.state.fsClipBoard
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
      return this.$store.getters['language/currLanguage'].sys_app_fs
    },
    go(){
      return this.$parent.$refs.navBar.go
    },
    publicEvent(){
      return this.$store.state.fsPublicEvent
    }
  },
  watch: {
    triggerContainSame(newVal, oldVal){
      if(newVal.address !== oldVal.address){
        this.shouldFocusItemName = null; //bug fixed: fs-item focus 跳转后仍存在.
        this.shouldSelectItemNames = null;
        this.currItem = {};
      }
      this.getData();
    },
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
    // $options ?
    on_public_add(e){

      // if(e.item){
      //   let item = lsParse(e.item);
      //   this.wrapItem(e.item);
      //   this.reSortByItem(e.item, true);
      // } else {
      //   this.getData();
      // }
      this.getData();
    },
    on_public_rename({newName, oldName}){
      // type, address, oldName, newName
      let item = this.list.find(v => v.name === oldName);
      if(item){
        item.name = newName;
        if(!item.isFolder){
          initIconAttr(item);
        }
        // this.reSortByItem(item);
      }
    },
    // on_public_update(e){
    //   if(e.item.focus === undefined){
    //     this.wrapItem(e.item);
    //   }
    //   var thisItem = this.list.find((v) => v.name === e.item.name);
    //   if(thisItem){
    //     Object.assign(thisItem, e.item)
    //   }
    // },
    on_public_del(){
      this.getData();
    },
    on_public_cut_in(){
      console.log('cut_in');
      this.getData();
    },
    on_public_cut_out(){
      this.getData();
    },
    on_public_copy_in(e){
      this.getData();
    },
    // on_public_copy_out(){
    //   this.getData();
    // },
    on_public_restore(){
      this.getData();
    },
    on_public_getList(e) {
      if(this.shouldSelectItemNames){
        this.clearSelected();
      }
      const data = lsParse(e.data);
      const result = this.getFormatedListAndDir(data);
      this.dir = result.dir;
      this.error = null;
      this.list = result.list;
      // this.sort(result.list);
      // this.concat(result.list);
      if(this.shouldSelectItemNames){
        this.shouldSelectItemNames = null;
      }
    },

    // ******************* select handler start *******************
    // handleSelectStart(){
    //   count = 0;
    // },
    // handleItemSelecting(){
    //   count = count + 1;
    // },
    handleSelectEnd(){
      const selectedItems = this.list.filter(item => item.isBeSelected);
      this.$options._selectedItems = new Set(selectedItems);
    },

    // ******************* select handler end *******************

    
    handleKeydown(e){ // 必须 设 tabindex 键盘事件才会生效。
      if(e.ctrlKey){
        const key = e.key.toLowerCase();
        switch(key){
          case 'a':
            this.selectAll();
            break;
          case 'c':
            this.copy();
            break;
          case 'x':
            this.cut();
            break;
          case 'v':
            this.paste();
            break;
        }
        e.preventDefault();
      }
    },
    copy() {
      this._cutAndCopy('copy');
    },
    cut() {
      this._cutAndCopy('cut');
    },
    shouldActiveNewItems(filenames){
      if(filenames.length === 1){
        this.shouldFocusItemName = filenames[0];
      } else {
        this.shouldSelectItemNames = filenames;
      }
    },
    paste(){
      const {type, files, address} = this.fsClipBoard;
      if(!files.length || !address){
        return;
      }
      let _files = [];
      files.forEach(v => {
        _files.push(v.name);
      });
      if(address === this.address){
        if(type === 'copy'){
          if(files.length === 1){
            const newFileName = getNewName(this.list, files[0]);
            this.request({
              url: '~/fs/' + encodePath(address),
              type: 'post',
              data: {
                type: 'copy',
                isCopyOneOnSameDir: true,
                srcFile: _files[0],
                destFile: newFileName
              },
              success(stdout){
                this.shouldFocusItemName = newFileName;
                this.$store.commit('fsPublicEmit', {
                  type: 'copy_in',
                  address: this.address,
                  files: [newFileName]
                });
              }
            })
          } else {
            this.$store.commit('error/show', 
              `Can't copy many files on same dir.`);
          }

        } else if(type === 'cut') {
            this.$store.commit('error/show', 
              `Cut and paste is same file.`);
        }
      } else {

        this.request({
          url: '~/fs/' + encodePath(this.address),
          type: 'post',
          data: {
            type,
            srcDir: address,
            files: _files
          },
          success(){
            this.shouldActiveNewItems(_files);
            this.$store.commit('fsPublicEmit', {
              type: type + '_in',
              address: this.address,
              files: _files
            });


            if(type === 'cut'){
              this.$nextTick(() => {
                this.$store.commit('fsPublicEmit', {
                  type: type + '_out',
                  address,
                  files: _files
                });
              });

              this.$store.commit('fsClipBoard/clear');

            }
          }
        });
      }
      return;

    },

    _cutAndCopy(type){
      if(!this.$options._selectedItems.size){
        return;
      }
      const files = [];
      this.$options._selectedItems.forEach(v => {
        files.push(v);
      });
      this.$store.commit('fsClipBoard/set', {
        type,
        address: this.address,
        files
      });
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
    clearSelected(){
      const _set = this.$options._selectedItems;
      if(_set.size){
        _set.forEach(item => {
          item.isBeSelected = false;
        });
        _set.clear();
      }
    },
    selectAll(){
      if(this.currItem) {
        this.currItem.focus = 0;
      }
      const arr = this.list;
      arr.forEach(item => {
        item.isBeSelected = true;
      })
      this.$options._selectedItems = new Set(arr);
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
    //   this.concatList();
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
    getData(){
      if(!this.shouldFocusItemName && this.currItem.focus){
        this.shouldFocusItemName = this.currItem.name;
        this.currItem = {};
      }
      this.request({
        url: '~/fs/' + encodePath(this.address),
        stateKey: 'isRequest',
        data: { dir: true },
        success(data){
          this.$store.commit('fsPublicEmit', {
            type: 'getList',
            address: this.address,
            data: data
          });
        },
        error(xhr){
          this.error = `${xhr.responseText}`
        }
      })
    },
    getFormatedListAndDir(list) {
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

        this.wrapItem(v);
        arr.push(v);

      });
      return {
        list: arr,
        dir
      };
    },

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
    },
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
      })
      this.listMap = map;
      this.concatList();
    },
    getMapArr(v){
      var key = v.isHidden ? 'hidden' : 'normal';
      var key2 = v.isFolder ? 'folderArr' : 'fileArr';
      return this.listMap[key][key2];
    },
    sortBy(key){
      console.log('sortBy', key);
      this.sortKey = key;
      this.sort();
      this.concat(this.list);
    },
    reSortByItem(v, isNew){
      const arr = this.getMapArr(v);
      if(isNew){
        arr.push(v);
      }
      arr.sort((a, b) => {
        return a.name.toUpperCase() > b.name.toUpperCase()
      });
      this.concatList();
    },
    concatList(){
      const map = this.listMap;
      this.list = [].concat(map.normal.folderArr)
      .concat(map.normal.fileArr)
      .concat(map.hidden.folderArr)
      .concat(map.hidden.fileArr);
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
      let focusIndex = arr.findIndex(v => v === this.currItem);;
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
    handleFsBodyMousedown(){
      this.clearSelected();
      this.unFocusCurrItem();
    },

    handleCreateSuccess(name, stdout){
      // data.name = name;
      this.shouldFocusItemName = name;
      this.$store.commit('fsPublicEmit', {
        type: 'add',
        address: this.address,
        item: stdout
      });
    }

  },
  created(){
    this.$options._selectedItems = new Set;
    this.getData();
  },
  mounted(){
    this.safeBind(this.taskWindow.$el, 'keydown', (e) => {
      this.handleKeydown(e);
    });
  }
}
//- th {{LANG.th.owner}}
//- th {{LANG.th.group}}
//- th {{LANG.th.permission}}
//- th {{LANG.th.mtime}}
//- th {{LANG.th.size}}
//-   span.lr_is_device_type(v-if='isHaveDevice') /{{LANG.th.deviceType}}
</script>
