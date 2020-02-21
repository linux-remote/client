<template lang="jade">
.lr-confirm-wrap(:class="{lr_task_focus: isTaskFocus}", @focusin="handleFocusin", @focusout="handleFocusout", @submit.prevent="handleSubmit", tabIndex="-1")
  .lr-confirm-mask(@mousedown="handleMaskMouseDown")

  .lr-window_main.lr-confirm(:style="{width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px'}")
    .lr-title(:class="{lr_mask_clicked: isMaskClick}")
      .lr-title-content
        Movable(@moveStart="handleMoveStart", @moving="handleMoving")
        | {{title}}
      .lr-btn_nf.lr-btn-close(@click="close")
        span.lr-icon_close
    .lr-window-body.lr-confirm-body
      .lr-block-icon(v-if="cIcon", :class="cIcon")
      | {{text}}
    .lr-confirm-footer(ref="footer")
      slot
</template>
<script>
import Movable from '../../unit/movable.vue';
export default { // 0.356 
  components: {
    Movable
  },
  props: {
    status: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      required: true
    },
    pWidth: {
      type: Number,
      default: 0
    },
    pHeight: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 419
    },
    height: {
      type: Number,
      default: 133
    },
    icon: {
      type: String,
      default: ''
    },
    close: {
      type: Function,
      required: true
    }
  },
  data(){
    const top = (this.pHeight - this.height) / 2;
    const left = (this.pWidth - this.width) / 2;
    return {
      top,
      left,
      isMaskClick: false,
      isTaskFocus: true
    }
  },
  
  computed: {
    cIcon(){
      if(this.icon){
        return this.icon;
      }
      if(!this.status){
        return '';
      }
      let cls = 'lr-alert-icon-' + this.status;
      return this.status === 'warn' ? 'iconfont icon-ps_fillet_triangle ' + cls : cls;
    }
  },
  methods: {
    // bakFocusBtn(e){
    //   this.$options._focusBakBtn = e.currentTarget;
    // },
    handleMoveStart(virtual){
      virtual.top = this.top;
      virtual.left = this.left;
    },
    handleMoving(virtual){
      this.top = virtual.top;
      this.left = virtual.left;
    },
    handleFocusin(e){
      if(!this.isTaskFocus){
        this.isTaskFocus = true;
      }
      if(e.target.tagName === 'BUTTON'){
        
        this.$options._focusBakBtn = e.target;
      } else {
        // body 其它不可 focus.
        this.$options._focusBakBtn.focus();
      }
    },
    handleFocusout(e){
      if(!e.relatedTarget || !this.$el.contains(e.relatedTarget)){
        this.isTaskFocus = false;
      }
    },
    handleSubmit(){
      this.$options._focusBakBtn.click();
    },
    handleMaskMouseDown(){
      if(!this.isTaskFocus){
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
    handleOkClick(){
      this.$emit('ok');
      this.close();
    }
  },
  mounted(){
    const footer = this.$refs.footer;
    this.$options._focusBakBtn = footer.firstElementChild;
    this.$nextTick(() => {
      this.$el.focus();
    });
  }
}
</script>