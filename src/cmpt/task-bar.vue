
<template lang="jade">
.lr-task-bar
  Start
  QuickBar
  .lr-task-bar-body
    .lr-task-bar-item(v-for='(i,index) in tasks', @mousedown='noopStop', @click.stop.prevent = 'handleClick(i)',
    @contextmenu.prevent.stop = 'contextmenu(i, index, $event)',
     :class='{lr_task_bar_item_focus: i.focus, lr_task_bar_item_close: i.isMin, lr_task_bar_item_max: i.isMax}')
      {{i.name}}
  .lr-2-control-wrap
    .lr-2-control(title='Minimize All',@mousedown='noopStop' @click.stop='taskMinAll') −
    .lr-2-control(title='Close All', @click='closeAll') X

</template>

<script>
import contextmenuStore from '__ROOT__/store/contextmenu';
import Start from './start.vue';
import QuickBar from './quick-bar/index.vue';
export default {
  components: {
    Start,
    QuickBar
  },
  data(){
    return {
      nowDate: null
    }
  },
  methods: {

    taskMinAll(){
      this.$store.commit('taskMinAll');
    },
    closeAll(){
      this.$store.commit('set', {tasks: []});
    },
    contextmenu(task, index, e){
      contextmenuStore.commit('open', {
        data: [
          // {
          //   name: 'Copy',
          //   handleClick(){
          //     this.$store.commit('copyTask', task);
          //   }
          // },
          {
            name: 'Close',
            handleClick(){
              this.$store.commit('removeTask', index);
            }
          }
        ],
        top: e.clientY - 32,
        left: e.clientX
      });
    },
    handleClick(task){
      if(task.isMin){
        this.$store.commit('showTask', task);
      }else if(task.focus){
        this.$store.commit('hiddenTask', task);
      }else{
        this.$store.commit('taskWindowFocus', task);
      }

    }
  },
  computed:{
    tasks(){
      return this.$store.state.tasks;
    }
  },
  created(){
  }
}
</script>
