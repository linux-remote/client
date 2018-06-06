<template lang="jade">
#lr-desk.lr-desk(@drop='handleDeskDrop',
         @dragover.prevent='',
         @contextmenu='handleContextmenu',
         @dragend='handleIconDragEnd')
  Icon(v-for="(v,i) in list",
      :key="v.id",
      :index="i",
      :item="v")
  ContextMenu(v-if="contextmenuIsShow", :close="contextmenuClose")
    .lr-contextmenu-item(@click="sortIcon")
      | 整理
    .lr-contextmenu-item(@click="reload")
      | 刷新
    Cascade.lr-contextmenu-item
      | 设置桌面壁纸
      .lr-test-parent(slot='menu')
        .lr-contextmenu-item 选择
        .lr-contextmenu-item 上传
        Cascade 333
          div(slot='menu')
            .lr-contextmenu-item 333
            .lr-contextmenu-item 333
            Cascade 444
              div(slot='menu')
                .lr-contextmenu-item 444
                .lr-contextmenu-item 444
  slot
</template>
<script>

import Icon from './icon.vue';
import ContextmenuExtend from '../global/contextmenu-extend.vue';
import Cascade from '../global/cascade.vue';
const ICON_WIDTH = 80;
const ICON_HEIGHT = 80;
export default {
  extends: ContextmenuExtend,
  components: {
    Icon,
    Cascade
  },
  data(){
    return {
      list: [],
      _isInDesk: false
    }
  },
  methods: {
    sortIcon(){
      let deskH = this.$el.offsetHeight;
      let maxRow = Math.floor(deskH / ICON_HEIGHT);
      let cum = 0;
      this.list.forEach((v, i) => {
        v.x = cum * ICON_WIDTH;
        if( i > maxRow){
          cum = cum + 1;
        }
        v.y = (i % maxRow) * ICON_HEIGHT;
      })
      this.save();
    },
    reload(){
      this.getData();
      this.contextmenuClose();
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
        let elH = ICON_HEIGHT;
        if(positionTop + elH > deskH){
          positionTop = deskH - elH;
        }
      }
      let positionLeft =  vueEl.item.x + (e.clientX - startClient.x);
      if(positionLeft < 0) {
        positionLeft = 0;
      }else{
        let deskW = this.$el.offsetWidth;
        let elW = ICON_WIDTH;

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
      if(dragTransferData && dragTransferData.isRaw){
        
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
      this.$store.commit('task/add', {
        name: 'Dustbin',
        type: 'dustbin',
        unique: true
      });
    },
    getData(){
    this.request({
      url: '~/desktop',
      success(result){
        this.list = JSON.parse(result);
      }
    })
    }
  },
  created(){
    this.getData();
  }

}

</script>
