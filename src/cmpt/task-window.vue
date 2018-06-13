<template lang="jade">
.lr-task-window(v-show='!isMin',
                @mousedown.stop='taskFocus',
                :style='{width:width + "px", height: height  + "px", zIndex: zIndex, top:     positionTop + "px", left: positionLeft  + "px"}' ,
                :class='{lr_task_max: isMax, lr_task_unique: unique, lr_task_focus: isFocus}')
  .lr-task-title(@dblclick='maxToggle')
    Movable.lr-task-title-content(:onMove='handleMove',
                                  :startX='positionLeft',
                                  :startY='positionTop')
      .lr-icon(:style="`background-image:url(${iconUrl})`")
      | {{title}}
    .lr-task-control
      .lr-task-control-min(@click.stop='hiddenTask')
      div(@click.stop='maxToggle',
                    :class='isMax ? "lr_task_control_shrink" : "lr-task-control-max"')
      .lr-task-control-close(@click.stop='removeTask')

      
  FsBody(v-if='appId==="sys_app_file"')
  RecycleBinBody(v-else-if='appId==="sys_app_recycle_bin"')
  DiskBody(v-else-if='appId==="sys_app_disk"')

  ThirdPartyApp(v-else, :task='this.$data')


  Resizable
</template>

<script>
import FsBody from './sys-app/fs/index.vue';
import RecycleBinBody from './sys-app/recycle-bin.vue';
import DiskBody from './sys-app/fs/disk.vue';

import ThirdPartyApp from './third-party-app/index.vue';

import Resizable from './unit/resizable.vue';
import Movable from './unit/movable.vue';
export default {
  props: ['index'],
  components: {
    DiskBody,
    RecycleBinBody,
    FsBody,

    ThirdPartyApp,

    Resizable,
    Movable
  },
  data(){
    return this.$store.state.task.list[this.index];
  },
  computed:{
    deskTopW(){
      return this.$store.state.deskTopW
    },
    deskTopH(){
      return this.$store.state.deskTopH
    }
  },
  methods:{
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
          //console.log( ' left ', e.clientX, halfW)
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
    }
  }
}
</script>
