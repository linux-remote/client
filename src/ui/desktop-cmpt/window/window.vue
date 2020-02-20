<template lang="jade">
Focusable.lr-window(:tabIndex="tabIndex", :class="{lr_window_maximized: maximized, lr_window_resizable: resizable}")
  .lr-title
    Movable(@moveStart="handleMoveStart", @moving="handleMoving", v-if="movable")
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
  Resizable(:proxy="box", :direction="resizeDirection", v-if="resizable", v-show="!maximized")
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
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 480
    },
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    }
  },

  data(){
    return {
      maximized: false,
      
      // cssText: this.style,
      box: {
        height: this.height,
        width: this.width,
        positionTop: this.top,
        positionLeft: this.left
      }
    }
  },
  methods: {

    reStyle(){
      const width = this.$el.clientWidth;
      const height = this.$el.clientHeight;
      const top = this.$el.offsetTop;
      const left = this.$el.offsetLeft;
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
      this.$el.style.cssText = 'width:' + width + 'px;' + 
      'height:' + height + 'px;' + 
      'top:' + top + 'px;' +
      'left:' + left + 'px';
    },
    handleMinClick(){

    },
    handleMoveStart(){
      this.$options._moveStartData = {
        top: this.$el.offsetTop,
        left: this.$el.offsetLeft
      }
    },
    handleMoving({moveX, moveY}){
      const data = this.$options._moveStartData;
      this.$el.style.top = (data.top - moveY) + 'px';
      this.$el.style.left = (data.left - moveX) + 'px';
    },
    handleMaxClick(){
      this.maximized = !this.maximized;
    },


  },
  mounted(){
    this.reStyle();
  }
}
</script>