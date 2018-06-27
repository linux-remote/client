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
      const item = this.item;
      const pData = this.$parent;
      if(!pData.focus){
        return;
      }
      if(this.$data._isClicked){
        return;
      }
      this.$data._isClicked = true;
      
      const _dblClick_count = this.$data._dblClick_count;
      const self = this;
      setTimeout(() => {
              
        if(self.$data._dblClick_count !== _dblClick_count | !pData.focus){
          this.$data._isClicked = false;
          return;
        }
        if(!pData.focus){
          return;
        }

        const data = {
          target: e.target,
          handleBlur : function(newName){
            self.isStart = false;
            self.$data._isClicked = false;
            if(!newName || item.name === newName){
              return;
            }
            self.rename(newName);
          }
        }
        this.isStart = true;
        self.$store.commit('flyTextarea/open', data);
      }, 500);
    },
    rename(newName){
      const item = this.item;
      this.request({
        url: '~/fs/' + encodePath(this.p.address),
        type: 'post',
        data: {type: 'rename', oldName: item.name, newName},
        success(){
          item.name = newName;
          if(!item.isFolder){
            initIconAttr(item);
          }
          this.p.reSortByItem(item);
          //console.log('rename success');
        }
      })
    }
  }
}
</script>
