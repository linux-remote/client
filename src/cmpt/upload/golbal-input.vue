<template lang='jade'>
input(type='file' multiple="true" ref='uploadBtn' style="display:none" @change='handleChange')
</template>

<script>
export default {
  props: {
    onFileSelected: {
      type: Function
    }
  },
  methods: {
    handleChange(e){
      const files = e.target.files;
      const selectedFile = [];
      Object.keys(e.target.files).forEach(k => {
        selectedFile.push(files[k]);
      });
      this.$store.upload.addSelectedFile(selectedFile);
      
      if(this.onFileSelected){
        this.onFileSelected(selectedFile);
      }
      this.$refs.uploadBtn.value = '';
    }
  }
}
</script>
