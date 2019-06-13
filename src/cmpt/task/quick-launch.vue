
<template lang="jade">
.lr-quick-item.lr-quick-launch(@mousedown="handleMousedown", title="Shortcut Key: Ctrl + Win")
</template>
<script>
export default {
  computed:{
    isQuickLaunch() {
      return this.$store.state.isQuickLaunch
    }
  },
  methods: {
    handleMousedown(e){
      this.$store.commit('toggleQuickLaunch');
    }
  }
}
</script>
