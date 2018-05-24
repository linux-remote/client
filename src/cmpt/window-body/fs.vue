<template lang="jade">
.lr-window-body
    .lr-hourglass(v-show='isRequest')
    .lr-fs-bar
      .lr-3-item.lr-3-left(@click='handleArrowLeftClick', :class='{lr_2_disabled:backStack.length === 0}')
      .lr-3-item.lr-3-up(@click='handleArrowUpClick', :class='{lr_2_disabled:address === "/"}')
      .lr-3-item.lr-3-right(@click='handleArrowRightClick', :class='{lr_2_disabled:goStack.length === 0}')
      input.lr-2-address(v-model='inputAddress' @keydown.13='handleGoClick')
      .lr-3-item.lr-3-reload(v-if='address===inputAddress' @click='getData')
      .lr-3-item.lr-3-go(v-else @click='handleGoClick')
    .lr-fs-body(v-if='error')
      h2(v-html='data' style='color:red')
    .lr-fs-body(v-else @contextmenu.prevent='handleFsBodyContextmenu', @mousedown='handleFsBodyMousedown', :class='bodyClass')
      h2(style='color:#eee;margin:0', v-if='data.length === 0 && !isRequest') Empty
      .lr-fs-cud-bar

        button.lr-upload-btn(@click='handleUploadBtnClick') 上传文件
        input.lr-upload-input( type='file' ref='uploadInput' @change='uploadFolder' multiple)
        Upload(:getFd='getUploadFd', :isFolder='true') 上传文件夹
      .lr-file(v-for='item in data',
        :key='item.name',
        @mousedown='noopStop',
        @dblclick='openItem(item)', @click.stop='focusItem(item)',
        @contextmenu.prevent.stop='handleFsItemContextmenu(item, $event)',
        :class='{lr_2_hidden: item.name[0] === ".", lr_2_focus: item.focus, ["lr_file_type_" + item.type ]: item.type}')
        <fs-icon :item='item' />
        .lr-2-name(@click='handleItemNameClick(item, $event)') {{item.name}}




    .lr-fs-status(v-if='currItem.focus')
      span {{currItem.isSymbolicLink ? 'SymbolicLink' : currItem.type}}
      span {{wellCurrSize}}
      span {{currItem.permission}}
      span {{currItem.owner}}
      span {{currItem.group}}
        //- b(v-if='currItem.blocks && currItem.blksize > currItem.size') /{{wellSize(currItem.blksize)}}
      span(v-if='currItem.isSymbolicLink') linkTo:
        b.v-2-link {{currItem.linkPath}}
      //- span owner
      //-   b {{currItem.owner}}
      //- //- span(v-else) nlink:
      //- //-   b {{currItem.nlink}}
      //-
      //- span per:
      //-   b {{currItem.permission}}
      //- span relation:
      //-   b {{currItem._relation}}
    .lr-fs-status(v-else-if='dir')
      span Items: {{data.length}}
      //span DIR
      span {{dir.permission}}
      span {{dir.owner}}
      span {{dir.group}}
      span(v-if='!dir.readable') readable: {{dir.readable}}
      span(v-if='!dir.writeable') writeable: {{dir.writeable}}
      span(v-if='dir.isSticky') sticky:{{dir.isSticky}}
</template>

<script>

