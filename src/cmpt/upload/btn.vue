<template lang='jade'>
button(style="position:relative", @click="handleClick") 上传
  input(type='file' multiple="true" ref='uploadBtn' style="display: none" @change='handleChange')
</template>

<script>
export default {
  props: {
    onFileSelected: {
      type: Function,
      required: true
    }
  },
  data(){
    return {
      fileInputLive: true
    }
  },
  methods: {
    handleClick(){
      this.$refs.uploadBtn.click();
    },
    handleChange(e){
      const files = e.target.files;
      const selectedFile = [];
      Object.keys(e.target.files).forEach(k => {
        _selectedFile.push(files[k]);
      });
      this.onFileSelected(selectedFile);
      this.$refs.uploadBtn.value = '';
    }
  }
}
</script>
