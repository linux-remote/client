<style>
.lr-desk-icon{
  position: absolute;
  width: 80px;
  height: 80px;
  user-select: none;
  display:flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.lr-desk-icon-img{
  height: 60px;
  width: 100%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.lr-desk-icon-text{
  font-size: 12px;
}
.lr-desk-icon:hover{
  background-color: #D3D3D3;
}
.lr_desk_icon_focus{
  background-color: #ddd;
}
</style>
<template lang="jade">
.lr-desk(@drop='handleDrop',
         @dragover.prevent='',
         @dragend='handleDragEnd')
  Draggable.lr-desk-icon(v-for="v in list",
                    :key="v.id",
                    :id="v.id",
                    :x="v.x",
                    :y="v.y",
                    :class="{lr_desk_icon_focus: appMap[v.id].unique}")
    .lr-desk-icon-img(:style="{backgroundImage: `url(${appMap[v.id].iconUrl})`}")
    .lr-desk-icon-text {{appMap[v.id].title}}
</template>
<script>

import Draggable from '__ROOT__/cmpt/unit/draggable.vue';


export default {
  components: {
    Draggable
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
    handleDragEnd(e){
      if(!this.$data._isInDesk){
        return;
      }
      this.$data._isInDesk = false;

      const startClient = e.dataTransfer._startClient;
      if(!startClient) return;

      const vueEl = startClient._vueEl;
      let positionTop = vueEl.y  + (e.clientY - startClient.y);
      if(positionTop < 0) {
        positionTop = 0;
      }else{
        let deskH = this.$el.offsetHeight;
        let elH = vueEl.$el.offsetHeight;
        if(positionTop + elH > deskH){
          positionTop = deskH - elH;
        }
      }
      let positionLeft =  vueEl.x + (e.clientX - startClient.x);
      if(positionLeft < 0) {
        positionLeft = 0;
      }else{
        let deskW = this.$el.offsetWidth;
        let elW = vueEl.$el.offsetWidth;

        if(positionLeft + elW > deskW){
          positionLeft = deskW - elW;
        }
      }

      vueEl.x = positionLeft;
      vueEl.y = positionTop;
    },
    handleDrop(e){
     this.$data._isInDesk = true;
    },
    openDustBin(){
      this.$store.commit('addTask', {
        name: 'Dustbin',
        type: 'dustbin',
        unique: true
      });
    },
    initDeskWH(){
      this.$store.commit('set', {
        deskW: this.$el.offsetWidth,
        deskH: this.$el.offsetHeight
      })
    }
  },
  mounted(){
    this.initDeskWH();
    window.addEventListener('resize', this.initDeskWH);
  },
  destroyed(){
    window.removeEventListener('resize', this.initDeskWH);
  }

}

</script>
