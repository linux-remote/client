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
    // const firstList = [{
    //   id: 'sys_recycle_bin',
    //   x: 0,
    //   y: 0
    // }];
    // //{"type":"app","id":"sys_recycle_bin","x": 0,"y":0}
    return {
      list: [],
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
          console.log('ok');
        }
      })
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
