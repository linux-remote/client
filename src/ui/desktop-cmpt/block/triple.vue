<template lang="jade">
BaseBlock(:close="close", class="lr-block-triple", status="warn", v-bind="$attrs")
  Btn(@click="handleYesClick") {{yesText}}
  Btn(@click="handleNoClick") {{noText}}
  Btn(@click="close") {{cancelText}}
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
    yesText: {
      type: String,
      default: 'Yes'
    },
    noText: {
      type: String,
      default: 'No'
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
    handleYesClick(){
      this.$emit('yes');
      this.close();
    },
    handleNoClick(){
      this.$emit('no');
      this.close();
    }
  }
}
</script>