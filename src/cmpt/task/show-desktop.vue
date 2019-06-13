
<template lang="jade">
.lr-quick-item.lr-show-desktop(@click="handleClick")
</template>
<script>
export default {
  methods: {
    handleClick(){
      this.$store.commit('task/toggleMinAll');
    }
  }
}
</script>
