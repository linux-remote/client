<template lang="jade">
.lr-fs-item-name(@click='handleClick', @dblclick='handleDblclick') {{item.name}}
</template>

<script>
const DELAY = 500;
import {getNameSuffix} from './util';
export default {
  props: ['item', 'p'],
  data(){
    return {
      _isClicked: false,
      _isDblClick: false
    }
  },
  methods: {
    handleDblclick(){
      this.$data._isDblClick = true;
    },
    handleClick(e){
      const item = this.item;

      if(item !== this.p.currItem){
        return;
      }
      console.log('item.focus', item.focus)
      if(this.$data._isClicked){
        return;
      }
      this.$data._isClicked = true;


      const self = this;
      setTimeout(() => {
              
        if(self.$data._isDblClick){
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
        url: '~/fs' + this.p.address,
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
    }
  }
}
</script>
