<template lang="jade">
#lr-app.lr-h100
  #lr-main.lr-h100
    router-view
  FlyTextarea
  UploadInput
  UploadBox
  Error
</template>
<script>
import UploadInput from '__ROOT__/cmpt/global/upload/input.vue';
import UploadBox from '__ROOT__/cmpt/global/upload/box.vue';
import FlyTextarea from '__ROOT__/cmpt/fly-textarea';
import Error from '__ROOT__/cmpt/global/error.vue';

export default {
  components:{
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
    getData(){
      this.request({
        url: '/touch',
        stateKey: 'isRequest',
        success(data){
          //console.log('data', data)
          //this.$store.commit('set', data);
        }
      });
    }
  },
  mounted(){
    window.APP.$elMain = document.getElementById('lr-main');
  },
  created(){
    const language = localStorage.language || navigator.language;
    this.$store.commit('language/set', language);
    this.getData();
  }
}
</script>
