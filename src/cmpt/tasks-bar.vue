<template lang="jade">
.lr-task-bar
  .lr-2-body
    .lr-task-item(v-for='(i,index) in tasks', @mousedown='noopStop', @click.stop.prevent = 'handleClick(i)',
    @contextmenu.prevent.stop = 'contextmenu(i, index, $event)',
     :class='{lr_focus: i.focus, lr_close: i.isMin, lr_2_max: i.isMax}')
      {{i.name}}
  .lr-2-control-wrap
    .lr-2-control(title='Minimize All',@mousedown='noopStop' @click.stop='minAll') −
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
    minAll(){
      store.commit('minAll');
    },
    closeAll(){
      store.commit('set', {tasks: []});
    },
    contextmenu(task, index, e){
      contextmenuStore.commit('open', {
        data: [
          // {
          //   name: 'Copy',
          //   handleClick(){
          //     store.commit('copyTask', task);
          //   }
          // },
          {
            name: 'Close',
            handleClick(){
              store.commit('removeTask', index);
            }
          }
        ],
        top: e.clientY - 32,
        left: e.clientX
      });
    },
    handleClick(task){
      if(task.isMin){
        store.commit('showTask', task);
      }else if(task.focus){
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
