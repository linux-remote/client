<template lang="jade">
Focusable.lr-window(:tabIndex="tabIndex", :class="{lr_window_maximized: maximized, lr_window_resizable: resizable, lr_window_block: isBlock}", 
:style="{top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px'}")
  .lr-window_block_mask(@mousedown.prevent="hanldeBlockMaskMouseDown")
  .lr-title
    Movable(v-if="movable", @moveStart="handleMoveStart", @moving="handleMoving")
    LRIcon(:type="iconType", :value="icon")
    .lr-title-content
      span {{title}}
    .lr-btn_nf(@click="handleMinClick", v-if="minimizable")
      span.lr-icon_min
    .lr-btn_nf(@click="handleMaxClick", v-if="maximizable")
      span.lr-icon_unmax(v-if="maximized")
      span.lr-icon_max(v-else)
    .lr-btn_nf.lr-btn-close(@click="close", v-if="close")
      span.lr-icon_close
  .lr-window-body
    slot
  Resizable(v-if="resizable", 
    v-show="!maximized", 
    :direction="resizeDirection",  
    @resizeStart="handleResizeStart", 
    @resizing="handleResizing")
</template>
<script>
import Focusable from '../../unit/focusable.vue';
import LRIcon from '../../cmpt/icon/icon.vue';
import Resizable from '../../unit/resizable.vue';
import Movable from '../../unit/movable.vue';
import MixinEnterBindBtn from '__ROOT__/lib/mixins/enter-bind-last-focused-btn.js'
export default {
  mixins: [MixinEnterBindBtn],
  components: {
    Focusable,
    LRIcon,
    Resizable,
    Movable
  },
  props: {
    tabIndex: {
      type: Number
    },
    close: {
      type: Function
    },
    icon: {
      type: String,
      default: ''
    },
    iconType: {
      type: String,
      default: 'img'
    },
    title: {
      type: String,
      default: ''
    },
    minimizable: {
      type: Boolean,
      default: false
    },
    maximizable: {
      type: Boolean,
      default: false
    },
    resizable: {
      type: Boolean,
      default: false
    },
    movable: {
      type: Boolean,
      default: false
    },
    resizeDirection: {
      type: String,
      default: 'all'
    },
    
    startWidth: {
      type: Number,
      default: 600
    },
    startHeight: {
      type: Number,
      default: 480
    },
    startTop: {
      type: Number,
      default: 0
    },
    startLeft: {
      type: Number,
      default: 0
    }
  },

  data(){
    return {
      maximized: false,
      isBlock: false,
      height: this.startHeight,
      width: this.startWidth,
      top: this.startTop,
      left: this.startLeft
    }
  },
  methods: {
    alert(){
      this.isBlock = true;
    },

    handleMinClick(){

    },

    handleMoveStart(virtual){
      virtual.top = this.top;
      virtual.left = this.left;
    },
    handleMoving(virtual){
      this.top = virtual.top;
      this.left = virtual.left;
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

    handleMaxClick(){
      this.maximized = !this.maximized;
    },
    hanldeBlockMaskMouseDown(){
      console.log('hanldeBlockMaskMouseDown')
    }

  },
  mounted(){
  }
}
</script>