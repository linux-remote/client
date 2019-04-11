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

        RowItem(v-for='(item,i) in list',
                :p='self',
                :key='item.name',
                :index='i',
                :item='item')
    .lr-fs-empty(v-if='!list.length') This folder is empty.
  //-Status
  CreateSysLink(v-if='createSysLinkName')
</template>

<script>

import CtrlBar from './ctrl-bar.vue';
import PreCreate from './pre-create.vue';
import RowItem from './row-item.vue';
import Status from './status.vue';
import Selectable from '__ROOT__/cmpt/unit/selectable.vue';
import CreateSysLink from './create-sys-link.vue';
import initRelation from './permission-util';
import {initIconAttr, encodePath} from './util';
export default {
  components:{
    CtrlBar,
    PreCreate,
    Status,
    RowItem,
    CreateSysLink,
    Selectable
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
      selectedArr: [],
      currItem: {},
      dir: null,
      isHaveDevice: false,
      newItemName: null,
      isRequest: false,

      createSysLinkName: null //创建软链名字
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
              this.parseItem(e.item)
            }
            this.reSortByItem(e.item, true);
            
          break;
          case 'update':
            if(e.item.focus === undefined){
              this.parseItem(e.item)
            }
            var thisItem = this.list.find((v) => v.name === e.item.name);
            if(thisItem){
              Object.assign(thisItem, e.item)
            }
          break;
          case 'getList':
          var arr = [];
          e.list.forEach( v => {
            if(v.name === '..') {
              return;
            }

            if(v.name === '.'){
              this.dir = v;
              v.size = Number(v.size);
              initRelation(v, this.username, this.groups);
              return;
            }
            arr.push(v);
            this.parseItem(v);
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
          this.srot(arr);
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
      this.selectedArr = arr;
    },
    getItemPath(name){
      let address = this.address;
      const a = address === '/' ? address : address + '/';
      return a + name;
    },
    selectAll(e){
      if(e.ctrlKey){
        this.selectedArr = this.$refs.selectable.$children;
        this.selectedArr.forEach((item, i) => {
          item.onSelected(i);
        })
        e.preventDefault();
      }
      //e.stopPropagation();
      
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
          this.error = null;
          this.$store.commit('fsTrigger', {
            type: 'getList',
            address: this.address,
            list: data
          });
        },
        error(xhr){
          this.error = `${xhr.responseText}`
        }
      })
    },
    parseItem(v){
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
    },
    srot(arr){
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
    // focusNewItem(v){
    //   if(this.newItemName && v.name === this.newItemName){
    //     this.itemFocus(v);
    //     this.newItemName = null;
    //   }else if(v.name === this.currItem.name && this.currItem.focus){
    //     this.itemFocus(v);
    //   }else{
    //     v.focus = false;
    //   }
    // },

    itemFocus(item, e){

      let arr = this.$refs.selectable.$children;

      if(e.ctrlKey){ // ctrl
        this.handleItemCtrlClick(item);
      }else if(e.shiftKey){ // shift
        this.handleItemShiftClick(item);
      }else {
        this.clearSelected();
      }

      item.focus = true;
      if(this.currItem !== item){
        this.currItem.focus = false;
        this.currItem = item;
      }
    },
    handleItemCtrlClick(item) {
        console.log('this.currItem.focus', this.currItem.focus)
        if(!this.selectedArr.length && this.currItem.focus === true && !this.currItem.isBeSelected){
          this.currItem.isBeSelected = true;
          this.selectedArr.push(arr.find((v) => v.$data === this.currItem));
        }

        if(!item.isBeSelected){
          item.isBeSelected = true;
          this.selectedArr.push(arr.find((v) => v.$data === item));
        }
    },
    handleItemShiftClick(item){
        this.clearSelected();
        let i1 = arr.findIndex(v => v.$data === item);
        let i2 = arr.findIndex(v => v.$data === this.currItem);
        let start, max;
        if(i1 > i2){
          start = i2;
          max = i1; 
        }else {
          max = i2;
          start = i1;
        }
        //console.log('start', start, 'max', max)
        let arr2 = []
        for(; start <= max; start++){
          arr[start].isBeSelected = true;
          arr2.push(arr[start]);
        }
        this.selectedArr = arr2;
    },
    clearSelected(){
      this.selectedArr.forEach(item => {
        item.onUnSelected();
      })
      this.selectedArr = [];
    },

    handleFsBodyMousedown(){
      this.clearSelected();
      this.currItem.focus = 0;
    }
  },
  created(){
    this.getData();
  }
}

</script>
