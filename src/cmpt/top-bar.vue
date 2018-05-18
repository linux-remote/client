<template lang="jade">
.lr-top
  //- .lr-top-quick-item(@click='openHome') Home
  //- .lr-top-quick-item(@click='openFs')
  //-   .lr-top-small-icon(style='background-image:url(/public/file-tree.svg)')
  <watch/>
  <user/>
</template>

<script>
import Watch from '__ROOT__/cmpt/watch';
import User from '__ROOT__/cmpt/user';
import store from '__ROOT__/store-global';
import {logout} from '__ROOT__/lib/login';
export default {
  components:{
    Watch,
    User
  },
  data(){
    return {}
  },
  methods:{
    logout,
    openHome(){
      store.commit('addTask', {
        name: 'Home',
        type: 'fs'
      });
    },
    openFs(){
      store.commit('addTask', {
        name: 'File System',
        address: '/',
        type: 'fs'
      });
    }
  },
  computed:{
    username(){
      return store.state.username
    },
    title(){
      return store.state.crrrMaxTaskTitle ||  store.state.hostname
    }
  }
}
</script>
