<template lang="jade">
.lr-task-window(@click.stop='handleClick',  :style='{width:width + "px", height: height  + "px", zIndex: zIndex, top: positionTop + "px", left: positionLeft  + "px"}' , :draggable='draggable', @dragstart.stop='handleDragStart', @dragend.stop='handleDragEnd')
  .lr-title(:class='titleClass' @mousedown='handleTitleMousedown' @mouseup='disableDraggable')
    .lr-title-content {{name}} {{zIndex}} #index:{{index}} #id:{{id}}
    .lr-title-close(@click.stop='removeTask')
  fs-body(v-if='type==="fs"')
  .lr-window-body(v-else-if='!type') Empty
</template>

<script>
import store from '__ROOT__/store-global';
import FsBody from './window-body/fs';
export default {
  components: {
    FsBody
  },
  props: ['index'],
  data(){
    return store.state.tasks[this.index];
  },
  methods:{
    handleTitleMousedown(){
      this.draggable = true;
    },
    disableDraggable(){
      this.draggable = false;
    },
    removeTask(){
      store.commit('removeTask', {
        index: this.index,
        zIndex: this.zIndex
      });
    },
    // handleNothing(e){
    //   return false
    // },
    handleClick(){
      store.commit('taskWindowFocus', this.$data);
    },
    handleDragStart(e){
      if(!this.draggable){
        e.preventDefault();
        return false;
      }

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
      this.draggable = false;
    }
  },
  computed:{
    titleClass(){
      return this.focus ? 'lr-focus' : ''
    }
  }
}
</script>
