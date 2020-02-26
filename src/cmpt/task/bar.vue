
<template lang="jade">
.lr-task-bar
  Start
  ShowDesktop
  BarBody
  Watch
</template>

<script>
import Start from '../start/start.vue';
import BarBody from './bar-body.vue';
import Watch from '../watch/watch.vue';
import ShowDesktop from './show-desktop.vue';
export default {
  components: {
    Start,
    BarBody,
    Watch,
    ShowDesktop
  },

  computed:{
    tasks(){
      return this.$store.state.task.list;
    }
  },
  methods: {
    closeAll(){
      this.$store.commit('task/closeAll');
      this.$refs.ctx.hidden();
    },
    handleClick(task){
      if(task.isMin){
        this.$store.commit('task/show', task);
      }else if(task.isFocus){
        this.$store.commit('task/hidden', task);
      }else{
        this.$store.commit('task/focus', task);
      }
    }
  }
}
</script>
