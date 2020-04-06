<template lang="jade">
#lr-root.lr-root(@dragover.prevent, @drop.prevent)
  .lr-desktop-wrap
    router-view
  .lr-global#lr-global
    //- FlyTextarea
    //- UploadInput
    //- UploadBox
    //- Error
    //- OpenWith
    //- Confirm
</template>
<script>
// import UploadInput from '__ROOT__/cmpt/global/upload/input.vue';
// import UploadBox from '__ROOT__/cmpt/global/upload/box.vue';
// import FlyTextarea from '__ROOT__/cmpt/global/fly-textarea.vue';
// import Confirm from '__ROOT__/cmpt/global/confirm.vue';
import Error from './cmpt/global/toust/error.vue';

export default {
  components:{
    Error,
    // UploadInput,
    // UploadBox,
    
    // FlyTextarea,
    // OpenWith,
    // Confirm
  },
  data(){
    return {
      isRequest: false
    }
  },
  // mounted(){
  // },
  created(){
    const language = localStorage.language || navigator.language;
    this.$store.commit('language/set', language);
  }
}
</script>
