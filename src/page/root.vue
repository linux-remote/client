<template lang="jade">
#lr-app.lr-h100
  #lr-main.lr-h100(@mousedown='handleMousedown')
    router-view
  Contextmenu
  FlyTextarea
  UploadInput
  UploadBox
  Error
</template>
<script>
import UploadInput from '__ROOT__/cmpt/global/upload/input.vue';
import UploadBox from '__ROOT__/cmpt/global/upload/box.vue';
import Contextmenu from '__ROOT__/cmpt/contextmenu.vue';
import FlyTextarea from '__ROOT__/cmpt/fly-textarea';
import Error from '__ROOT__/cmpt/global/error.vue';
export default {
  components:{
    Contextmenu,
    UploadInput,
    UploadBox,
    Error,
    FlyTextarea
  },
  data(){
    return {
      isRequest: false
    }
  },
  methods:{
    handleMousedown(){
      this.$store.commit('task/currentUnFocus');
    },
    getData(){
      this.request({
        url: '/touch',
        stateKey: 'isRequest',
        success(data){
          this.$store.commit('set', data);
        }
      });
    }
  },
  mounted(){
    window.APP.$elMain = document.getElementById('lr-main');
  },
  created(){
    this.getData();
  }
}
</script>
