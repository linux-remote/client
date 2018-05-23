<template lang="jade">
#lr-app.lr-h100
  #lr-main.lr-h100(@mousedown='handleMousedown')
    router-view
  contextmenu
  fly-textarea
  UploadInput
  error
</template>
<script>
import UploadInput from '__ROOT__/cmpt/upload/golbal-input.vue';
import Contextmenu from '__ROOT__/cmpt/contextmenu';
import flyTextarea from '__ROOT__/cmpt/fly-textarea';
import Error from '__ROOT__/cmpt/error';
export default {
  components:{
    Contextmenu,
    UploadInput,
    Error,
    flyTextarea
  },
  data(){
    return {
      isRequest: false
    }
  },
  methods:{
    handleMousedown(){
      this.$store.commit('currTaskWindowUnFocus');
    },
    getData(){
      this.apiGet('/touch', data => {
        this.$store.commit('set', data);
      })
    }
  },
  mounted(){
    window.APP.$elMain = document.getElementById('lr-main');
  },
  created(){
    window.APP.$router = this.$router;
    this.getData();
  }
}
</script>
