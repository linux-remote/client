<template lang="jade">
.lr-fs-ctrl-bar
  .lr-fs-ctrl-bar-mask(v-if='disabled')
  button.lr-upload-btn(@click='handleUploadBtnClick') 上传文件
  .lr-icon.lr-fs-new-folder(@click='addItem("Directory")')
  .lr-icon.lr-fs-new-file(@click='addItem("RegularFile")')
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
    addItem(type){
      if(this.$parent.preCreateItem){
        return;
      }
      this.$parent.preCreateItem = {
       name: '',
       type,
       size: 10
      }
      this.$parent.itemFocus(this.$parent.preCreateItem)
    },
    handleUploadBtnClick(){
      this.$store.commit('upload/start', this.$parent.address);
    },
  }
}
</script>
