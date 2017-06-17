<template lang="jade">
.lr-task-bar
  .lr-task-item(v-for='i in tasks', @click.stop= 'handleClick(i)', :class='{lr_focus: i.focus}')
    {{i.name}} {{i.focus}}
</template>

<script>
import store from '__ROOT__/store-global';
export default {
  data(){
    return {
      nowDate: null
    }
  },
  methods: {
    handleClick(task){
      store.commit('taskWindowFocus', task);
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
