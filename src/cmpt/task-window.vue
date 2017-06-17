<template lang="jade">
.lr-task-window(@click.stop='handleClick',  :style='{zIndex: zIndex, top: positionTop + "px", left: positionLeft  + "px", margin: margin}')
  .lr-title(:class='titleClass')
    .lr-title-content {{name}} {{zIndex}} #index:{{index}} #id:{{id}}
    .lr-title-close(@click.stop='removeTask')
</template>

<script>
import store from '__ROOT__/store-global';
export default {
  props: ['index'],
  data(){
    return store.state.tasks[this.index];
  },
  methods:{
    removeTask(){
      store.commit('removeTask', {
        index: this.index,
        zIndex: this.zIndex
      });
    },
    handleClick(){
      store.commit('taskWindowFocus', this.$data);
    }
  },
  computed:{
    titleClass(){
      return this.focus ? 'lr-focus' : ''
    },
    winW(){
      return store.state.winW
    },
    winH(){
      return store.state.winH
    }
  },
  mounted(){
    const data = window.$(this.$el).offset();
    store.commit('reportTaskPosition', data);
  }
}
</script>
