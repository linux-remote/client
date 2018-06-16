<template lang="jade">
.lr-fs-folder(@mousedown='handleFsBodyMousedown', :class='bodyClass')
  CtrlBar
  .lr-fs-folder-inner(v-if='error')
    pre.lr-fs-error(v-html='list')
  .lr-fs-folder-inner(v-else-if='list.length')
    ContextMenu(v-if="contextmenuIsShow", :close="contextmenuClose")
      .lr-ctx-item
    table.lr-table.lr-fs-folder-table(@contextmenu='handleContextmenu')
      tr
        th 名称
        th 所有者
        th 用户组
        th 权限
        th 修改日期
        th 大小
          span.lr_is_device_type(v-if='isHaveDevice') /设备类型
      tr(v-for='item in list',
        :key='item.name',
        @dblclick='openItem(item)',
        :class='{lr_file_hidden: item.name[0] === "."}')
        td
          .lr-name-wrap
            .lr-icon(:class='"lr_file_type_" + item.type')
              .lr-icon.lr-error-icon(v-if='item.linkTargetError')
            | {{item.name}}
        td 
          span(:class='{lr_per_is_on: item.is_owner}'){{item.owner}}
        td
          span(:class='{lr_per_is_on: item.is_group}') {{item.group}}
        td
          .lr-per-wrap
            .lr-per-relation-wrap
              .lr-per-relation(v-for='(v, k) in item.rwxs',
                              :class='{lr_per_is: item["is_" + k]}')
                .lr-per-item(v-for='(v2, k2) in v', :class='{lr_per_item_on: v2 }') {{k2}}
              .lr-per-sticky(v-if='item.isSticky')
            .lr-per-ACL(v-if='item.isMask') ACL
        td {{item.mtime}}
        td(v-if='item.size') {{item.size | wellSize}}
        td(v-else) 
          span.lr_is_device_type {{item.device_type}}
  // Modal(title='创建新文件', :onSubmit='handleModalSubmit')
  //   input(v-model='inputVal', required)
  Status
</template>

<script>

import contextmenuStore from '__ROOT__/store/contextmenu';
import flyTextAreaStore from '__ROOT__/store/fly-textarea';
import ContextmenuExtend from '__ROOT__/cmpt/global/contextmenu/extend.vue';

import Status from './status.vue';
import CtrlBar from './ctrl-bar.vue';
import Modal from '__ROOT__/cmpt/global/modal.vue';
import initRelation from './permission-util';
import {getNameSuffix} from '../fs-util';
export default {
  extends: ContextmenuExtend,
  components:{
    CtrlBar,
    Status,
    Modal
  },
  props: {
    address: {
      type: String,
      required: true
    },
    triggerContainSame: {
    }
  },

  data(){
    return {
      theads: ['名称',  '所有者', '用户组' ,'权限', '修改日期',  '大小/设备类型'],
      list: [],
      currItem: {},
      dir: null,
      newItemName: null
    }
  },
  computed: {
    error(){
      return !Array.isArray(this.list);
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
    handleModalSubmit(){

    },

    getItemAddress(item){
      let address;
      if(item.isSymbolicLink){
        address = item.linkPath;
      }else{
        address = this.address + '/' + item.name
      }
      return address;
    },
    getData(){
      this.request({
        url: '~/fs' + this.address,
        stateKey: 'isRequest',
        //poolKey: this.address,
        data: {dir: true},
        success(data){
          const folderArr = [], fileArr = [], hiddenArr = [];
          var isHaveDevice = false;
          data.forEach( v => {
            if(v.name === '..') return;
            
            v.size = Number(v.size);

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
            initRelation(v, this.username, this.groups);
            
            if(v.name === '.'){
              this.dir = v;
              return;
            }

            this.focusNewItem(v);
            if(v.name[0] === '.'){
              v.isHidden = true;
              hiddenArr.push(v);
            }else{
              v.isHidden = false;
              if(v.type === 'Directory'){
                folderArr.push(v)
              }else{
                fileArr.push(v);
                v.suffix = getNameSuffix(v.name);
              }
            }
            if(v.device_type && !isHaveDevice){
              isHaveDevice = true;
            }
          });
          this.isHaveDevice = isHaveDevice;
          this.list = folderArr.concat(fileArr).concat(hiddenArr);
        },
        error(xhr){
          this.list = `${xhr.responseText}`
        }
      })
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
    openItem(item){
      const address = this.getItemAddress(item);
      if(item.type === 'Directory'){
        this.go(address);
      }else if(item.type === 'RegularFile'){
        this.$store.commit('task/add', {
          type: 'edit',
          name: item.name + '**' + this.address + '**',
          width: 500,
          height:500,
          address
        });
      }
    },
    getItemPath(name){
      const a = this.address === '/' ? this.address : this.address + '/';
      return a + name;
    },
    download(item){
      const self = this;
      this.request({
        url: '~/fs' + self.getItemPath(item.name) + '?download=true',
        download: true
      })
    },
    renameItem(item, newName){
      // console.log('oldName', item.name, newName);
      // return;
      this.request({
        url: '~/fs' + this.address,
        type: 'post',
        data: {type: 'rename', oldName: item.name, newName},
        success(){
          item.name = newName;
          if(item.isFile){
            item.suffix = getNameSuffix(item.name);
          }
          console.log('rename success');
        }
      })
    },
    focusItem(item){
      this.itemFocus(item);
    },
    itemFocus(item){
      this.currItem.focus = false;
      item.focus = true;
      this.currItem = item;
      if(this.onListener === true) return;
      this.onListener = true;
      window.APP.$elMain.addEventListener('mousedown', () => {
        this.currItem.focus = false;
        this.onListener = false;
      }, {
        once: true,
        //capture: true
      })
    },
    handleFsBodyMousedown(){
      this.currItem.focus = false;
    },
    handleItemNameClick(item, e){
      if(item !== this.currItem) return;
      const self = this;
      const data = {
        target: e.target,
        //value: item.name,
        handleBlur : function(newName){
          if(item.name === newName) return;
          self.renameItem(item, newName);
        }
      }
      flyTextAreaStore.commit('open', data);
    },

    handleFsItemContextmenu(item, e){
      const self = this;
      this.itemFocus(item);
      const data = [
        {name: 'Create Symbolic Link',
          handleClick(){
            const name = item.name + '.lnk';
            self.request({
              type: 'post',
              url: '~/fs' + self.getItemPath(item.name),
              data: {
                type: 'createSymbolicLink',
                name: item.name + '.lnk'
              },
              success(){
                self.newItemName = name;
                self.getData();
              }
            })
          }
        },
        {
          name: 'Delete',
          handleClick(){
            self.request({
              type: 'delete',
              url: '~/fs' + self.getItemPath(item.name) + '?type=file',
              success(){
                this.$store.commit('onFsDel');
                self.getData();
              }
            })
          }
        }
      ];

      if(item.type === 'RegularFile' || item.type === 'Directory'){

        if(item.type === 'RegularFile' && item.readable){
          data.unshift({
            name: 'download',
            handleClick(){
              self.download(item);
            }
          })
        }

        data.unshift({
          name: 'Open',
          handleClick(){
            self.openItem(item)
            console.log('handleClick open');
          }
        })

      }

      contextmenuStore.commit('open', {
        data,
        top: e.clientY,
        left: e.clientX
      });
    },
  },
  created(){
    this.getData();
  }
}
</script>
