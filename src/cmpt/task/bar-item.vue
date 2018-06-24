
<template lang="jade">
.lr-task-bar-item(@click = 'handleClick',
                  :class='{lr_task_bar_item_focus: item.isFocus, lr_task_bar_item_close: item.isMin, lr_task_bar_item_max: item.isMax}') {{item.title}}
  ContextMenu
    .lr-ctx-item(@click='close') 关闭
</template>

<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
export default {
  props: ['item', 'index'],
  components: {
    ContextMenu
  },
  methods: {
    close(){
      this.$store.commit('task/remove', this.index);
    },
    handleClick(){
      const task = this.item;
      console.log('task', task.isFocus)
      if(task.isMin){
        this.$store.commit('task/show', task);
      }else if(task.isFocus){
        console.log('hidden')
        this.$store.commit('task/hidden', task);
      }else{
        this.$store.commit('task/focus', task);
      }
    }
  }
}
</script>
