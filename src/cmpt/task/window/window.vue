<template lang="jade">
.lr-task-window(v-show='!isMin',
                tabindex="-1",
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
      .lr-task-ctrl-item.lr-task-ctrl-colse(@click.stop='close', @dblclick.stop)
        span.glyph.glyph-cancel


  component(:is="appId", ref="body")

  Resizable(:onResized="handleResized")
</template>

<script>
import sys_app_fs from '../../sys-app/fs/index.vue';
import sys_app_recycle_bin from '../../sys-app/recycle-bin/recycle-bin.vue';
import sys_app_disk from '../../sys-app/disk.vue';
import sys_app_computer from '../../sys-app/computer-info/computer-info.vue';
import sys_app_editor from '../../sys-app/editor/editor.vue';
import sys_app_terminal from '../../sys-app/terminal/index.vue';
import sys_app_task_manager from '../../sys-app/task-manager/task-manager.vue';
import sys_app_settings from '../../sys-app/settings/settings.vue';
//import ThirdPartyApp from '../../third-party-app/index.vue';
import Resizable from '../../unit/resizable.vue';
import Movable from '../../unit/movable.vue';
import SimpleEvent from './simple-event';
export default {
  props: ['index'],
  provide() {
    return {
      taskWindow: this
    }
  },
  components: {
    sys_app_disk,
    sys_app_recycle_bin,
    sys_app_fs,
    sys_app_computer,
    sys_app_editor,
    sys_app_terminal,
    sys_app_task_manager,
    sys_app_settings,
    //ThirdPartyApp,

    Resizable,
    Movable
  },
  data(){
    return this.$store.state.task.list[this.index];
  },
  computed:{
    currTitle(){
      return this.title || this.appTitle;
    },
    appTitle() {
      return this.$store.getters['language/currLanguage'][this.appId].title;
    }, 
    deskTopW(){
      return this.$store.state.deskTopW
    },
    deskTopH(){
      return this.$store.state.deskTopH
    }
  },
  methods:{
    // handleMove2(x, y){
    //   if(y < 0){
    //     y = 0;
    //   }
    //   this.positionTop = y;
    //   this.positionLeft =  x;
    // },
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
    handleResized(e) {
      this.$refs.body.$emit('resized', e);
    },
    maxToggle(){
      if(this.bakBeforeMax){
        let _isResize = this.isMaxToggletriggerResize();
        Object.assign(this, this.bakBeforeMax);
        this.bakBeforeMax = null;
        if(_isResize){
          this.$refs.body.$emit('resized');
        }
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
        let _isResize = this.isMaxToggletriggerResize();
        if(_isResize){
          this.$refs.body.$emit('resized');
        }
      }
    },
    isMaxToggletriggerResize(){
      let a = this.bakBeforeMax;
      if(a.height !== this.height || a.width !== this.width){
        return true;
      }
      return false;
    },
    hiddenTask(){
      this.$store.commit('task/hidden', this.$data);
    },
    close(){
      const e = new SimpleEvent;
      this.$emit('close', e);
      if(e.preventDefaulted){
        return;
      }
      this.$store.commit('task/remove', this.index);
    },
    taskFocus(e){
      e._isHandle = true;
      this.$store.commit('task/focus', this.$data);
    }
  }
}
</script>
