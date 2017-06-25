<template lang="jade">
.lr-file(
  :key='name',
  @mousedown='noopStop',
  @dblclick='open(item)', @click.stop='itemFocus(item)',
  @contextmenu.prevent.stop='handleFsItemContextmenu(item, $event)',
  :class='{lr_2_file_link: item.isSymbolicLink, lr_2_hidden: item.name[0] === ".", lr_2_focus: item.focus}')
  .lr-2-icon.lr-2-folder(v-if='item.isDirectory')
  .lr-2-icon.lr-2-file(v-else-if='item.isFile')
  .lr-2-icon.lr-2-unknown(v-else)
  .lr-2-name(@click='handleItemNameClick(item, $event)') {{item.name}}
</template>

<script>
import store from '__ROOT__/store-global';
import contextmenuStore from '__ROOT__/store/contextmenu';
import flyTextAreaStore from '__ROOT__/store/fly-textarea';
export default {

  props: ['item', 'handleItemClick'],

  data(){
    const item = this.item;
    item.isRequest = false;
    return item;
  },

  computed: {
    goodSize(){
      return this.viewSize(this.size);
    },
    isLessBlk(){
      return (this.blocks > 0) &&  (this.blksize > this.size);
    },
    goodBlkSize(){
      if(this.isLessBlk){
        return this.viewSize(v.blksize);
      }
    }
  },
  methods: {
    open(){
      const address = this.$parent.getAddress(this.$data);
      if(item.isDirectory){
        this.backStack.push(this.addressArr);
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
    itemFocus(item){
      item.focus = true;
      this.currFocusItem.focus = false;
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

    handleFsItemContextmenu(item, e){
      const self = this;
      this.itemFocus(item);
      const data = [];
      if(item.isFile || item.isDirectory){
        data.push({
          name: 'Open',
          handleClick: self.open
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
    }
  }
}
</script>
