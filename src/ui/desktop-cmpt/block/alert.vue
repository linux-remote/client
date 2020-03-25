<template lang="jade">
BaseBlock(:close="close", :width="width", :height="height", v-bind="$attrs", :status="status", :class="'lr-alert lr-alert-' + status")
  Btn(@click="handleBtnClick") {{okText}}
</template>
<script>
import Btn from '../../cmpt/button/btn.vue';
import BaseBlock from './base.vue';
export default {
  components: {
    Btn,
    BaseBlock
  },
  props: {
    status: {
      type: String,
      default: 'error'
    },
    mode: {
      type: String,
      default: 'small'
    },
    okText: {
      type: String,
      default: 'OK'
    },
    close: {
      type: Function,
      required: true
    }
  },
  data(){
    let width, height;
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
    return {
      width,
      height
    }
  },
  methods: {
    handleBtnClick(){
      this.close();
    }
  }
}
</script>