import contextmenuStore from '__ROOT__/store/contextmenu';
import flyTextAreaStore from '__ROOT__/store/fly-textarea';
import FsIcon from './fs-icon';
import Upload from './upload-multiple';
import {perFormet, getNameSuffix} from './fs-util';
//import FsItem from './fs-item';
export default {
  components:{
    FsIcon,
    Upload
  },
  data(){
    return {
      isRequest: false,
      inputAddress: null,
      // address: null,
      addressArr: ['/'],
      data: [],
      backStack: [],
      goStack: [],
      currItem: {},

      //dirIsSticky : false,
      dir: null,

      newItemName: null,
      newFileIndex: 0,
      newSymbolicLinkIndex: 0,
      newFolderIndex: 0
    }
  },
  myStoreage: {},
  watch: {
    address(v){
      this.inputAddress = v;
      this.getData();
    }
  },
  computed: {
    wellCurrSize(){
      return this.currItem.size
      //wellSize(this.currItem.size)
    },
    error(){
      return !Array.isArray(this.data);
    },
    username(){
      return this.$store.state.username
    },
    groups(){
      return this.$store.state.groups
    },
    address(){
      return '/' + this.addressArr.join('/');
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
    getUploadFd(fd){
      console.log('fd', fd)
      this.$options.myStoreage.uploadFd = fd;
    },
    getItemPath(name){
      const a = this.address === '/' ? this.address : this.address + '/';
      return a + name;
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
      //console.log('renameItem', item.name, newName);
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
                //self.newFileIndex += 1;
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
                //self.newFileIndex += 1;
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
    handleUploadBtnClick(){
      const dom = this.$refs.uploadInput;
      dom.addEventListener('change', this.uploadFolder, {
        once: true
      });
      dom.click();
    },
    uploadFolder(e){
      const files = e.target.files;
      if(!files.length){
        return; //changel
      }
      var fd = new FormData();
      for (var i = 0; i < files.length; i++) {
        fd.append("file", files[i]);
      }
      this.request({
        type: 'POST',
        contentType: false,
        processData: false,
        url: '~/fs' + this.address + '?type=uploadMultiple',
        data: fd,
        success(){
          console.log('uploadFolder success');
          this.getData();
        }
      })
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
                //self.currItem.focus = true;
                //self.newFileIndex += 1;
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
                //self.newFolderIndex += 1;
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
    setAddress(path){
      const arr = path.split('/');
      const arr2 = [];
      arr.forEach(v => {
        if(v){
          arr2.push(v);
        }
      });
      this.addressArr = arr2;
    },
    download(item){
      const self = this;
      this.request({
        url: '~/fs' + self.getItemPath(item.name) + '?download=true',
        download: true
      })
    },
    handleArrowLeftClick(){
      if(!this.backStack.length) return;
      this.goStack.push(this.addressArr);
      const pop = this.backStack.pop();
      this.addressArr = pop;
    },
    handleArrowRightClick(){
      if(!this.goStack.length) return;
      const pop = this.goStack.pop();
      this.addressArr = pop;
    },
    handleGoClick(){
      //console.log('handleGoClick')
      this.setAddress(this.inputAddress);
    },
    handleArrowUpClick(){
      if(!this.address === '/') return;
      this.goStack = [];
      this.backStack.push(this.addressArr);
      const i = this.address.lastIndexOf('/');
      this.setAddress(this.address.substr(0, i));
    },
    getAddress(item){
      let address;
      if(item.isSymbolicLink){
        address = item.linkPath;
      }else{
        address = this.address + '/' + item.name
      }
      return address;
    },
    openItem(item){
      const address = this.getAddress(item);
      if(item.type === 'Directory'){
        this.backStack.push(this.addressArr);
        // let address;
        // if(item.isSymbolicLink){
        //   address = item.linkPath;
        // }else{
        //   address = this.address + '/' + item.name
        // }
        //this.$parent.name = item.name;
        this.setAddress(address);

      }else if(item.type === 'RegularFile'){

        this.$store.commit('addTask', {
          type: 'edit',
          name: item.name + '**' + this.address + '**',
          width: 500,
          height:500,
          address
        });
      }
    },
    initRelation(item){
      const isInGroup = (this.groups.indexOf(item.group) !== -1);
      const rwxs = item.rwxs;
      let readable = false, writeable = false;
      if(item.owner === this.username){
        item.is_owner = true;
        //item._relation = 'owner';
        readable = rwxs.owner.r;
        writeable = rwxs.owner.w;
      }
      // else if(isInGroup){
      //   item._relation = 'group';
      // }else{
      //   item._relation = 'other';
      // }

      if(isInGroup){
        item.is_group = true;
        if(!readable){
          readable = rwxs.group.r;
        }
        if(!writeable){
          writeable = rwxs.group.w;
        }
      }
      if(!readable){
        readable = rwxs.other.r;
      }
      if(!writeable){
        writeable = rwxs.other.w;
      }
      // readable = false;
      // console.log('readable', readable)
      // console.log('writeable', writeable)
      item.readable = readable;
      item.writeable = writeable;
      item.is_other = true;
    },
    dataFormat(item){
      const per = item.permission;
      const obj = perFormet(per);
      Object.assign(item, obj);
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
    getData(){
      this.request({
        url: '~/fs' + this.address,
        requestKey: 'isRequest',
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

            this.dataFormat(v);

            this.initRelation(v);

            // if(v.name === '.'){
            //   if(v.is_owner || v.is_group || !v.isSticky){
            //
            //   }
            // }

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
          this.data = folderArr.concat(fileArr).concat(hiddenArr);
          //this.data = data;
        },
        error(xhr){
          this.data = `http ${xhr.status} 错误: <br>${xhr.responseText}`
        }
      })
    }
  },
  created(){
    const pData = this.$parent;
    const address = pData.address || this.$store.state.homedir;
    this.setAddress(address);
  }
}
</script>
