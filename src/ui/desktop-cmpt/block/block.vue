<template lang="jade">
Window(:title="title",
        :movable="true",
        :enterBindBtn="true",
        :width="w",
        :height="h",
        :top="top",
        :left="left",
        :pid="pid",
        :autoFocus="true",
        :close="close",
        :class="cls",
        ref="window")
  
  .lr-window_body
    .lr-confirm-body
      .lr-block-icon(v-if="cIcon", :class="cIcon")
      | {{text}}
    .lr-confirm-footer(ref="footer")
      Btn(@click="handleOkBtnClick", v-if="type==='alert'") {{okText}}
      template(v-else-if="type === 'confirm'")
        Btn(@click="handleOkBtnClick") {{okText}}
        Btn(@click="close") {{cancelText}}
      template(v-else-if="type === 'triple'")
        Btn(@click="handleYesBtnClick") {{yesText}}
        Btn(@click="handleNoClick") {{noText}}
        Btn(@click="close") {{cancelText}}

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
//-     .lr-window_body.lr-confirm-body
//-       .lr-block-icon(v-if="cIcon", :class="cIcon")
//-       | {{text}}
//-     .lr-confirm-footer(ref="footer")
//-       slot
</template>
<script>
import Btn from '../../cmpt/button/btn.vue';
import Window from '../window/window.vue';

export default { // 0.356 
  components: {
    Window,
    Btn
  },
  props: {
    type: {
      type: String,
      default: 'alert'
    },
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
    okText: {
      type: String,
      default: 'Yes',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    yesText: {
      type: String,
      default: 'Yes'
    },
    noText: {
      type: String,
      default: 'No'
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
    return this.init();
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
        init(){
      let width = this.width, height = this.height, cls = '';
      if(this.type === 'alert'){
        cls = 'lr-alert lr-alert-' + this.status;
        if(this.status === 'error'){
          width = 495;
          height = 119;
        } else if(this.status === 'warn'){
          width = 365;
          height = 126;
          if(this.mode === 'wide'){
            width = 494;
          }
        }
      } else if(this.type === 'triple'){
        width = 479;
        height = 139;
        cls = 'lr-block-triple';
      }
    const pWindow = Window.get(this.pid);
    const top = pWindow.y + ((pWindow.height - height) / 2);
    const left = pWindow.x + ((pWindow.width - width) / 2);
      return {
        w: width,
        h: height,
        top,
        left,
        cls
      }
    },
    handleOkBtnClick(){
      this.$emit('ok');
      this.close();
    },
    handleYesClick(){
      this.$emit('yes');
      this.close();
    },
    handleNoClick(){
      this.$emit('no');
      this.close();
    }
  },
  mounted(){
    const footer = this.$refs.footer;
    this.$refs.window.setEnterBindBtn(footer.firstElementChild);
  }
}
</script>