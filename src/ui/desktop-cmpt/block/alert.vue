<template lang="jade">
BaseBlock(:close="close", v-bind="$attrs", :status="status", :class="'lr-alert lr-alert-' + status")
  Btn(@click="close") {{okText}}
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
    okText: {
      type: String,
      default: 'OK'
    },
    close: {
      type: Function,
      required: true
    }
  },
  // computed: {
  //   icon(){
  //     let cls = 'lr-alert-icon-' + this.status;
  //     return this.status === 'warn' ? 'iconfont icon-ps_fillet_triangle ' + cls : cls;
  //   }
  // }
}
</script>