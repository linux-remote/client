
<template lang="jade">
.lr-task-bar
  Start
  QuickBar
  .lr-task-bar-body
    .lr-task-bar-item(v-for='(i,index) in tasks', @mousedown='noopStop', @click.stop.prevent = 'handleClick(i)',
     :class='{lr_task_bar_item_focus: i.focus, lr_task_bar_item_close: i.isMin, lr_task_bar_item_max: i.isMax}')
      {{i.title}}
  //-.lr-2-control-wrap
    .lr-2-control(title='Minimize All',@mousedown='noopStop' @click.stop='taskMinAll') −
    .lr-2-control(title='Close All', @click='closeAll') X

</template>

<script>
import Start from './start/index.vue';
import QuickBar from './quick-bar/index.vue';
export default {
  components: {
    Start,
    QuickBar
  },

  computed:{
    tasks(){
      return this.$store.state.task.list;
    }
  },
  methods: {
    // taskMinAll(){
    //   this.$store.commit('task/minAll');
    // },
    // closeAll(){
    //   this.$store.commit('set', {tasks: []});
    // },
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
