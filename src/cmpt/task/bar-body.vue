
<template lang="jade">
.lr-task-bar-body
  ContextMenu(ref='ctx')
    .lr-ctx-item(@click='minAll') 显示桌面
    .lr-ctx-item(@click='closeAll') 全部关闭
  Item(v-for='(item, index) in tasks', 
      :key='item.id',
      :index='index',
      :item='item')
  //-.lr-task-bar-place
</template>

<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
import Item from './bar-item.vue';
export default {
  components: {
    ContextMenu,
    Item
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
