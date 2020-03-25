<template lang="jade">
Window(:title="title",
        :movable="true",
        :enterBindBtn="true",
        :width="width",
        :height="height",
        :top="top",
        :left="left",
        :pid="pid",
        :autoFocus="true",
        :close="close",
        ref="window")
  .lr-confirm-body
    .lr-block-icon(v-if="cIcon", :class="cIcon")
    | {{text}}
  .lr-confirm-footer(ref="footer")
    slot
//- .lr-confirm-wrap(:class="{lr_task_focus: isTaskFocus}", 
//-                   @focusin="handleFocusin",
//-                   @focusout="handleFocusout",
//-                    @submit.prevent="handleSubmit",
//-                    tabIndex="-1")
//-   .lr-window.lr-confirm(:style="{width: width + 'px', height: height + 'px', top: top + 'px', left: left + 'px'}")
//-     .lr-title(:class="{lr_title_shine: isMaskClick}")
//-       .lr-title-content
//-         Movable(@moveStart="handleMoveStart", @moving="handleMoving")
//-         | {{title}}
//-       .lr-btn_nf.lr-btn-close(@click="close")
//-         span.lr-icon_close
//-     .lr-window-body.lr-confirm-body
//-       .lr-block-icon(v-if="cIcon", :class="cIcon")
//-       | {{text}}
//-     .lr-confirm-footer(ref="footer")
//-       slot
</template>
<script>
import Movable from '../../unit/movable.vue';
import Window from '../window/window.vue';
export default { // 0.356 
  components: {
    Movable,
    Window
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
    pid: {
      type: Number
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
    const pWindow = Window.get(this.pid);
    const top = pWindow.y + ((pWindow.height - this.height) / 2);
    const left = pWindow.x + ((pWindow.width - this.width) / 2);
    return {
      top,
      left
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
    focusenter(){
      this.$refs.window.focusenter();
    },
    handleOkClick(){
      this.$emit('ok');
      this.close();
    }
  },
  mounted(){
    const footer = this.$refs.footer;
    this.$refs.window.setEnterBindBtn(footer.firstElementChild);
  }
}
</script>