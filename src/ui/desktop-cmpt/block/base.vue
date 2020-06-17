<template lang="jade">
Window(:title="title || type",
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
      Btn(@click="handleOkBtnClick", v-if="type==='alert'", ref="ok") {{okText}}
      template(v-else-if="type === 'confirm'")
        Btn(@click="handleConfirmOkBtnClick", ref="ok") {{okText}}
        Btn(@click="close", ref="cancel") {{cancelText}}
      template(v-else-if="type === 'triple'")
        Btn(@click="handleYesBtnClick", ref="yes") {{yesText}}
        Btn(@click="handleNoBtnClick", ref="no") {{noText}}
        Btn(@click="close", ref="cancel") {{cancelText}}
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
      default: 'warn'
    },
    title: {
      type: String,
      default(){
        let type = this.type;
        let first = type[0];
        first = first.toUpperCase();
        return first + type.substr(1);
      }
    },
    text: {
      type: String,
      required: true
    },
    okText: {
      type: String,
      default: 'OK',
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
    okFn: Function,
    yesFn: Function,
    noFn: Function,
    primary: String,
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
    if(pWindow){
      const top = pWindow.top + ((pWindow.height - height) / 2);
      const left = pWindow.left + ((pWindow.width - width) / 2);
        return {
          w: width,
          h: height,
          top,
          left,
          cls
        }
    } else {
      const dom = document.documentElement;
      const top = (dom.clientHeight - height) / 2;
      const left = (dom.clientWidth - width) / 2;
      return {
          w: width,
          h: height,
          top,
          left,
          cls
      }
    }

    },
    handleOkBtnClick(){
      this.close();
    },
    handleConfirmOkBtnClick(){
      this.okFn();
      this.close();
    },
    handleYesBtnClick(){
      this.yesFn();
      this.close();
    },
    handleNoBtnClick(){
      this.noFn();
      this.close();
    }
  },
  mounted(){
    if(this.primary){
      this.$refs.window.setEnterBindBtn(this.$refs[this.primary]);
    } else {
      const footer = this.$refs.footer;
      this.$refs.window.setEnterBindBtn(footer.firstElementChild);
    }
    
  }
}
</script>