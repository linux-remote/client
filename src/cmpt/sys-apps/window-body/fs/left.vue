
<template lang="jade">
.lr-fs-left
  .lr-fs-bookmark(@click='go("")')  此电脑
  .lr-fs-bookmark(@click='go("/")')   /
  .lr-fs-bookmark(@click='go(homedir)') Home
  hr
  .lr-fs-bookmark  /
</template>

<script>
export default {
  computed: {
    go(){
      return this.$parent.$refs.navBar.go
    },
    homedir(){
      return this.$store.state.homedir
    }
  },
  methods: {
  },
  created(){

  }
}
</script>
