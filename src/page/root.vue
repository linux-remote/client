<template lang="jade">
#lr-app.lr-h100
  #lr-main.lr-h100(@mousedown='handleMousedown')
    router-view
  contextmenu
  fly-textarea
  error
</template>
<script>
import store from '../store-global';
import Contextmenu from '__ROOT__/cmpt/contextmenu';
import flyTextarea from '__ROOT__/cmpt/fly-textarea';
import Error from '__ROOT__/cmpt/error';
export default {
  components:{
    Contextmenu,
    Error,
    flyTextarea
  },
  data(){
    return {
      isRequest: false
    }
  },
  computed: {
    isSHowCaDownPage(){
      return store.state.isSelfSigned && store.state.CADownloadedCount === 0
    }
    // ,
    // CADownloadedCount(){
    //   return store.state.CADownloadedCount
    // }
  },
  methods:{
    handleMousedown(){
      store.commit('currTaskWindowUnFocus');
    },
    getData(){
      this.apiGet('/touch', data => {
        store.commit('set', data);
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
