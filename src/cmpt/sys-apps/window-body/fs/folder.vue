<template lang="jade">
.lr-fs-folder(@contextmenu.prevent='handleFsBodyContextmenu',
            @mousedown='handleFsBodyMousedown', :class='bodyClass')
  CtrlBar
  .lr-fs-folder-inner
    .lr-file(v-for='item in list',
            :key='item.name',
            @mousedown='noopStop',
            @dblclick='openItem(item)', @click.stop='focusItem(item)',
            @contextmenu.prevent.stop='handleFsItemContextmenu(item, $event)',
            :class='{lr_file_hidden: item.name[0] === ".", lr_file_focus: item.focus, ["lr_file_type_" + item.type ]: item.type}')
      FsIcon(:item='item')
      .lr-file-name(@click='handleItemNameClick(item, $event)') {{item.name}}
  Status
</template>

<script>
import contextmenuStore from '__ROOT__/store/contextmenu';
import flyTextAreaStore from '__ROOT__/store/fly-textarea';

import FsIcon from './fs-icon.vue';
import Status from './status.vue';
import CtrlBar from './ctrl-bar.vue';

import initRelation from './permission-util';
import {getNameSuffix} from './fs-util';
export default {
  components:{
    CtrlBar,
    FsIcon,
    Status
  },
  data(){
    return {
      list: [],
      currItem: {},
      dir: null,
      newItemName: null
    }
  },
  computed: {
    username(){
      return this.$store.state.username
    },
    groups(){
      return this.$store.state.groups
    },
    bodyClass(){
      if(this.dir && !this.dir.readable){
        return 'lr-fs-dir-unreadable'
      }
      if(this.dir && !this.dir.writeable){
        return 'lr-fs-dir-unwriteable'
      }
      if(this.dir && this.dir.isSticky){
        return 'lr-fs-dir-sticky'
      }
    }
  },
  methods: {
    getData(){
      this.request({
        url: '~/fs' + this.address,
        stateKey: 'isRequest',
        //poolKey: this.address,
        data: {dir: true},
        success(data){
          const folderArr = [], fileArr = [], hiddenArr = [];
          data.forEach( v => {
            if(v.name === '..') return;

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
          });
          this.list = folderArr.concat(fileArr).concat(hiddenArr);
        },
        error(xhr){
          this.list = `http ${xhr.status} 错误: <br>${xhr.responseText}`
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
      const address = this.getAddress(item);
      if(item.type === 'Directory'){
        //this.backStack.push(this.addressArr);
        this.$refs.navBar.go(address);

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
    handleFsBodyContextmenu(e){
      const self = this;
      contextmenuStore.commit('open', {
        data: [{
          name: 'New File',
          handleClick(){
            const name = 'new-' + Date.now();
            self.request({
              type: 'POST',
              url: '~/fs' + self.address,
              data: {
                name,
                type: 'createFile'
              },
              success(){
                self.newItemName = name;
                self.getData();
              }
            })
          }
        },
        {
          name: 'New Folder',
          handleClick(){
            const name = 'new-' + Date.now()
            self.request({
              type: 'POST',
              url: '~/fs' + self.address,
              data: {
                name,
                type: 'createFolder'
              },
              success(){
                self.newItemName = name;
                self.getData();
              }
            })
          }
        },
        {
          name: 'Refresh',
          handleClick(){
            self.getData();
          }
        }],
        top: e.clientY,
        left: e.clientX

      });
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
  mounted(){
  }
}
</script>
