<template lang="jade">
.lr-fs-folder(@mousedown='handleFsBodyMousedown', :class='bodyClass')
  CtrlBar
  .lr-fs-folder-inner(v-if='error')
    pre.lr-fs-error(v-html='error')
  Selectable.lr-fs-folder-inner(:onSelected='handleSelected')
    table.lr-table.lr-fs-folder-table
      tr
        th 名称
        th 所有者
        th 用户组
        th 权限
        th 修改日期
        th 大小
          span.lr_is_device_type(v-if='isHaveDevice') /设备类型
      tr(v-if='preCreateItem', class='lr-fs-create-layer')
        td(colspan='7')
          PreCreate(:p='self')

      RowItem(v-for='(item,i) in list',
              :p='self',
              :key='item.name',
              :index='i',
              :item='item')
    h1(style='text-align: right;height: 1000px')
      div(style='float:right;background: red;width: 2000px;') bottom
    .lr-empty(v-if='!list.length') Empty
  Status
</template>

<script>

import CtrlBar from './ctrl-bar.vue';
import PreCreate from './pre-create.vue';
import RowItem from './row-item.vue';
import Status from './status.vue';
import Selectable from '__ROOT__/cmpt/unit/selectable-area.no-store';

import initRelation from './permission-util';
import {getNameSuffix, getOpenType, getOpenAppIcon, encodePath} from './util';
export default {
  components:{
    CtrlBar,
    PreCreate,
    Status,
    RowItem,

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
      listMap: {},
      preCreateItem: null,
      selectedArr: [],
      currItem: {},
      dir: null,
      isHaveDevice: false,
      newItemName: null
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
    go(){
      return this.$parent.$refs.navBar.go
    }
  },
  watch: {
    triggerContainSame(newVal, oldVal){
      if(newVal.address !== oldVal.address){
        this.newItemName = null; //bug fixed: fs-item focus 跳转后仍存在.
        this.currItem = {};
      }
      this.getData();
    }
  },
  methods: {
    handleSelected(arr){
      this.selectedArr = arr;
    },

    getData(){
      this.request({
        url: '~/fs/' + encodePath(this.address),
        stateKey: 'isRequest',
        data: {dir: true},
        success(data){
          var arr = [];
          data.forEach( v => {
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
            this.focusNewItem(v);
          });
          this.srot(arr);
        },
        error(xhr){
          this.error = `${xhr.responseText}`
        }
      })
    },
    parseItem(v){
      v.focus = false;
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
        v.suffix = getNameSuffix(v.name);
        v.openType = getOpenType(v.suffix);
        const openApp= getOpenAppIcon(v.openType);
        if(openApp){
          v.openApp = openApp.app;
          v.openAppId = openApp.id;
        }
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
    reSortByItem(v, isNew){
      var key = v.isHidden ? 'hidden' : 'normal';
      var key2 = v.isFolder ? 'folderArr' : 'fileArr';
      var arr = this.listMap[key][key2];
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
    focusNewItem(v){
      if(this.newItemName && v.name === this.newItemName){
        this.itemFocus(v);
        this.newItemName = null;
      }else if(v.name === this.currItem.name && this.currItem.focus){
        this.itemFocus(v);
      }else{
        v.focus = false;
      }
    },
    itemFocus(item){
      this.clearSelected();
      item.focus = true;
      if(this.currItem === item){
        return;
      }
      this.currItem.focus = false;
      this.currItem = item;
    },
    clearSelected(){
      this.selectedArr.forEach(item => {
        item.beSelected = false;
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


    // handleFsItemContextmenu(item, e){
    //   const self = this;
    //   this.itemFocus(item);
    //   const data = [
    //     {name: 'Create Symbolic Link',
    //       handleClick(){
    //         const name = item.name + '.lnk';
    //         self.request({
    //           type: 'post',
    //           url: '~/fs' + self.getItemPath(item.name),
    //           data: {
    //             type: 'createSymbolicLink',
    //             name: item.name + '.lnk'
    //           },
    //           success(){
    //             self.newItemName = name;
    //             self.getData();
    //           }
    //         })
    //       }
    //     },

    //     }
    //   ];

    //   if(item.type === 'RegularFile' || item.type === 'Directory'){

    //     if(item.type === 'RegularFile' && item.readable){
    //       data.unshift({
    //         name: 'download',
    //         handleClick(){
    //           self.download(item);
    //         }
    //       })
    //     }

    //     data.unshift({
    //       name: 'Open',
    //       handleClick(){
    //         self.openItem(item)
    //         console.log('handleClick open');
    //       }
    //     })

    //   }

    //   contextmenuStore.commit('open', {
    //     data,
    //     top: e.clientY,
    //     left: e.clientX
    //   });
    // },
    // handleFsBodyContextmenu(e){
    //   const self = this;
    //   contextmenuStore.commit('open', {
    //     data: [{
    //       name: 'New File',
    //       handleClick(){
    //         const name = 'new-' + Date.now();
    //         self.request({
    //           type: 'POST',
    //           url: '~/fs' + self.address,
    //           data: {
    //             name,
    //             type: 'createFile'
    //           },
    //           success(){
    //             self.newItemName = name;
    //             self.getData();
    //           }
    //         })
    //       }
    //     },
    //     {
    //       name: 'New Folder',
    //       handleClick(){
    //         const name = 'new-' + Date.now()
    //         self.request({
    //           type: 'POST',
    //           url: '~/fs' + self.address,
    //           data: {
    //             name,
    //             type: 'createFolder'
    //           },
    //           success(){
    //             self.newItemName = name;
    //             self.getData();
    //           }
    //         })
    //       }
    //     },
    //     {
    //       name: 'Refresh',
    //       handleClick(){
    //         self.getData();
    //       }
    //     }],
    //     top: e.clientY,
    //     left: e.clientX

    //   });
    // },
</script>
