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
    .lr-fs-body(v-else-if='data.length === 0')
      h2(style='color:#eee;margin:0') Empty
    .lr-fs-body(v-else @contextmenu.prevent='handleFsBodyContextmenu', @mousedown='handleFsBodyMousedown')

      .lr-file(v-for='item in data',
        :key='item.name',
        @mousedown='noopStop',
        @dblclick='openItem(item)', @click.stop='focusItem(item)',
        @contextmenu.prevent.stop='handleFsItemContextmenu(item, $event)',
        :class='{lr_2_hidden: item.name[0] === ".", lr_2_focus: item.focus, ["lr_file_type_" + item.type ]: item.type}')
        .lr-file-icon
          span(v-if='item.suffix') {{item.suffix}}
          .lr-3-icon.lr-3-link(v-if='item.isSymbolicLink')

        .lr-2-name(@click='handleItemNameClick(item, $event)') {{item.name}}
    .lr-fs-status(v-if='currFocusItem.focus')
      span size:
        b {{this.viewSize(currFocusItem.size)}}
        b(v-if='currFocusItem.blocks && currFocusItem.blksize > currFocusItem.size') /{{this.viewSize(currFocusItem.blksize)}}
      span type:
        b {{currFocusItem.isSymbolicLink ? 'symbolicLink' : currFocusItem.type}}
      span(v-if='currFocusItem.isSymbolicLink') linkTo: 
        b.v-2-link {{currFocusItem.linkPath}}
      span(v-if='currFocusItem.isDirectory') nlink:
        b {{currFocusItem.nlink}}

      //- span auth:
      //-   b {{currFocusItem.permissions}}
      //- span relation:
      //-   b {{currFocusItem._relation}}
    .lr-fs-status(v-else)
      span files:
        b {{data.length}}
</template>

