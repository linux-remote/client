<template lang="jade">
.lr-desk(@drop='handleDeskDrop',
         @dragover.prevent='',
         @dragend='handleIconDragEnd')
  Icon(v-for="v in list",
      :key="v.id",
      :item="v")
</template>
<script>

import Icon from './icon.vue';


export default {
  components: {
    Icon
  },
  data(){
    const firstList = [{
      id: 'lr_sys_app_recycle_bin',
      x: 0,
      y: 0
    }];

    return {
      list: localStorage.deskIconList || firstList,
      _isInDesk: false
    }
  },
  computed: {
    appMap(){
      return this.$store.state.appMap
    }
  },
  methods: {
    handleIconClick(){
      conosle.log('handleIconClick');
    },

    handleIconDragEnd(e){
      if(!this.$data._isInDesk){
        return;
      }
      this.$data._isInDesk = false;
      const startClient = e.dataTransfer._startClient;
      if(!startClient) return;

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

    },
    handleDeskDrop(e){
     this.$data._isInDesk = true;
    },
    openDustBin(){
      this.$store.commit('addTask', {
        name: 'Dustbin',
        type: 'dustbin',
        unique: true
      });
    }
  }
  // mounted(){
  //   this.initDeskWH();
  //   window.addEventListener('resize', this.initDeskWH);
  // },
  // destroyed(){
  //   window.removeEventListener('resize', this.initDeskWH);
  // }

}

</script>
