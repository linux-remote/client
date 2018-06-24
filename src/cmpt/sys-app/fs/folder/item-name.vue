<template lang="jade">
.lr-fs-item-name(@click='handleClick', @dblclick='handleDblclick') {{item.name}}
</template>

<script>
const DELAY = 500;
import {getNameSuffix, encodePath} from './util';
export default {
  props: ['item', 'p'],
  data(){
    return {
      _isClicked: false,
      _dblClick_count: 0,
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
      console.log('handleClick')
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
            self.$data._isClicked = false;
            if(item.name === newName){
              return;
            }
            
            self.rename(newName);
          }
        }
        self.$store.commit('flyTextarea/open', data);
        self.tmp_prevent = false;
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
            item.suffix = getNameSuffix(item.name);
          }
          this.p.reSortByItem(item);
          //console.log('rename success');
        }
      })
    }
  }
}
</script>
