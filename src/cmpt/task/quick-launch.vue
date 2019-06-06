
<template lang="jade">
.lr-quick-launch(@mousedown="handleMousedown", title="Shortcut Key: Ctrl + Win")
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
      if(e._capture_by_doc){
        return;
      }
      this.$store.commit('toggleQuickLaunch');
    }
  }
}
</script>
