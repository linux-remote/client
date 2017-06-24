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
    .lr-fs-body(v-else @contextmenu.prevent='handleFsBodyContextmenu')

      .lr-file(v-for='item in data',
        :key='item.name',
        @dblclick='openItem(item)', @click.stop='focusItem(item)',
        @contextmenu.prevent.stop='handleFsItemContextmenu(item, $event)',
        :class='{lr_2_file_link: item.isSymbolicLink, lr_2_hidden: item.name[0] === ".", lr_2_focus: item.focus}')
        .lr-2-icon.lr-2-folder(v-if='item.isDirectory')
        .lr-2-icon.lr-2-file(v-else-if='item.isFile')
        .lr-2-icon.lr-2-unknown(v-else)
        .lr-2-name(@click='handleItemNameClick(item, $event)') {{item.name}}
    .lr-fs-status(v-if='currFocusItem.focus')
      span size:
        b {{this.viewSize(currFocusItem.size)}}
        b(v-if='currFocusItem.blocks && currFocusItem.blksize > currFocusItem.size') /{{this.viewSize(currFocusItem.blksize)}}
      span(v-if='currFocusItem.isSymbolicLink') link:
        b.v-2-link {{currFocusItem.linkString}}
      span(v-if='currFocusItem.isDirectory') files:
        b {{currFocusItem.nlink}}
      span(v-else-if='!currFocusItem.isFile') type:
        b {{currFocusItem._type}}
</template>

<script>
import store from '__ROOT__/store-global';
import contextmenuStore from '__ROOT__/store/contextmenu';
import flyTextAreaStore from '__ROOT__/store/fly-textarea';
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
    address(){
      return '/' + this.addressArr.join('/');
    }
  },
  methods: {
    viewSize(size){
      let m = 'B';
      if(size > 1024){
        size = (size / 1024);
        m = 'KB';
      }

      if(size > 1024){
        size = (size / 1024);
        m = 'MB';
      }
      if(size > 1024){
        size = (size / 1024);
        m = 'GB';
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
          console.log('rename success');
        }
      })
      //console.log('renameItem', item.name, newName);
    },
    focusItem(item){
      this.itemFocus(item);
    },
    itemFocus(item){
      this.currFocusItem.focus = false;
      item.focus = true;
      this.currFocusItem = item;
    },

    handleFsBodyMousedown(){
      this.currFocusItem.focus = false;
    },

    handleFsItemContextmenu(item, e){
      const self = this;
      this.itemFocus(item);
      const data = [];
      if(item.isFile){
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
      console.log('item', item);
      let address;
      if(item.isSymbolicLink){

        address = '/' + item.linkString;
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
        //   address = item.linkString;
        // }else{
        //   address = this.address + '/' + item.name
        // }

        this.setAddress(address);

      }else if(item.isFile){

        store.commit('addTask', {
          type: 'edit',
          name: item.name + '**' + this.address + '**',
          width: 500,
          height:500,
          address
        })
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
            if(v.name === this.currFocusItem.name){
              this.itemFocus(v);
            }else{
              v.focus = false;
            }

            if(v.name[0] === '.'){
              v.isHidden = true;
              hiddenArr.push(v);
            }else{
              v.isHidden = false;
              if(v.isDirectory){
                folderArr.push(v)
              }else{
                fileArr.push(v);
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
