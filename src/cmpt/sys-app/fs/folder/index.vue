<template lang="jade">
.lr-fs-folder(@mousedown='handleFsBodyMousedown',
              tabindex=-1,
              @keydown.a='selectAll',
              :class='bodyClass')
  .lr-hourglass(v-if='isRequest')
  //- CtrlBar
  .lr-fs-folder-inner(v-if='error')
    pre.lr-fs-error(v-text='error')
  Selectable.lr-fs-folder-inner(:onSelected='handleSelected', v-else, ref='selectable')
    table.lr-fs-table(:class='"lr_file_model_" + model')
      thead
        tr
          th {{LANG.th.name}}
          th {{LANG.th.owner}}
          th {{LANG.th.group}}
          th {{LANG.th.permission}}
          th {{LANG.th.mtime}}
          th {{LANG.th.size}}
            span.lr_is_device_type(v-if='isHaveDevice') /{{LANG.th.deviceType}}
      tbody.lr-fs-tbody
        tr(v-if='preCreateItem', class='lr-fs-create-layer', @mousedown.stop='')
          td(colspan='7')
            PreCreate(:p='self')

        RowItem(v-for='(item, i) in list',
                :p='self',
                :key='item.name',
                :index='i',
                :item='item',
                @click='handleItemClick(item, $event)',
  :class='{lr_file_hidden: item.isHidden, lr_file_focus: item.focus,  lr_file_be_selected: item.isBeSelected, lr_file_former: item.focus === 0}')
    .lr-fs-empty(v-if='!list.length') This folder is empty.
  //-Status
  CreateSysLink(v-if='createSysLinkName')
  ContextMenu
    .lr-ctx-item
      | new Folder
</template>

<script>

import CtrlBar from './ctrl-bar.vue';
import PreCreate from './pre-create.vue';
import RowItem from './row-item.vue';
import Status from './status.vue';
import Selectable from '__ROOT__/cmpt/unit/selectable.vue';
import CreateSysLink from './create-sys-link.vue';
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
import initRelation from './permission-util';
import {initIconAttr, encodePath} from './util';
export default {
  components:{
    CtrlBar,
    PreCreate,
    Status,
    RowItem,
    CreateSysLink,
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
      theads: ['名称',  '所有者', '用户组' ,'权限', '修改日期',  '大小/设备类型'],
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

      createSysLinkName: null, //创建软链名字

      _selectedItems: new Set
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
      return this.$store.getters['language/currLanguage'].sys_app_file
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
          this.sort(e.list);
          break;
          case 'del':
            this.removeItem(e.item);
          break;
        }
      }
    }
  },
  methods: {
    handleSelected(arr){
      this.$data._selectedItems = new Set(arr);
    },
    getItemPath(name){
      let address = this.address;
      const a = address === '/' ? address : address + '/';
      return a + name;
    },

    selectItem(item) {
      item.isBeSelected = true;
      this.$data._selectedItems.add(item);
    },
    unSelectItem(item) {
      item.isBeSelected = false;
      this.$data._selectedItems.delete(item);
    },
    clearSelected(){
      const _set = this.$data._selectedItems;
      if(_set.size){
        _set.forEach(item => {
          item.isBeSelected = false;
        });
        _set.clear();
      }
    },
    selectAll(e){
      if(e.ctrlKey){
        if(this.currItem) {
          this.currItem.focus = 0;
        }
        const arr = this.list;
        arr.forEach(item => {
          item.isBeSelected = true;
        })
        this.$data._selectedItems = new Set(arr);

        e.preventDefault();
      }
      //e.stopPropagation();
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
    getData(){
      this.request({
        url: '~/fs/' + encodePath(this.address),
        stateKey: 'isRequest',
        data: {dir: true},
        success(data){
          const result = this.getFormatedListAndDir(data);
          this.dir = result.dir;
          this.error = null;
          this.$store.commit('fsTrigger', {
            type: 'getList',
            address: this.address,
            list: result.list
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
        if(v.name === '..') {
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
        //this.focusNewItem(v);
        /*
        {
          accessable,
          focus,
          permission, // raw
          owner, // raw
          group, // raw
          mtime, // raw
          name, // raw
          size, // raw
          suffix,
          type,
          writeable,
          isFolder,
          isHidden,
          isMask, // isACL
          isSticky,
          is_group,
          is_other,
          is_owner,
          openType,
          readable,
          rwxs,
        }
        */
      });
      arr = this.sortByName(arr);
      return {
        list: arr,
        dir
      };
    },
    sortByName(arr) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      return arr.sort((a, b) => {
          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
      })
    },
    wrapItem(v){
      v.size = Number(v.size);
      initRelation(v, this.username, this.groups);

      const _syl = v.symbolicLink;
      if(_syl){
        v.isSymbolicLink = true;
        v.linkPath = _syl.linkPath;
        v.linkTargetError = _syl.linkTargetError;
        if(!v.linkTargetError){
          v.permission = _syl.permission;
          v.owner = _syl.owner;
          v.group = _syl.group;
        }
      }

      if(v.name[0] === '.'){
        v.isHidden = true;
      }else{
        v.isHidden = false;
      }

      if(v.type === 'Directory'){
        v.isFolder = true;
      }else{
        v.isFolder = false;
      }

      if(v.type === 'RegularFile'){
        initIconAttr(v);
      }
      if(v.device_type && !this.isHaveDevice){
        this.isHaveDevice = true;
      }
      v.focus = false;
      v.isBeSelected = false;
    },
    sort(arr){
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
          key = 'hidden'
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
    reSortByItem(v, isNew){
      const arr = this.getMapArr(v);
      if(isNew){
        arr.push(v);
      }
      //console.log(arr);
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



    handleItemClick(item, e) {
      if(e.shiftKey) {
        this.handleItemShiftClick(item);
        this.$options._isPreClickShirt = true;
      } else {
        this.$options._isPreClickShirt = false;
        if(e.ctrlKey){ // ctrl
          this.handleItemCtrlClick(item);
        } else {
          this.clearSelected();
          this.selectItem(item);
          this.focusItem(item);
        }
      }

    },

    handleItemCtrlClick(item) {
      if(!item.isBeSelected) {
        this.selectItem(item);
        this.focusItem(item);
      } else {
        this.unSelectItem(item);
        if(item.focus){
          this.unFocusCurrItem();
        }
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
      this.$data._selectedItems = new Set(arr2);
      this.focusItem(item);
    },


    unFocusCurrItem() {
      this.currItem.focus = 0;
    },
    handleFsBodyMousedown(){
      this.clearSelected();
      this.unFocusCurrItem();
    }
  },
  created(){
    this.getData();
  }
}

</script>
