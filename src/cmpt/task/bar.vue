
<template lang="jade">
.lr-task-bar
  Start
  QuickBar
  BarBody
  Watch
</template>

<script>
import Start from '../start/index.vue';
import QuickBar from '../quick-bar/index.vue';
import BarBody from './bar-body.vue';
import Watch from '../watch.vue';
export default {
  components: {
    Start,
    QuickBar,
    BarBody,
    Watch
  },

  computed:{
    tasks(){
      return this.$store.state.task.list;
    }
  },
  methods: {
    minAll(){
      this.$store.commit('task/minAll');
      this.$refs.ctx.hidden();
    },
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
