<template lang="jade">
BaseBlock(:close="close", v-bind="$attrs")
  Btn(@click="handleOkClick") {{okText}}
  Btn(@click="close") {{cancelText}}
</template>
<script>
import Btn from '../../cmpt/button/btn.vue';
import BaseBlock from './base.vue';
export default {
  components: {
    BaseBlock,
    Btn
  },
  props: {
    okText: {
      type: String,
      default: 'Yes',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    close: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleOkClick(){
      this.$emit('ok');
      this.close();
    }
  }
}
</script>