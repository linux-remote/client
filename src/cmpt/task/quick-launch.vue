
<template lang="jade">
.lr-quick-item.lr-quick-launch(@mousedown="handleMousedown" v-open-icon="'oxygen/preferences-desktop-launch-feedback.png'")
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
