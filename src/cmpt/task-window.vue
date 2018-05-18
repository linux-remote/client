<template lang="jade">
.lr-task-window(v-show='!isMin',
  @mousedown.stop='taskFocus',
:style='{width:width + "px", height: height  + "px", zIndex: zIndex, top: positionTop + "px", left: positionLeft  + "px"}' ,
:class='{lr_2_max: isMax, lr_unique_task: unique}',
:draggable='draggable',
 @dragstart.stop='handleDragStart',
 @dragend.stop='handleDragEnd')
  .lr-title(:class='titleClass', @mousedown='handleTitleMousedown',
  @dblclick='maxToggle',     @mouseup='disableDraggable')
    .lr-title-content {{name}}
    // {{zIndex}} #index:{{index}} #id:{{id}}
    .lr-2-control
      .lr-title-min(@click.stop='hiddenTask')
      .lr-title-max(@click.stop='maxToggle', :class='{lr_2_shrink: isMax}')
      .lr-title-close(@click.stop='removeTask')
  fs-body(v-if='type==="fs"')
  edit-body(v-else-if='type==="edit"' ,:address='address')
  dustbin-body(v-else-if='type==="dustbin"')
  computer-info-body(v-else-if='type==="computerInfo"')
  user-info-body(v-else-if='type==="userInfo"')
  .lr-window-body(v-else='!type') Empty
  .lr-2-resize-top(@mousedown.stop.prevent='resizeStart("t", $event)')
  .lr-2-resize-bottom(@mousedown.stop.prevent='resizeStart("b", $event)')
  .lr-2-resize-left(@mousedown.stop.prevent='resizeStart("l", $event)')
  .lr-2-resize-right(@mousedown.stop.prevent='resizeStart("r", $event)')
  .lr-2-resize-rb(@mousedown.stop.prevent='resizeStart("rb", $event)')
  .lr-2-resize-tl(@mousedown.stop.prevent='resizeStart("tl", $event)')
  .lr-2-resize-tr(@mousedown.stop.prevent='resizeStart("tr", $event)')
  .lr-2-resize-lb(@mousedown.stop.prevent='resizeStart("lb", $event)')
</template>

<script>
import store from '__ROOT__/store-global';
import FsBody from './window-body/fs';
import EditBody from './window-body/edit';
import DustbinBody from './window-body/dustbin';
import ComputerInfoBody from './window-body/computer-info';
import UserInfoBody from './window-body/user-info';
export default {
  components: {
    FsBody,
    EditBody,
    DustbinBody,
    ComputerInfoBody,
    UserInfoBody
  },
  props: ['index'],
  data(){
    return store.state.tasks[this.index];
  },
  methods:{
    resizeStart(type, e){
      this.resizeStartData = {
        x: e.clientX,
        y: e.clientY,
        height: this.height,
        width: this.width,
        direction: type
      };

      window.addEventListener('mousemove', this.resizeMousemoveListener);
      window.addEventListener('mouseup', this.resizeMouseupListener, {
        once: true
      });
    },
    minMax(min, max, v){
      if(v < min){
        return min;
      }else if(v > max){
        return max;
      }else{
        return v;
      }
    },
    resizeMousemoveListener(e){
      const initial = this.resizeStartData;
      const moveX = initial.x - e.clientX;
      const moveY = initial.y - e.clientY;

      /////////////////////////////////////////////
      //console.log('move', this);
      const direction = initial.direction;
      let height, width;
      if(direction.indexOf('t') !== -1){
        height = this.minMax(200, this.winH, initial.height + moveY)
        if( e.clientY >= 0){
          this.positionTop = e.clientY;
        }
        this.height = height;
      }else if(direction.indexOf('b') !== -1){
        height = this.minMax(200, this.winH, initial.height - moveY)
        this.height = height;
      }

      if(direction.indexOf('l') !== -1){
        width = this.minMax(200, this.winW, initial.width + moveX)
        if( e.clientX >= 0){
          this.positionLeft = e.clientX;
        }
        this.width = width;
      }else if(direction.indexOf('r') !== -1){
        width = this.minMax(200, this.winW, initial.width - moveX)
        this.width = width;
      }
    },
    resizeMouseupListener(){
      window.removeEventListener('mousemove', this.resizeMousemoveListener);
    },
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
          isMax: this.isMax,
          height: this.height,
          width: this.width,
          positionTop: this.positionTop,
          positionLeft: this.positionLeft
        }

        this.isMax = true;
        this.height = this.winH;
        this.width = this.winW;
        this.positionTop = 0;
        this.positionLeft = 0;
      }

    },
    hiddenTask(){
      store.commit('hiddenTask', this.$data);
    },
    removeTask(){
      store.commit('removeTask', this.index);
    },
    // handleNothing(e){
    //   return false
    // },
    taskFocus(){
      store.commit('taskWindowFocus', this.$data);
    },
    handleDragStart(e){
      if(!this.draggable || this.isMax){
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
  },
  // destroyed(){
  // },
  // created(){
  // }
}
</script>