<script>
import store from '__ROOT__/store-global';
import contextmenuStore from '__ROOT__/store/contextmenu';
import flyTextAreaStore from '__ROOT__/store/fly-textarea';
//import FsItem from './fs-item';
export default {
  data(){
    return {
      isRequest: false,
      inputAddress: null,
      // address: null,
      addressArr: ['/'],
      data: [],
      backStack: [],
      goStack: [],
      currFocusItem: {}
      // newFileIndex: 0,
      // newFolderIndex: 0
    }
  },
  watch: {
    address(v){
      this.inputAddress = v;
      this.getData();
    }
  },
  computed: {
    error(){
      return !Array.isArray(this.data);
    },
    userInfo(){
      return store.state.userInfo
    },
    address(){
      return '/' + this.addressArr.join('/');
    }
  },
  methods: {
    viewSize(size){
      let m = 'B';
      if(size > 1024){
        size = (size / 1024);
        m = 'K';
      }

      if(size > 1024){
        size = (size / 1024);
        m = 'M';
      }
      if(size > 1024){
        size = (size / 1024);
        m = 'G';
      }
      return size.toFixed(2) + m;
    },
    // testmouse(){
    //   console.log('mouse down');
    // },
    handleItemNameClick(item, e){
      if(item !== this.currFocusItem) return;
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
            item.suffix = this.getNameSuffix(item.name);
          }
          console.log('rename success');
        }
      })
      //console.log('renameItem', item.name, newName);
    },
    getNameSuffix(name){
      const index = name.lastIndexOf('.');
      if(index !== 0 && index !== -1){
        return name.substr(index + 1);
      }
    },
    focusItem(item){
      this.itemFocus(item);
    },
    itemFocus(item){
      this.currFocusItem.focus = false;
      item.focus = true;
      this.currFocusItem = item;
      if(this.onListener === true) return;
      this.onListener = true;
      window.APP.$elMain.addEventListener('mousedown', () => {
        this.currFocusItem.focus = false;
        this.onListener = false;
      }, {
        once: true,
        //capture: true
      })
    },

    handleFsBodyMousedown(){
      this.currFocusItem.focus = false;
    },

    handleFsItemContextmenu(item, e){
      const self = this;
      this.itemFocus(item);
      const data = [];
      if(item.isFile || item.isDirectory){
        data.push({
          name: 'Open',
          handleClick(){
            self.openItem(item)
            console.log('handleClick open');
          }
        })
      }
      data.push({
        name: 'Delete',
        handleClick(){
          self.request({
            type: 'delete',
            url: '~/fs' + self.address + '/' + item.name + '?type=file',
            success(){
              //self.newFileIndex += 1;
              self.getData();
            }
          })
        }
      });
      contextmenuStore.commit('open', {
        data,
        top: e.clientY,
        left: e.clientX
      });
      return false;
    },
    handleFsBodyContextmenu(e){
      const self = this;
      contextmenuStore.commit('open', {
        data: [{
          name: 'New File',
          handleClick(){
            self.request({
              type: 'POST',
              url: '~/fs' + self.address,
              data: {
                name: 'new-file-' + Date.now(),
                type: 'file'
              },
              success(){
                //self.newFileIndex += 1;
                self.getData();
              }
            })
          }
        },
        {
          name: 'New Folder',
          handleClick(){
            self.request({
              type: 'POST',
              url: '~/fs' + self.address,
              data: {
                name: 'new-file' + Date.now(),
                type: 'folder'
              },
              success(){
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
      if(item.isDirectory){
        this.backStack.push(this.addressArr);
        // let address;
        // if(item.isSymbolicLink){
        //   address = item.linkPath;
        // }else{
        //   address = this.address + '/' + item.name
        // }
        //this.$parent.name = item.name;
        this.setAddress(address);

      }else if(item.isFile){

        store.commit('addTask', {
          type: 'edit',
          name: item.name + '**' + this.address + '**',
          width: 500,
          height:500,
          address
        });
      }
    },
    initRelation(item){
      const u = this.userInfo;
      if(item.uid === u.uid){
        item._relation = 'owner';
      }else if(item.gid === u.gid){
        item._relation = 'group';
      }else{
        item._relation = 'other';
      }
    },
    getModeInfo(mode){
      const data = {
        owner: {
          x: mode & parseInt('100', 8) ? 'x' : '-',
          w: mode & parseInt('200', 8) ? 'w' : '-',
          r: mode & parseInt('400', 8) ? 'r' : '-',
        },
        group: {
          x: mode & parseInt('10', 8) ? 'x' : '-',
          w: mode & parseInt('20', 8) ? 'w' : '-',
          r: mode & parseInt('40', 8) ? 'r' : '-',
        },
        other: {
          x: mode & 1 ? 'x' : '-',
          w: mode & 2 ? 'w' : '-',
          r: mode & 4 ? 'r' : '-',
        }
      };

      function out(obj){
        return `${obj.r}${obj.w}${obj.x}`
      }

      const ext = {
        s : mode & parseInt('4000', 8) ? 's' : null,
        gs : mode & parseInt('2000', 8) ? 's' : null,
        t : mode & parseInt('1000', 8) ? 't' : null
      }
      //let t = 't';
      if(ext.t){
        if(data.other.x === '-'){
          data.other.x = 'T'
        }else{
          data.other.x = 't';
        }
      }
      if(ext.gs){
        if(data.group.x === '-'){
          data.group.x = 'S'
        }else{
          data.group.x = 's';
        }
      }

      if(ext.s){
        if(data.owner.x === '-'){
          data.owner.x = 'S'
        }else{
          data.owner.x = 's';
        }
      }

      return out(data.owner) + out(data.group) + out(data.other);
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
            if(v.name === this.currFocusItem.name){
              this.itemFocus(v);
            }else{
              v.focus = false;
            }

            // v.goodSize = this.viewSize(v.size);
            // v.lessBlkSize = (v.blocks > 0) &&  (v.blksize > v.size);
            // if(v.lessBlkSize){
            //   v.goodBlkSize = this.viewSize(v.blksize);
            // }
            //console.log(v.mode);
            //
            // if(item._relation === 'own'){
            //
            // }

            this.initRelation(v);
            v.permissions = this.getModeInfo(v.mode);

            if(v.name[0] === '.'){
              v.isHidden = true;
              hiddenArr.push(v);
            }else{
              v.isHidden = false;
              if(v.isDirectory){
                folderArr.push(v)
              }else{
                fileArr.push(v);
                v.suffix = this.getNameSuffix(v.name);
              }
            }
            //return v;
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
    const address = pData.address || store.state.homedir;
    this.setAddress(address);
  }
}
</script>
