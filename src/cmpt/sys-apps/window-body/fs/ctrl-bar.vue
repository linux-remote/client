<template lang="jade">
.lr-fs-ctrl-bar
  .lr-fs-ctrl-bar-mask(v-if='disabled')
  button.lr-upload-btn(@click='handleUploadBtnClick') 上传文件
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleUploadBtnClick(){
      this.$store.commit('upload/start', this.address);
    },
  }
}
</script>
