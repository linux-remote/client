
<template lang="jade">
.lr-quick-item.lr-show-desktop(@click="handleClick" v-open-icon="'nuvola/user-desktop.png'")
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
