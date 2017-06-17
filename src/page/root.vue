<template lang="jade">
#app.lr-app(@click.prevent='handleClick')
  .lr-page(v-if='CADownloadedCount === -1')
  .ca-download(v-else-if='CADownloadedCount === 0')
  router-view(v-else)
</template>
<script>
import store from '../store-global';

export default {
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
