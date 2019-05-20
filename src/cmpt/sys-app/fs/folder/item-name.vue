<template lang="jade">
.lr-fs-item-name(@click='handleClick', :style='{visibility: isStart ? "hidden" : null}', @dblclick='handleDblclick') {{item.name}}
</template>

<script>
// const DELAY = 500;
import {initIconAttr, encodePath} from './util';
export default {
  props: ['item', 'p'],
  data(){
    return {
      _isClicked: false,
      _dblClick_count: 0,
      isStart: false
    }
  },
  methods: {
    handleDblclick(){
      this.$data._dblClick_count ++;
    },
    handleClick(e){
 
      if(e.ctrlKey || e.shiftKey){
        return;
      }
      const item = this.item;
      if(!item.focus){
        return;
      }
      if(this.$data._isClicked){
        return;
      }
      this.$data._isClicked = true;
      
      const _dblClick_count = this.$data._dblClick_count;
      const self = this;
      setTimeout(() => {
              
        if(self.$data._dblClick_count !== _dblClick_count | !item.focus){
          this.$data._isClicked = false;
          return;
        }
        if(!item.focus){
          return;
        }

        this.startRename();
      }, 500);
    },
    startRename() {
      const self = this;
      const item = self.item;
      const data = {
        target: this.$el,
        handleBlur : function(newName){
          self.isStart = false;
          self.$data._isClicked = false;
          if(!newName || item.name === newName){
            return;
          }
          self.rename(newName);
        }
      }
      self.isStart = true;
      self.$store.commit('flyTextarea/open', data);
    },
    rename(newName){
      const item = this.item;
      let oldName = item.name;
      this.request({
        url: '~/fs/' + encodePath(this.p.address),
        type: 'post',
        data: {type: 'rename', oldName, newName},
        success(){
          
          this.$store.commit('fsPublicEmit', {
            type: 'rename',
            address: this.p.address,
            oldName,
            newName
          });
        }
      })
    }
  }
}
</script>
