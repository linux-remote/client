<template lang="jade">
.lr-window-body(@click='handleBodyClick')
    .lr-hourglass.glyphicon.glyphicon-hourglass(v-show='isRequest')
    .lr-fs-bar
      .lr-3-item.glyphicon.glyphicon-arrow-left(@click='handleArrowLeftClick', :class='{lr_2_disabled:backStack.length === 0}')
      .lr-3-item.glyphicon.glyphicon-arrow-up(@click='handleArrowUpClick', :class='{lr_2_disabled:address === "/"}')
      .lr-3-item.glyphicon.glyphicon-arrow-right(@click='handleArrowRightClick', :class='{lr_2_disabled:goStack.length === 0}')
      input.lr-2-address(v-model='inputAddress' @keydown.13='handleGoClick')
      .lr-3-item.glyphicon.glyphicon-repeat(v-if='address===inputAddress' @click='getData')
      .lr-3-item.glyphicon.glyphicon-play(v-else @click='handleGoClick')
    .lr-fs-body(v-if='error')
      h2(v-html='data' style='color:red')
    .lr-fs-body(v-else @contextmenu.prevent='handleFsBodyContextmenu' @click='handleFsBodyClick')
      .lr-file(v-for='item in data', :key='item.name' @dblclick='handleItemClick(item)', @click.prevent.stop='handleItemMousedown(item)', :class='{lr_2_file_link: item.isSymbolicLink, lr_2_hidden: item.name[0] === ".", lr_2_focus: item.focus}', @contextmenu.prevent.stop='handleFsItemContextmenu(item, $event)')
        .lr-2-icon.glyphicon.glyphicon-file(v-if='!item.isDirectory')
        .lr-2-icon.glyphicon.glyphicon-folder-close(v-else='item.isDirectory')
        .lr-2-name(@click='handleItemNameClick(item, $event)') {{item.name}}
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
    handleItemMousedown(item){
      //console.log('handleItemMousedown')
      this.itemFocus(item);
      contextmenuStore.commit('close');
      return false;
    },
    itemFocus(item){
      this.currFocusItem.focus = false;
      item.focus = true;
      this.currFocusItem = item;
    },
    handleBodyClick(){
      //console.log('handleBodyClick')
      contextmenuStore.commit('close');
      return false;
    },
    handleFsBodyClick(){
      this.currFocusItem.focus = false;
      //return false;
    },

    handleFsItemContextmenu(item, e){
      const self = this;
      this.itemFocus(item);
      contextmenuStore.commit('open', {
        data: [
          {
            name: 'Open',
            handleClick(){
              self.handleItemClick(item)
              console.log('handleClick open');
            }
          },
          // {
          //   name: 'Rename',
          //   handleClick(e){
          //     // self.newName(item)
          //     console.log(window.$(self.$el).children().last())
          //     window.$(e.target).children().last().click();
          //     console.log('handleClick Rename');
          //   }
          // },
          {
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
          }
        ],
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
    handleItemClick(item){
      if(item.isDirectory){
        this.backStack.push(this.addressArr);
        this.setAddress(this.address + '/' + item.name);
      }else{

        store.commit('addTask', {
          type: 'edit',
          name: item.name,
          width: 500,
          height:500,
          address: this.address + '/' + item.name
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
