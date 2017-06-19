<template lang="jade">
#app.lr-app(@click.prevent='handleClick')
  .lr-page(v-if='CADownloadedCount === -1')
  .ca-download(v-else-if='CADownloadedCount === 0')
  router-view(v-else)
  <contextmenu />
</template>
<script>
import store from '../store-global';
import contextmenuStore from '../store/contextmenu';
import Contextmenu from '__ROOT__/cmpt/contextmenu';
export default {
  components:{
    Contextmenu
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
    handleClick(){
      store.commit('eventDocumentClick');
      contextmenuStore.commit('close');
    },
    getData(){
      this.apiGet('/touch', data => {
        store.commit('set', data);
      })
    }
  },
  created(){
    this.getData();
  }
}
</script>
