
<template lang="jade">
.lr-show-desktop(@click="handleClick")
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
