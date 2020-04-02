<template lang="jade">
.lr-window(:tabindex="tabindex",
  :class="{lr_window_maximized: isMax, lr_window_resizable: resizable}",
  :style="{top: top + 'px', left: left + 'px', width: width + 'px',   height: height + 'px', zIndex: zIndex}",
  v-show="!isMin")
  .lr-title(:class="{lr_title_shine: isShine}")
    .lr-title-content(:class='{lr_title_no_icon: !icon}')
      .lr-icon(v-open-icon="icon", v-if="icon")
      .lr-title_text {{title}}
      Movable(v-if="movable", v-show="!isMax", @moveStart="handleMoveStart", @moving="handleMoving", @moved="handleMoved")
    .lr-btn_nf(@click="hidden", v-if="minimizable")
      span.lr-icon_min
    .lr-btn_nf(@click="maxToggle", v-if="maximizable")
      span.lr-icon_unmax(v-if="isMax")
      span.lr-icon_max(v-else)
    .lr-btn_nf.lr-btn-close(@click="handleClose", v-if="close")
      span.lr-icon_close
  slot
  Resizable(v-if="resizable",
    v-show="!isMax", 
    :direction="resizeDirection",  
    @resizeStart="handleResizeStart",
    @resizing="handleResizing",
    @resized="handleResized")
  .lr-window_mask(v-if="isBlock", @mousedown="handleMaskMousedown")
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

const Window = {
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
    // ----------- get from $attrs: -----------
    // title: {
    //   type: String,
    //   default: ''
    // },
    // width: {
    //   type: Number,
    //   default: 0
    // },
    // height: {
    //   type: Number,
    //   default: 0
    // },
    // top: {
    //   type: Number,
    //   default: 0
    // },
    // left: {
    //   type: Number,
    //   default: 0
    // },
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
      title: this.$attrs.title,
      height: this.$attrs.height,
      width: this.$attrs.width,
      top: this.$attrs.top,
      left: this.$attrs.left,
      isMin: false,
      zIndex,
      isBlock: false,
      isBlockFocusenter: false,
      isShine: false
    }
  },
  methods: {
    handleMoveStart(virtual){
      virtual.top = this.top;
      virtual.left = this.left;
    },
    handleMoving(virtual){
      this.top = virtual.top;
      this.left = virtual.left;
    },
    handleMoved(virtual){
      if(virtual.top < 0){
        this.top = virtual.top = 0;
      }
      this.$emit('moved', virtual);
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
    handleResized(virtual){
      this.$emit('resized', virtual);
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
    handleClose(e){
      this.$emit('close', e);
      
      if(e.defaultPrevented){
        return;
      }
      this.close(e);
    },
    keepTop(){
      zIndex = zIndex + 1;
      this.zIndex = zIndex;
    },
    onFocusenter(){
      // Chrome overflow:hidden, focus bug
      // https://codepen.io/mediadivisiongmbh/pen/pJWmxp
      this.keepTop();
      const dom = this.$el.parentElement;
      if(dom.scrollTop !== 0){
        dom.scrollTop = 0;
      }
      if(dom.scrollLeft !== 0){
        dom.scrollLeft = 0;
      }
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
        this.left = bak.left;
        this.top = bak.top;
        this.width = bak.width;
        this.height = bak.height;
      } else {
        bak = this.$options._bakMaxPre = {
          top: this.top,
          left: this.left,
          width: this.width,
          height: this.height
        }
        this.isMax = true;
        this.top = 0;
        this.left = 0;
        this.width = this.$el.parentElement.clientWidth;
        this.height = this.$el.parentElement.clientHeight;
      }
      if(bak.width !== this.width || bak.height !== this.height){
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
    },

    // openBlock(){
    //   const dom = this.$el.parentElement;
    //   const NewWindow = window.Vue.extend(Window);
    //   // width: 300,
    //   //   height: 300,
    //   //   top: 0,
    //   //   left: 0,
    //   //   title: 'openBlock'
    //   NewWindow().$mount(dom)
    // }
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
    // if(this.autoFocus){
    //   this.$el.focus();
    // }

  },
  destroyed(){
    if(this.pid){
      this.handleDestroyedWithParent();
    }
  }
}

export default Window;
</script>