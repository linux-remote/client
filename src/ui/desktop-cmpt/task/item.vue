<template lang="jade">
.lr-task-item
  LRIcon(v-bind="$attrs")
  slot
</template>
<script>
import LRIcon from '../../cmpt/icon/icon.vue';
export default {
  components: {
    LRIcon
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
    }
  },
  methods: {
  }
}
</script>