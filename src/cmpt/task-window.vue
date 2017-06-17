<template lang="jade">
.lr-task-window(@click.stop='handleClick',  :style='{width:width, height: height, zIndex: zIndex, top: positionTop + "px", left: positionLeft  + "px"}', draggable='true', @dragstart='handleDragStart', @dragend='handleDragEnd')
  .lr-title(:class='titleClass')
    .lr-title-content {{name}} {{zIndex}} #index:{{index}} #id:{{id}}
    .lr-title-close(@click.stop='removeTask')
</template>

<script>
import store from '__ROOT__/store-global';
export default {
  props: ['index'],
  data(){
    return store.state.tasks[this.index];
  },
  methods:{
    removeTask(){
      store.commit('removeTask', {
        index: this.index,
        zIndex: this.zIndex
      });
    },
    handleClick(){
      store.commit('taskWindowFocus', this.$data);
    },
    handleDragStart(e){
      if(!this.focus){
        store.commit('taskWindowFocus', this.$data);
      }

      e.dataTransfer._startClient = {
        x: e.clientX,
        y: e.clientY
      }

    },
    handleDragEnd(e){
      const startClient = e.dataTransfer._startClient;
      this.positionLeft += (e.clientX - startClient.x);
      this.positionTop += (e.clientY - startClient.y);
    }
  },
  computed:{
    titleClass(){
      return this.focus ? 'lr-focus' : ''
    }
  }
}
</script>
