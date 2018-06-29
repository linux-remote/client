<template lang="jade">
#lr-desktop.lr-desk(@drop='handleDeskDrop',
                    @dragover.prevent='',
                    @mousedown='handleMousedown',
                    @dragend='handleIconDragEnd')
  Icon(v-for="(v,i) in list",
      :key="v.id",
      :index="i",
      :item="v")

  ContextMenu(ref='ctx')
    .lr-ctx-item(@click="sortIcon")
      | {{LANG.ctx.SortOut}}
    .lr-ctx-item(@click="reload")
      | {{LANG.ctx.Refresh}}

                
  TaskWindow(v-for='(item, index) in tasks', :key='item.id', :index='index')
</template>
<script>

import Icon from './icon.vue';
import TaskWindow from '__ROOT__/cmpt/task/window.vue';

import ContextMenu from '../global/contextmenu/index.vue';
//import Cascade from '../global/cascade.vue';

const ICON_WIDTH = 80;
const ICON_HEIGHT = 80;
export default {
  components: {
    Icon,
    TaskWindow,

    ContextMenu,
    //Cascade
  },
  props: ['icons'],
  data(){
    var icons = this.icons;
    if(!icons){ // 回收站可以被移除
      const app = this.$store.getters['app/getById']('sys_app_recycle_bin');
      icons = [{
        id: 'sys_app_recycle_bin',
        title: app.title,
        x:0,
        y:0
      }]
    }else{
      icons = JSON.parse(icons);
    }

    return {
      list: icons,
      _isInDesk: false
    }
  },
  computed:{
    deskTopEvent(){
      return this.$store.state.deskTopEvent
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].deskTop
    },
    tasks(){
      return this.$store.state.task.list;
    }
  },
  watch: {
    deskTopEvent(e){
      switch(e.type){
        case 'add':
          this.list.push(e.item);
          this.save();
          break;
      }
    }
  },
  methods: {
    handleMousedown(e){
      if(!e._isHandle){
        this.$store.commit('task/currentUnFocus');
      }
    },
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
      this.$refs.ctx.hidden();
    },
    reload(){
      this.getData();
      this.$refs.ctx.hidden();
    },
    handleIconDragEnd(e){
      if(!this.$data._isInDesk){
        return;
      }
      this.$data._isInDesk = false;
      const dragTransferData = this.$store.state.dragTransferData;
      if(!dragTransferData){

        return;
      }

      const startClient = dragTransferData._startClient;
      //console.log('body dragend');

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
        url: '~/desktop/icons',
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
      if(dragTransferData && dragTransferData.isFromStart){
        this.list.push({
          id: dragTransferData.id,
          x: e.clientX,
          y: e.clientY
        })
        this.save();
        return;
      }
      this.$data._isInDesk = true;
    },
    getData(){
      this.request({
        url: '~/desktop/icons',
        success(result){
          if(!result){
            return;
          }
          this.list = JSON.parse(result);
        }
      })
    }
  },
  mounted(){
    this.$store.commit('setDeskTopWH');
    //-this.$store.commit('task/add', {appId: 'sys_app_file', address: '/home/dw/upload'});
  }
}
    // Cascade.lr-ctx-item
    //   | 设置桌面壁纸
    //   .lr-test-parent(slot='menu')
    //     .lr-ctx-item 选择
    //     .lr-ctx-item 上传
    //     Cascade 333
    //       div(slot='menu')
    //         .lr-ctx-item 333
    //         .lr-ctx-item 333
    //         Cascade 444
    //           div(slot='menu')
    //             .lr-ctx-item 444
    //             .lr-ctx-item 444
</script>
