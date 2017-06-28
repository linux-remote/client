<template lang="jade">
#app.lr-h100
  #main.lr-h100(@mousedown='handleMousedown')
    .lr-page(v-if='CADownloadedCount === -1')
    .ca-download(v-else-if='CADownloadedCount === 0')
    router-view(v-else)
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
    CADownloadedCount(){
      return store.state.CADownloadedCount
    }
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
    window.APP.$elMain = document.getElementById('main');
  },
  created(){
    window.APP.$router = this.$router;
    this.getData();
  }
}
</script>
