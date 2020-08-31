<template lang="jade">
pre
  span(v-for="line in list") {{line}}
</template>
<script>
export default {
  computed: {
    list(){
      return this.$store.state.ptyList;
    }
  },
  watch: {
    list(){
      this.scrollTop();
    }
  },
  methods: {
    scrollTop(){
      this.$nextTick(() => {
        this.$el.scrollTop = 9999999;
      })
    }
  },
  mounted(){
    this.scrollTop();
  }
}
</script>