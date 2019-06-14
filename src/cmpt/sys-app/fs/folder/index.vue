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
          //- th(v-for="key in theads", :key="key", :class="{active: key === sortKey, ['lr_fs_th_' + key]: true}", @mousedown="sortBy(key)") {{LANG.th[key]}}
          th(v-for="key in theads", :key="key") {{LANG.th[key]}}

      tbody.lr-fs-tbody
        tr(v-if='preCreateItem', class='lr-fs-create-layer', @mousedown.stop='')
          td(colspan='7')
            PreCreate(:p='self', @success="handleCreateSuccess")

        component(v-for='(item, i) in list',
                :is='item.isUploading ? "UploadItem" : "RowItem"',
                :p='self',
                :key='item.name',
                :index='i',
                :item='item',
                @del="handleItemDel",
                @click='handleItemClick(item, $event)',
                @contextmenu="handleItemContentmenu(item)"
                :selectedLen="$options._selectedItems.size"
                :class='{lr_file_hidden: item.isHidden, lr_file_focus: item.focus,  lr_file_be_selected: item.isBeSelected, lr_file_cut: item.isCut}')
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
import UploadItem from './upload-item.vue';
import Status from './status.vue';
import Selectable from '__ROOT__/cmpt/unit/selectable.vue';
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
import initRelation from './permission-util';

import {encodePath} from '__ROOT__/cmpt/sys-app/util';
import lsParse from '../../lib/ls-parse';
import safeBind from '../../../../lib/mixins/safe-bind';
import Sync from '../../../../lib/sync';
import mixins from './mixins/index';
mixins.push(safeBind);

export default {
  inject: ['taskWindow'],
  mixins: mixins,
  components:{
    CtrlBar,
    PreCreate,
    Status,
    RowItem,
    UploadItem,
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
      model: 'list',
      theads: ['name',  'owner', 'group' ,'permission', 'mtime',  'size'],
      dir: null,
      list: [],
      isHaveDevice: false,
      error: null,

      preCreateItem: null,

      
      
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
    }
  },
  watch: {
    triggerContainSame(newVal, oldVal){
      if(newVal.address !== oldVal.address){
        this.currItem = {};
      }
      this.getData();
    }
  },

  methods: {

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

    getData(){
      this.request({
        url: '~/fs/' + encodePath(this.address),
        stateKey: 'isRequest',
        data: { dir: true },
        success(stdout){
          
          let data = lsParse(stdout);
          data = this.getDirAndWrapBaseList(data);
          this.publicEmit({
            type: 'getList',
            address: this.address,
            data
          })
          this.$nextTick(() => {
             this.reActiveNewItems();
          });
        },
        error(xhr){
          this.error = `${xhr.responseText}`;
          if(this.$options._shouldActiveNewItemNames){
            this.$options._shouldActiveNewItemNames = null;
          }
        }
      })
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

    handleFsBodyMousedown(){
      this.clearSelected();
      this.unFocusCurrItem();
    },

  },
  created(){
    this.$options._sync = new Sync({
      key: 'name',
      onAdd: (v) => {
        this.initItemStatus(v);
      },
      // onGetList: (list) => {
      //   this.list = list;
      // }
    });
    this.$options._selectedItems = new Set;
    this.getData();
  },
  mounted(){
    
    this.safeBind(this.taskWindow.$el, 'keydown', (e) => {
      this.handleKeydown(e);
    });
    // console.log('folder', this.$options._safeBindedList);
  }
}
//- th {{LANG.th.owner}}
//- th {{LANG.th.group}}
//- th {{LANG.th.permission}}
//- th {{LANG.th.mtime}}
//- th {{LANG.th.size}}
//-   span.lr_is_device_type(v-if='isHaveDevice') /{{LANG.th.deviceType}}
</script>
