<template lang="jade">
#lr-app(@dragover.prevent, @drop.prevent)
  #lr-main
    router-view
  .lr-global
    FlyTextarea
    UploadInput
    UploadBox
    Error
    OpenWith
</template>
<script>
import UploadInput from '__ROOT__/cmpt/global/upload/input.vue';
import UploadBox from '__ROOT__/cmpt/global/upload/box.vue';
import FlyTextarea from '__ROOT__/cmpt/global/fly-textarea.vue';
import Error from '__ROOT__/cmpt/global/toust/error.vue';
import OpenWith from '__ROOT__/cmpt/global/open-with.vue';
export default {
  components:{
    UploadInput,
    UploadBox,
    Error,
    FlyTextarea,
    OpenWith
  },
  data(){
    return {
      isRequest: false
    }
  },
  mounted(){
    window.APP.$elMain = document.getElementById('lr-main');
  },
  created(){
    const language = localStorage.language || navigator.language;
    this.$store.commit('language/set', language);
  }
}
</script>
