<template lang="jade">
.lr-task-window(v-show='!isMin',
                @mousedown.capture='taskFocus',
                @contextmenu.stop='',
                :style='{width:width + "px", height: height  + "px", zIndex: zIndex, top:     positionTop + "px", left: positionLeft  + "px"}' ,
                :class='{lr_task_max: isMax, lr_task_unique: unique, lr_task_un_focus: !isFocus}')
  .lr-task-title(@dblclick='maxToggle')
    Movable.lr-task-title-content(:onMove='handleMove',
                                  :startX='positionLeft',
                                  :startY='positionTop')
      .lr-icon(:style="`background-image:url(${APP.iconUrl})`")
      | {{currTitle}}
    .lr-task-control
      .lr-task-ctrl-item(@click.stop='hiddenTask')
        span.glyph.glyph-remove
      .lr-task-ctrl-item(@click.stop='maxToggle',
                    :class='isMax ? "lr_task_control_shrink" : "lr-task-control-max"')
        span.glyph.glyph-stop
        span.glyph.glyph-stop.lr-task-glyph-stop-2
      .lr-task-ctrl-item.lr-task-ctrl-colse(@click.stop='removeTask')
        span.glyph.glyph-cancel


      
  FsBody(v-if='appId==="sys_app_file"')
  RecycleBinBody(v-else-if='appId==="sys_app_recycle_bin"')
  DiskBody(v-else-if='appId==="sys_app_disk"')
  ComputerInfo(v-else-if='appId==="sys_app_computer"')
  Editor(v-else-if='appId==="sys_app_editor"', :task='this.$data')
  //-ThirdPartyApp(v-else, :task='this.$data')


  Resizable
</template>

<script>
import FsBody from '../sys-app/fs/index.vue';
import RecycleBinBody from '../sys-app/recycle-bin.vue';
import DiskBody from '../sys-app/fs/disk.vue';
import ComputerInfo from '../sys-app/computer-info.vue';
import Editor from '../sys-app/editor.vue';
//import ThirdPartyApp from '../third-party-app/index.vue';
import Resizable from '../unit/resizable.vue';
import Movable from '../unit/movable.vue';

export default {
  props: ['index'],
  components: {
    DiskBody,
    RecycleBinBody,
    FsBody,
    ComputerInfo,
    Editor,

    //ThirdPartyApp,

    Resizable,
    Movable
  },
  data(){
    return this.$store.state.task.list[this.index];
  },
  computed:{
    currTitle(){
      return this.title || this.$store.getters['language/currLanguage'][this.appId].title
    },
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
    taskFocus(e){
      e._isHandle = true;
      this.$store.commit('task/focus', this.$data);
    }
  }
}
</script>
