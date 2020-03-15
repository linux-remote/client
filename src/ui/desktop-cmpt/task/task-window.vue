<template lang="jade">
.lr-window-wrap(v-show="!isMin", 
          :style="{top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px', zIndex: zIndex}", 
          :class="{lr_window_max: isMax}")
  Focusable.lr-window( ref="main")
    .lr-title
      .lr-title-content(@dblclick='maxToggle')
        .lr-icon(v-if="APP.iconUrl", v-open-icon="APP.iconUrl")
        .lr-icon(v-else :class="APP.iconClassName")
        Movable( @moveStart="handleMoveStart", @moving="handleMoving")
        span {{currTitle}}
      .lr-btn_nf(@click="hiddenTask", v-if="minimizable")
        span.lr-icon_min
      .lr-btn_nf(@click="maxToggle", v-if="maximizable")
        span.lr-icon_unmax(v-if="!isMax")
        span.lr-icon_max(v-else)
      .lr-btn_nf.lr-btn-close(@click="close")
        span.lr-icon_close


    component(:is="appId", ref="body")

  Resizable(
    v-show="!isMax",
    :direction="resizeDirection",
    @resizeStart="handleResizeStart",
    @resizing="handleResizing")
</template>

<script>
import sys_app_fs from '../../../cmpt/sys-app/fs/index.vue';
import sys_app_recycle_bin from '../../../cmpt/sys-app/recycle-bin/recycle-bin.vue';
import sys_app_editor from '../../../cmpt/sys-app/editor/editor.vue';
import sys_app_terminal from '../../../cmpt/sys-app/terminal/index.vue';

// import sys_app_disk from '../../sys-app/disk/disk.vue';
// import sys_app_computer from '../../sys-app/computer-info/computer-info.vue';
// import sys_app_task_manager from '../../sys-app/task-manager/task-manager.vue';
// import sys_app_settings from '../../sys-app/settings/settings.vue';
// import sys_app_account from '../../sys-app/account/account.vue';
//import ThirdPartyApp from '../../third-party-app/index.vue';
import Resizable from '../../unit/resizable.vue';
import Movable from '../../unit/movable.vue';
import SimpleEvent from './window/simple-event.js';
import Focusable from '../../unit/focusable.vue';
import map from './map.js';

export default {
  props: ['index'],
  provide() {
    return {
      taskWindow: this
    }
  },
  components: {
    sys_app_recycle_bin,
    sys_app_fs,
    sys_app_editor,
    sys_app_terminal,
    // sys_app_disk,

    // sys_app_computer,

    // sys_app_task_manager,
    // sys_app_settings,
    // sys_app_account,
    //ThirdPartyApp,

    Resizable,
    Movable,
    Focusable
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
    focus(){
      this.$refs.main.$el.focus();
    },
    handleResizeStart(virtual){
      virtual.top = this.top;
      virtual.left = this.left;
      virtual.width = this.width;
      virtual.height = this.height;
    },
    handleResizing(virtual){
      this.top = virtual.top;
      this.left = virtual.left;
      this.width = virtual.width;
      this.height = virtual.height;
    },
    handleMoveStart(virtual){
      virtual.top = this.top;
      virtual.left = this.left;
    },
    handleMoving(virtual){
      this.top = virtual.top;
      this.left = virtual.left;
    },
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
      if(e.preventDefaulted){
        return;
      }
      this.$store.commit('task/remove', this.index);
    },
    taskFocus(e){
      e._isHandle = true;
      this.$store.commit('task/focus', this.$data);
    }
  },
  created(){
    map[this.id] = this;
  },
  destroyed(){
    delete(map[this.id]);
  }
}
</script>
