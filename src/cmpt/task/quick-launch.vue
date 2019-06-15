
<template lang="jade">
.lr-quick-item.lr-quick-launch(@mousedown="handleMousedown")
  .lr-quick-launch-info Shortcut Key: Ctrl + Win
</template>
<script>
export default {
  computed:{
    isQuickLaunch() {
      return this.$store.state.isQuickLaunch
    }
  },
  methods: {
    handleMousedown(){
      this.$store.commit('toggleQuickLaunch');
    }
  }
}
</script>
