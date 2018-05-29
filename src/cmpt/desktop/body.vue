<template lang="jade">
.lr-desk(@drop='handleDeskDrop',
         @dragover.prevent='',
         @contextmenu.prevent.stop='handleContextmenu',
         @dragend='handleIconDragEnd')
  Icon(v-for="v in list",
      :key="v.id",
      :item="v")
  Contextmenu(v-if="isShowContextmenu", :close='closeContextMenu')
    h1 haha
  slot
</template>
<script>

import Icon from './icon.vue';
import Contextmenu from '../global/contextmenu.vue';

export default {
  components: {
    Icon,
    Contextmenu
  },
  data(){
    return {
      list: [],
      isShowContextmenu: false,
      _isInDesk: false
    }
  },
  methods: {
    handleContextmenu(e){
      window.APP.contextMenuTransferData = {
        x: e.clientX,
        y: e.clientY
      }
      this.isShowContextmenu = true;
    },
    closeContextMenu(){
      window.APP.contextMenuTransferData = null;
      this.isShowContextmenu = false;
    },
    handleIconDragEnd(e){
      console.log('handleIconDragEnd')
      if(!this.$data._isInDesk){
        return;
      }
      this.$data._isInDesk = false;
      const dragTransferData = this.$store.state.dragTransferData;
      if(!dragTransferData){
        console.log('body dragend !dragTransferData');
        return;
      }

      const startClient = dragTransferData._startClient;
      console.log('body dragend');

      const vueEl = startClient._vueEl;
      let positionTop = vueEl.item.y  + (e.clientY - startClient.y);
      if(positionTop < 0) {
        positionTop = 0;
      }else{
        let deskH = this.$el.offsetHeight;
        let elH = vueEl.$el.offsetHeight;
        if(positionTop + elH > deskH){
          positionTop = deskH - elH;
        }
      }
      let positionLeft =  vueEl.item.x + (e.clientX - startClient.x);
      if(positionLeft < 0) {
        positionLeft = 0;
      }else{
        let deskW = this.$el.offsetWidth;
        let elW = vueEl.$el.offsetWidth;

        if(positionLeft + elW > deskW){
          positionLeft = deskW - elW;
        }
      }

      vueEl.item.x = positionLeft;
      vueEl.item.y = positionTop;
      
      this.save();
    },
    save(){
      this.request({
        url: '~/desktop',
        type: 'post',
        data: {
          data: JSON.stringify(this.list)
        },
        success(){
          console.log('desktop save ok');
        }
      })
    },
    handleDeskDrop(e){
      const dragTransferData = this.$store.state.dragTransferData;
      if(dragTransferData.isRaw){
        
        this.list.push({
          id: dragTransferData.id,
          type: dragTransferData.type,
          x: e.clientX,
          y: e.clientY
        })
        this.save();
        return;
      }
     this.$data._isInDesk = true;
    },
    openDustBin(){
      this.$store.commit('addTask', {
        name: 'Dustbin',
        type: 'dustbin',
        unique: true
      });
    }
  },
  created(){
    this.request({
      url: '~/desktop',
      success(result){
        this.list = JSON.parse(result);
      }
    })
  }

}

</script>
