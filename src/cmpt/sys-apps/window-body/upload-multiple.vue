<template lang="jade">
button.lr-upload-btn(@click='open')
  slot
  input(type='file', multiple, v-if='currCount === changeCount', ref='input', style="display:none",  @change='handleChange', :webkitdirectory='isFolder')
</template>

<script>
export default {
  props: {
    isFolder: {
      type: Boolean,
      default: false
    },
    getFd: {
      type: Function,
      required: true
    }
  },
  data(){
    return {
      currCount: 0,
      changeCount: 0
    }
  },
  methods: {
    open(){
      this.$refs.input.click();
    },
    handleChange(e){
      const files = e.target.files;
      // if(!files.length){ //cancel
      //   console.log('upload select chancel');
      //   return;
      // }
      var fd = new FormData();
      for (var i = 0; i < files.length; i++) {
        fd.append("file", files[i]);
      }
      this.getFd(fd);
      this.changeCount ++;
      setTimeout(() => {
        this.currCount ++;
      })
    }
  }
}
</script>
