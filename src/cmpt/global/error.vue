
<template lang="jade">
.lr-error(@mousedown='noopStop' v-if="message.length")
  .lr-error-title
    .lr-error-content
      .lr-icon(style="background-image: url(/public/img/dialog-error-7.png)")
      | 错误
    .lr-error-close(@click='close') ✖
  .lr-error-body(ref='body')
    .lr-error-item(v-for='v in message')
      pre {{v}}

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
      this.$store.commit('error/close');
    }
  }
}
</script>
