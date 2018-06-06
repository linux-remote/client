<template lang="jade">
.lr-task-window(v-show='!isMin',
                @mousedown.stop='taskFocus',
                :style='{width:width + "px", height: height  + "px", zIndex: zIndex, top:     positionTop + "px", left: positionLeft  + "px"}' ,
                :class='{lr_task_max: isMax, lr_task_unique: unique, lr_task_focus: isFocus}',
                :draggable='draggable',
                @dragstart.stop='handleDragStart',
                @dragend.stop='handleDragEnd')
  .lr-task-title(@mousedown='handleTitleMousedown',
            @dblclick='maxToggle', 
            @mouseup='disableDraggable')
    .lr-task-title-content {{name}}
    .lr-task-control
      .lr-task-control-min(@click.stop='hiddenTask')
      div(@click.stop='maxToggle',
                    :class='isMax ? "lr_task_control_shrink" : "lr-task-control-max"')
      .lr-task-control-close(@click.stop='removeTask')
  slot
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

export default {
  props: ['index', 'title', 'taskId'],
  data(){
    return this.$store.state.task.list[this.index];
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
      this.$store.commit('task/hidden', this.$data);
    },
    removeTask(){
      this.$store.commit('task/remove', this.index);
    },
    // handleNothing(e){
    //   return false
    // },
    taskFocus(){
      this.$store.commit('task/focus', this.$data);
    },
    handleDragStart(e){
      if(!this.draggable || this.isMax){
        e.preventDefault();
        return false;
      }

      if(!this.isFocus){
        this.$store.commit('task/focus', this.$data);
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
    winW(){
      return this.$store.state.winW
    },
    winH(){
      return this.$store.state.winH
    }
  }
}
</script>
