<template lang="jade">
.lr-fs-item-name(@click='handleClick') {{item.name}}
</template>

<script>
import {getNameSuffix} from '../fs-util';
import flyTextAreaStore from '__ROOT__/store/fly-textarea';

export default {
  props: ['item', 'p'],
  methods: {
    handleClick(e){
      const item = this.item;
      if(item !== this.p.currItem) return;
      const self = this;
      const data = {
        target: e.target,
        handleBlur : function(newName){
          if(item.name === newName){
            return;
          } 
          self.rename(newName);
        }
      }

      flyTextAreaStore.commit('open', data);

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
