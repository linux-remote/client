<template lang="jade">
.lr-task-window(v-show='!isMin',
  @mousedown.stop='taskFocus',
:style='{width:width + "px", height: height  + "px", zIndex: zIndex, top: positionTop + "px", left: positionLeft  + "px"}' ,
:draggable='draggable',
 @dragstart.stop='handleDragStart',
 @dragend.stop='handleDragEnd')
  .lr-title(:class='titleClass' @mousedown='handleTitleMousedown' @mouseup='disableDraggable')
    .lr-title-content {{name}} {{zIndex}} #index:{{index}} #id:{{id}}
    .lr-2-control
      .lr-title-min(@click.stop='hiddenTask')
      .lr-title-max(@click.stop='maxToggle', :class='{lr_2_shrink: bakBeforeMax}')
      .lr-title-close(@click.stop='removeTask')
  fs-body(v-if='type==="fs"')
  edit-body(v-else-if='type==="edit"' ,:address='address')
  .lr-window-body(v-else='!type') Empty
</template>

<script>
import store from '__ROOT__/store-global';
import FsBody from './window-body/fs';
import EditBody from './window-body/edit';
export default {
  components: {
    FsBody,
    EditBody
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
    maxToggle(){
      if(this.bakBeforeMax){
        Object.assign(this, this.bakBeforeMax);
        this.bakBeforeMax = null;
      }else{
        this.bakBeforeMax = {
          height: this.height,
          width: this.width,
          positionTop: this.positionTop,
          positionLeft: this.positionLeft
        }
        this.height = this.winH;
        this.width = this.winW;
        this.positionTop = 0;
        this.positionLeft = 0;
      }

    },
    normalTask(){
      console.log('maxTask');
      // this.height = this.winH;
      // this.width = this.winW;
      // this.positionTop = 0;
      // this.positionLeft = 0;
    },
    hiddenTask(){
      this.isMin = true;
      store.commit('focusNextTask', this.zIndex);
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
    taskFocus(){
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
      if(!startClient) return;
      const positionTop = this.positionTop + (e.clientY - startClient.y);

      if(positionTop < 0) {
        this.positionTop = 0;
      }else{
        this.positionTop = positionTop;
      }

      this.positionLeft += (e.clientX - startClient.x);

      this.draggable = false;
    }
  },
  computed:{
    titleClass(){
      return this.focus ? 'lr-focus' : ''
    },
    winW(){
      return store.state.winW
    },
    winH(){
      return store.state.winH
    }
  }
}
</script>
