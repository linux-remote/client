<template lang="jade">
.lr-confirm-wrap(tabindex="-1", :class="{lr_task_focus: isTaskFocus}", @focusin="handleFocusin", @focusout="handleFocusout", @submit.prevent="handleSubmit")
  .lr-confirm-mask(@mousedown="handleMaskMouseDown")
  .lr-window.lr-confirm(:style="{top: top}")
    .lr-title(:class="{lr_mask_clicked: isMaskClick}")
      .lr-title-content {{title}}
      .lr-btn_nf.lr-btn-close(@click="close") &#10006;
    .lr-window-body.lr-confirm-body
      .lr-block-icon(v-if="cIcon", :class="cIcon")
      | {{text}}
    .lr-confirm-footer(ref="footer")
      slot
</template>
<script>
export default { // 0.356 
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
    top: {
      default: 0
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
    return {
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
      console.log('base handleOkClick')
      this.close();
    }
  },
  mounted(){
    const footer = this.$refs.footer;
    console.log('base mounted')
    this.$options._focusBakBtn = footer.firstElementChild;
    this.$nextTick(() => {
      this.$el.focus();
    });
  },
  destroyed(){
    console.log('base destroyed')
  }
}
</script>