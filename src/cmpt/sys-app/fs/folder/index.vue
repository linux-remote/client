<template lang="jade">
.lr-fs-folder(@mousedown='handleFsBodyMousedown',
              tabindex="-1",
              @keydown="handleKeydown",
              :class='bodyClass')
  .lr-hourglass(v-if='isRequest')
  CtrlBar
  .lr-fs-folder-inner(v-if='error')
    pre.lr-fs-error(v-text='error')
  Selectable.lr-fs-folder-inner(@selectEed='handleSelected', v-else, ref='selectable')
    table.lr-fs-table(:class='"lr_file_model_" + model')
      thead
        tr
          th(v-for="key in theads", :key="key", :class="{active: key === sortKey, ['lr_fs_th_' + key]: true}", @mousedown="sortBy(key)") {{LANG.th[key]}}

      tbody.lr-fs-tbody
        tr(v-if='preCreateItem', class='lr-fs-create-layer', @mousedown.stop='')
          td(colspan='7')
            PreCreate(:p='self')

        RowItem(v-for='(item, i) in list',
                :p='self',
                :key='item.name',
                :index='i',
                :item='item',
                @del="handleItemDel",
                @click='handleItemClick(item, $event)',
                @contextmenu="handleItemContentmenu(item)"
                :selectedLen="$options._selectedItems.size"
                :class='{lr_file_hidden: item.isHidden, lr_file_focus: item.focus,  lr_file_be_selected: item.isBeSelected, lr_file_former: item.focus === 0}')
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
import parse from './parse';
import {initIconAttr, encodePath, getNewName, parseName} from './util';
import { sortByStrKey , sortByNumberKey} from '../../util';
export default {
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
      newItemName: null,
      isRequest: false,
      sortKey: 'name'
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
    fsEvent(){
      return this.$store.state.fsEvent
    }
  },
  watch: {
    triggerContainSame(newVal, oldVal){
      if(newVal.address !== oldVal.address){
        this.newItemName = null; //bug fixed: fs-item focus 跳转后仍存在.
        this.currItem = {};
      }
      this.getData();
    },
    fsEvent(e){
      if(e.address === this.address){
        switch (e.type){
          case 'add':
            if(e.item.focus === undefined){ // 根据 focus 判断有没有 parse 过
              this.wrapItem(e.item)
            }
            this.reSortByItem(e.item, true);
            
          break;
          case 'update':
            if(e.item.focus === undefined){
              this.wrapItem(e.item)
            }
            var thisItem = this.list.find((v) => v.name === e.item.name);
            if(thisItem){
              Object.assign(thisItem, e.item)
            }
          break;
          case 'getList':
          const data = parse(e.data);
          const result = this.getFormatedListAndDir(data);
          this.dir = result.dir;
          this.error = null;

          this.sort(result.list);
          this.concat(result.list);
          break;
          case 'del':
            this.removeItem(e.item);
          break;
        }
      }
    }
  },

  methods: {
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
    paste(){
      const {type, files, address} = this.fsClipBoard;
      let _files = [];
      files.forEach(v => {
        _files.push(v.name);
      });
      if(address === this.address){
        if(type === 'copy'){
          if(files.length === 1){
            const newFileName = getNewName(this.list, files[0]);
            console.log('newFileName', newFileName);
            this.request({
              url: '~/fs/' + encodePath(address),
              type: 'post',
              data: {
                type: 'copy',
                isCopyOneOnSameDir: true,
                srcFile: _files[0],
                destFile: newFileName
              },
              success(){
                this.getData();
              }
            })
          } else {
            console.error(`Can't copy many files on same dir.`);
          }
        }
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
      this.$store.commit('set', {
        fsClipBoard: {
        type,
        address: this.address,
        files
        }
      });
    },
    handleSelected(){
      const selectedItems = this.list.filter(item => item.isBeSelected);
      this.$options._selectedItems = new Set(selectedItems);
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
    removeItem(item){
      const arr = this.getMapArr(item);
      arr.splice(arr.findIndex(v => v === item), 1);
      this.concatList();
    },
    handleItemDel() {
      const _set = this.$options._selectedItems;
      if(_set.size){
        _set.forEach(item => {
          item._del();
        });
        _set.clear();
      }
    },
    getData(){
      this.request({
        url: '~/fs/' + encodePath(this.address),
        stateKey: 'isRequest',
        data: { dir: true },
        success(data){
          this.$store.commit('fsTrigger', {
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
        if(v.name === '..') { // 后端已过滤
          return;
        }

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

      v.focus = false;
      v.isBeSelected = false;

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
        this.focusNewOneItem(item);
      }
    },
    focusNewOneItem(item) {
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
          this.focusNewOneItem(item);
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

  },
  created(){
    this.$options._selectedItems = new Set;
    this.getData();
  }
}

</script>
