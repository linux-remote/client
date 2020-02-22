<template lang="jade">
.lr-window(:style="{top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px'}", :class="{lr_window_max: isMax}")
  Resizable(v-if="resizable",
    v-show="!maximized", 
    :direction="resizeDirection",  
    @resizeStart="handleResizeStart",
    @resizing="handleResizing")
  Focusable.lr-window_main(:tabindex="tabIndex",
                  :enterBindBtn="enterBindBtn",
                  :class="{lr_window_maximized: maximized, lr_window_resizable:       resizable}")
    .lr-title
      LRIcon(:type="iconType", :value="icon")
      .lr-title-content
        Movable(v-if="movable", @moveStart="handleMoveStart", @moving="handleMoving")
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

  Alert(v-if="alertData",
        :pWidth="width",
        :pHeight="height",
        :close="closeAlert",
        v-bind="alertData")
</template>
<script>
import Focusable from '../../unit/focusable.vue';
import LRIcon from '../../cmpt/icon/icon.vue';
import Resizable from '../../unit/resizable.vue';
import Movable from '../../unit/movable.vue';
import Alert from '../block/alert.vue';
export default {
  components: {
    Focusable,
    LRIcon,
    Resizable,
    Movable,
    Alert
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
    startIsMax: {
      type: Boolean,
      default: false
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
    },
    enterBindBtn: {
      type: Boolean
    }
  },

  data(){
    return {
      maximized: false,
      isMax: this.startIsMax,
      height: this.startHeight,
      width: this.startWidth,
      top: this.startTop,
      left: this.startLeft,
      alertData: null
    }
  },
  methods: {
    focus(){
      this.$el.lastElementChild.focus();
    },
    alert(data){
      this.alertData = data;
    },
    closeAlert(){
      this.alertData = null;
      this.$nextTick(() => {
        this.focus();
      });
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
    }

  },
  mounted(){
    if(this.startIsMax){
      this.top = 0;
      this.left = 0;
      this.width = this.$el.parentElement.clientWidth;
      this.height = this.$el.parentElement.clientHeight;
    }
  }
}
</script>