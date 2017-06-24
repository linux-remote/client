<template lang="jade">
.lr-task-bar(@mousedown.stop='noop')
  .lr-2-body
    .lr-task-item(v-for='i in tasks', @click.stop.prevent = 'handleClick(i)',
    @contextmenu.prevent.stop = 'contextmenu(i, $event)',
     :class='{lr_focus: i.focus, lr_close: i.isMin}')
      {{i.name}}
  .lr-2-control(title='Close All', @click='closeAll') X
</template>

<script>
import store from '__ROOT__/store-global';
import contextmenuStore from '__ROOT__/store/contextmenu';
export default {
  data(){
    return {
      nowDate: null
    }
  },
  methods: {
    noop(){

    },
    closeAll(){
      store.commit('set', {tasks: []});
    },
    contextmenu(task, e){
      contextmenuStore.commit('open', {
        data: [
          {
            name: 'Close',
            handleClick(){
              store.commit('removeTask', task);
            }
          }
        ],
        top: e.clientY - 32,
        left: e.clientX
      });
    },
    handleClick(task){
      console.log('task', task.focus)
      if(task.isMin){
        store.commit('showTask', task);
      }else if(task.focus){
        console.log('hiddenTask')
        store.commit('hiddenTask', task);
      }else{
        store.commit('taskWindowFocus', task);
      }

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
