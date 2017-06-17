<template lang="jade">
.lr-task-bar
  .lr-task-item(v-for='i in tasks')
    {{i.name}}
</template>

<script>
import store from '__ROOT__/store-global';
export default {
  data(){
    return {
      nowDate: null
    }
  },
  computed:{
    tasks(){
      return store.state.tasks;
    }
  },
  created(){
  }
}
</script>
