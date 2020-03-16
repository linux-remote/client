<template lang="jade">
.lr-window(:style="{top: top + 'px', left: left + 'px', width: width + 'px',   height: height + 'px', zIndex: zIndex}",
                    :tabindex="tabindex",
                    :enterBindBtn="enterBindBtn",
                    :class="{lr_window_resizable: resizable, lr_window_maximized: isMax}",
                    v-show="!isMin")
  .lr-title
    .lr-title-content
      LRIcon(:type="iconType", :value="icon")
      Movable(v-if="movable", v-show="!isMax", @moveStart="handleMoveStart", @moving="handleMoving")
      span {{title}} {{id}} {{typeof isFocusEnter}}
    .lr-btn_nf(@click="handleMinClick", v-if="minimizable")
      span.lr-icon_min
    .lr-btn_nf(@click="maxToggle", v-if="maximizable")
      span.lr-icon_unmax(v-if="isMax")
      span.lr-icon_max(v-else)
    .lr-btn_nf.lr-btn-close(@click="close")
      span.lr-icon_close
  .lr-window-body
    h1 hello
    slot
  Resizable(v-if="resizable",
    v-show="!isMax", 
    :direction="resizeDirection",  
    @resizeStart="handleResizeStart",
    @resizing="handleResizing",
    @resized="handleResized")
  .lr-mask(@mousedown.prevent="handleMaskMousedown", v-if="childId")
</template>
<script>
import map from './map.js';
let zIndex = 3;
import LRIcon from '../../cmpt/icon/icon.vue';
import Resizable from '../../unit/resizable.vue';
import Movable from '../../unit/movable.vue';
import MixinFocusable from '__ROOT__/lib/mixins/focusable.js';
export default {
  mixins: [MixinFocusable],
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
    title: {
      type: String,
      default: ''
    },
    minimizable: {
      type: Boolean,
      default: true
    },
    maximizable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    movable: {
      type: Boolean,
      default: true
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
    id: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    parentId: {
      type: Number,
      default: null
    }
  },

  data(){
    return {
      isMax: this.startIsMax,
      height: this.startHeight,
      width: this.startWidth,
      top: this.startTop,
      left: this.startLeft,
      zIndex,
      alertData: null,
      isMin: false,
      childId: null,
      isBlock: false
    }
  },
  methods: {
    show(){
      this.isMin = false;
      this.$nextTick(() => {
        this.focus();
      });
    },
    hidden(){
      this.blur();
      this.isMin = true;
    },
    focus(){
      this.$el.focus();
    },
    blur(){
      this.$el.blur();
    },
    keepTop(){
      zIndex = zIndex + 1;
      this.zIndex = zIndex;
    },
    onFocusenter(){
      map.latestFocusEnter = this;
      this.keepTop();
      if(this.childId){
        map[this.childId].fcous();
      }
    },
    onFocusleave(){
      if(this.parentId){
        map[this.parentId].focus();
      }
    },

    close(){
      this.$store.commit('task/remove', this.id);
    },

    handleMaskMousedown(){
      map[this.childId].shine();
    },
    shine(){
      if(this.childId){
        return;
      }
      if(!this.isFocusEnter){
        this.focus();
        return;
      }
      if(this.isMaskClick){
        this.isMaskClick = false;
          if(this.$options._t){
            clearTimeout(this.$options._t);
          }
          this.$options._t = setTimeout(() => {
            this.isMaskClick = true;
          }, 100);
      } else {
          this.isMaskClick = true;
      }
    },
    handleMaskMouseDown(){
      map[this.childId].shine();
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
    handleResized(){
      this.$emit('resized');
      this.$store.commit('task/onWindowResized', this.index);
    },
    maxToggle(){
      if(this.isMax){
        this.isMax = false;
        const bak = this.$options._bakMaxPre;
        this.left = bak.left;
        this.top = bak.top;
        this.width = bak.width;
        this.height = bak.height;
      } else {
        this.$options._bakMaxPre = {
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
    },
    handleMinClick(){
      this.isMin = !this.isMin;
    }
  },
  created(){
    map[this.id] = this;
    this.$store.commit('task/onWindowCreate', this);
  },
  mounted(){
    if(this.startIsMax){
      this.maxToggle();
    }
    this.$nextTick(() => {
      this.focus();
    })
  },
  destroyed(){
    if(map.latestFocusEnter === this){
      map.latestFocusEnter = null;
    }
    delete(map[this.id]);
  }
}
</script>