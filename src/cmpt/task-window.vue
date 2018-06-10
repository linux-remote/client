<template lang="jade">
.lr-task-window(v-show='!isMin',
                @mousedown.stop='taskFocus',
                :style='{width:width + "px", height: height  + "px", zIndex: zIndex, top:     positionTop + "px", left: positionLeft  + "px"}' ,
                :class='{lr_task_max: isMax, lr_task_unique: unique, lr_task_focus: isFocus}')
  Movable.lr-task-title(@dblclick='maxToggle',
                        :onMove='handleMove',
                        :startX='positionLeft',
                        :startY='positionTop')
    .lr-task-title-content {{title}}
    .lr-task-control
      .lr-task-control-min(@click.stop='hiddenTask')
      div(@click.stop='maxToggle',
                    :class='isMax ? "lr_task_control_shrink" : "lr-task-control-max"')
      .lr-task-control-close(@click.stop='removeTask')
  slot
  Resizable
</template>

<script>
import Resizable from './unit/resizable.vue';
import Movable from './unit/movable.vue';
export default {
  props: ['index'],
  components: {
    Resizable,
    Movable
  },
  data(){
    return this.$store.state.task.list[this.index];
  },
  computed:{
    deskTopW(){
      console.log('deskTopW', this.$store.state.deskTopW)
      return this.$store.state.deskTopW
    },
    deskTopH(){
      console.log('deskTopW', this.$store.state.deskTopW)
      return this.$store.state.deskTopH
    }
  },
  methods:{
    // handleTitleMousemove(){
    //   console.log('handleTitleMousemove')
    // },
    handleMove2(x, y){
     if(y < 0){
        y = 0;
      }
      this.positionTop = y;
      this.positionLeft =  x;
    },
    handleMove(e){


      var data = e._movableData;
      if(this.isMax){
        this.bakBeforeMax.positionTop = 0;

        var width = this.bakBeforeMax.width;
        var halfW = width / 2;
        if(e.clientX < halfW){
          this.bakBeforeMax.positionLeft = 0;
          e._movableData._startX
          console.log( ' left ', e.clientX, halfW)
        }else{
          var rightEdge = this.deskTopW - halfW;
          if(e.clientX > rightEdge){
            this.bakBeforeMax.positionLeft = this.deskTopW - width;
          }else {

            this.bakBeforeMax.positionLeft = e.clientX - halfW;
          }
        }
        e._movableData._startX = this.bakBeforeMax.positionLeft;
        e._movableData._startY = this.bakBeforeMax.positionTop;
        this.maxToggle();
        return;
      }
      
      if(data.newY < 0){
        data.newY = 0;
      }
      this.positionTop = data.newY;
      this.positionLeft =  data.newX;
      
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
        this.height = this.deskTopH;
        this.width = this.deskTopW;
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

    taskFocus(){
      this.$store.commit('task/focus', this.$data);
    },
    handleDragStart(e){
      if(!this.draggable){
        e.preventDefault();
        return ;
      }

      if(!this.isFocus){
        this.$store.commit('task/focus', this.$data);
      }

      e.dataTransfer._startClient = {
        x: e.clientX,
        y: e.clientY
      }

      if(this.isMax){
        this.maxToggle();
         var img = new Image(); 
          img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          e.dataTransfer.setDragImage(img, 0, 0)
        
      }
      //console.log(e);
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
  }
}
</script>
