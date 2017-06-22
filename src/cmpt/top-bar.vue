<template lang="jade">
.lr-top
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
    logout
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
