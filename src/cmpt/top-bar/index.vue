<template lang="jade">
.lr-top
  //- .lr-top-quick-item(@click='openHome') Home
  //- .lr-top-quick-item(@click='openFs')
    .lr-top-small-icon(style='background-image:url(/public/file-tree.svg)')
  <Watch/>
  <User/>
</template>

<script>
import Watch from './watch.vue';
import User from './user.vue';

export default {
  components:{
    Watch,
    User
  },
  data(){
    return {
      
    }
  },
  methods:{
    openHome(){
      this.$store.commit('addTask', {
        name: 'Home',
        type: 'fs'
      });
    },
    openFs(){
      this.$store.commit('addTask', {
        name: 'File System',
        address: '/',
        type: 'fs'
      });
    }
  },
  computed:{
    username(){
      return this.$store.state.username
    },
    title(){
      return this.$store.state.crrrMaxTaskTitle ||  this.$store.state.hostname
    }
  }
}
</script>
