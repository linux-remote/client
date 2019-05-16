
<template lang="jade">
.lr-quick-launch(@mousedown="handleMousedown")
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
