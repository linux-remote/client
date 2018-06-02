
<template lang="jade">
.lr-error(@mousedown='noopStop' v-if="message.length")
  .lr-error-title
    b 错误
    b(@click='close') ✖
  .lr-error-body(ref='body')
    .lr-error-item(v-for='v in message' v-html='v')

</template>

<script>
export default {
  computed: {
    message(){
      return this.$store.state.error.message
    }
  },
  watch: {
    message(){
      this.$nextTick(() => {
        if(this.$refs.body){
          this.$refs.body.scrollTop = 9999999;
        }
      })
    }
  },
  methods: {
    close(){
      this.$store.commit('error/show', 'haha' + Date.now());
    }
  }
}
</script>
