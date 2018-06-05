<template lang='jade'>
input(type='file' multiple="true" ref='uploadBtn' id='lr-upload-input' style="display:none" @change='handleChange')
</template>

<script>
export default {
  methods: {
    handleChange(e){
      const files = e.target.files;
      const selectedFile = [];
      Object.keys(e.target.files).forEach(k => {
        selectedFile.push(files[k]);
      });
      this.$store.commit('upload/addSelectedFile', selectedFile);

      this.$refs.uploadBtn.value = '';
    }
  }
}
</script>
