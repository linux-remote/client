<template lang="jade">
.lr-window(:tabindex="tabindex",
  :class="{lr_window_maximized: isMax, lr_window_resizable: resizable}",
  :style="{top: y + 'px', left: x + 'px', width: w + 'px',   height: h + 'px', zIndex: zIndex}",
  v-show="!isMin")
  .lr-title(:class="{lr_title_shine: isShine}")
    .lr-title-content
      //- .lr-icon(v-open-icon="icon")
      .lr-title_text {{title}}
      Movable(v-if="movable", v-show="!isMax", @moveStart="handleMoveStart", @moving="handleMoving")
    .lr-btn_nf(@click="hidden", v-if="minimizable")
      span.lr-icon_min
    .lr-btn_nf(@click="maxToggle", v-if="maximizable")
      span.lr-icon_unmax(v-if="isMax")
      span.lr-icon_max(v-else)
    .lr-btn_nf.lr-btn-close(@click="close", v-if="close")
      span.lr-icon_close
  .lr-window-body
    slot
  Resizable(v-if="resizable",
    v-show="!isMax", 
    :direction="resizeDirection",  
    @resizeStart="handleResizeStart",
    @resizing="handleResizing",
    @resized="handleResized")
  .lr-window_mask(v-if="isBlock", @mousedown.prevent="handleMaskMousedown")
</template>
<script>
const map = Object.create(null);
import LRIcon from '../../cmpt/icon/icon.vue';
import Resizable from '../../unit/resizable.vue';
import Movable from '../../unit/movable.vue';
// import Focusable from '../../unit/focusable.vue';
import MixinFocusable from '../../../lib/mixins/focusable';
import MixinSafeBind from '../../../lib/mixins/safe-bind';
let zIndex = 3;
let id = 0;

export default {
  mixins: [MixinSafeBind, MixinFocusable],
  components: {
    LRIcon,
    Resizable,
    Movable
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    iconType: {
      type: String,
      default: 'img'
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
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    close: {
      type: Function
    },
    pid: {
      type: Number
    },
    autoFocus: {
      type: Boolean,
      default: true
    }
  },

  data(){
    id = id + 1;
    map[id] = this;
    return {
      id,
      isMax: this.startIsMax,
      h: this.height,
      w: this.width,
      y: this.top,
      x: this.left,
      isMin: false,
      zIndex,
      isBlock: false,
      isBlockFocusenter: false,
      isShine: false
    }
  },
  methods: {
    handleMoveStart(virtual){
      virtual.top = this.y;
      virtual.left = this.x;
    },
    handleMoving(virtual){
      this.y = virtual.top;
      this.x = virtual.left;
    },
    handleResizeStart(virtual){
      virtual.top = this.y;
      virtual.left = this.x;
      virtual.width = this.w;
      virtual.height = this.h;
    },
    handleResizing(virtual){
      this.y = virtual.top;
      this.x = virtual.left;
      this.w = virtual.width;
      this.h = virtual.height;
    },
    handleResized(){
      this.$emit('resized');
    },

    show(){
      this.isMin = false;
      this.$nextTick(() => {
        this.focusenter();
        this.$emit('show');
      });
      
    },

    hidden(){
      this.focusleave();
      this.isMin = true;
      this.$emit('hidden');
    },

    keepTop(){
      zIndex = zIndex + 1;
      this.zIndex = zIndex;
    },
    // focusenter(){
    //   let out = this.$slots.out;
    //   if(out && out.length){
    //     let len = out.length;
    //     for(let i = 0; i < len; i++){
    //       if(out[i].focusenter){
    //         out[i].focusenter();
    //         return;
    //       }
    //     }
    //   }
    //   this.$refs.main.focusenter();
    // },
    maxToggle(){
      let bak;
      if(this.isMax){
        this.isMax = false;
        bak = this.$options._bakMaxPre;
        this.x = bak.x;
        this.y = bak.y;
        this.w = bak.w;
        this.h = bak.h;
      } else {
        bak = this.$options._bakMaxPre = {
          y: this.y,
          x: this.x,
          w: this.w,
          h: this.h
        }
        this.isMax = true;
        this.y = 0;
        this.x = 0;
        this.w = this.$el.parentElement.clientWidth;
        this.h = this.$el.parentElement.clientHeight;
      }
      if(bak.w !== this.w || bak.h !== this.h){
        this.$emit('resized');
      }
    },
    block(){
      this.isBlock = true;
    },
    unblock(){
      this.isBlock = false;
    },
    handleMaskMousedown(){
      this.$emit('maskMouseDown');
    },
    shine(){
      // if(!this.isFocusenter){
      //   return;
      // }
      if(this.isShine){
        this.isShine = false;
          if(this.$options._shineTimer){
            clearTimeout(this.$options._shineTimer);
          }
          this.$options._shineTimer = setTimeout(() => {
            this.isShine = true;
          }, 100);
      } else {
          this.isShine = true;
      }
      this.$emit('shine');
    },
    handleCreatedWithParent(){
      const parentWindow = map[this.pid];
      
      parentWindow.block();
      this.safeBind(parentWindow, 'focusenter', () => {
        this.focusenter();
      });
      this.safeBind(parentWindow, 'maskMouseDown', () => {
        this.shine();
      });
      this.safeBind(parentWindow, 'shine', () => {
        this.shine();
      });
      this.$on('focusenter', () => {
        console.log(' this focusenter ')
        parentWindow.isBlockFocusenter = true;
      });
      this.$on('focusleave', () => {
        parentWindow.isBlockFocusenter = false;
      });
    },
    handleDestroyedWithParent(){
      const parentWindow = map[this.pid];
      parentWindow.unblock();
      parentWindow.isBlockFocusenter = false;
      parentWindow.focusenter();
    }
  },
  get(id){
    return map[id];
  },
  created(){
    // id = id + 1;
    // map[id] = this;
    // this.$options._id = id;
    if(this.pid){
      this.handleCreatedWithParent();
    }
  },
  mounted(){
    if(this.startIsMax){
      this.maxToggle();
    }
    this.focusenter();
    if(this.autoFocus){
      this.focusenter();
    }

  },
  destroyed(){
    if(this.pid){
      this.handleDestroyedWithParent();
    }
  }
}
</script>