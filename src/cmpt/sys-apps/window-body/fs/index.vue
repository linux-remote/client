<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  NavBar(ref='navBar', :onChange="handleNavChange")
  .lr-fs-bottom-wrap
    Left
    .lr-fs-right
      CtrlBar
      .lr-fs-folder(v-if='error')
        pre.lr-fs-error(v-html='data' style='color:red')
      Folder(v-else)
  Status



</template>

<script>
import flyTextAreaStore from '__ROOT__/store/fly-textarea';

import NavBar from './nav-bar.vue';
import CtrlBar from './ctrl-bar.vue';
import Left from './left.vue';
import Folder from './folder.vue';
import Status from './status.vue';
import {perFormet, getNameSuffix} from './fs-util';
//import FsItem from './fs-item';
export default {
  components:{
    Left,
    NavBar,
    CtrlBar,
    Folder,
    Status
  },
  data(){
    return {
      isRequest: false,

      address: null,

      data: [],
      currItem: {},

      //dirIsSticky : false,
      dir: null,

      newItemName: null,
      newFileIndex: 0,
      newSymbolicLinkIndex: 0,
      newFolderIndex: 0
    }
  },
  computed: {
    error(){
      return !Array.isArray(this.data);
    },
    username(){
      return this.$store.state.username
    },
    groups(){
      return this.$store.state.groups
    }
  },
  methods: {
    handleNavChange(address){
      this.address = address;
      this.getData();
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

    getAddress(item){
      let address;
      if(item.isSymbolicLink){
        address = item.linkPath;
      }else{
        address = this.address + '/' + item.name
      }
      return address;
    },

    initRelation(item){
      const isInGroup = (this.groups.indexOf(item.group) !== -1);
      const rwxs = item.rwxs;
      let readable = false, writeable = false, accessable = false;
      if(item.owner === this.username){
        item.is_owner = true;

        readable = rwxs.owner.r;
        writeable = rwxs.owner.w;
        accessable = rwxs.owner.x;
      }
      if(isInGroup){
        item.is_group = true;
        if(!readable){
          readable = rwxs.group.r;
        }
        if(!writeable){
          writeable = rwxs.group.w;
        }
        if(!accessable){
          accessable = rwxs.group.x;
        }
      }
      if(!readable){
        readable = rwxs.other.r;
      }
      if(!writeable){
        writeable = rwxs.other.w;
      }
      if(!accessable){
        accessable = rwxs.group.x;
      }
      item.readable = readable;
      item.writeable = writeable;
      item.accessable = accessable;
      item.is_other = true; //icon 用到了.
      if(item.type === 'Directory'){
        if(!accessable){
          if(readable){
            item.permiss_type = 'list';
          }else{
            item.permiss_type = 'none';
          }
        }else {
          if(item.readable){
            if(item.writeable){
              item.permiss_type = 'full';
            }else{
              item.permiss_type = 'only_read';
            }
          }else {
            if(writeable){
              item.permiss_type = 'only_write';
            }else{
              item.permiss_type = 'none';
            }
          }
        }
      }
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

            this.dataFormat(v);

            this.initRelation(v);

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
        },
        error(xhr){
          this.data = `http ${xhr.status} 错误: <br>${xhr.responseText}`
        }
      })
    }
  },
  mounted(){
    const pData = this.$parent;
    const address = pData.address || this.$store.state.homedir;
    this.$refs.navBar.setAddress(address);
  }
}
</script>
