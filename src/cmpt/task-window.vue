<template lang="jade">
.lr-task-window(@click.stop='handleClick',  :style='{zIndex: zIndex, top: offsetTop + "px", left: offsetLeft  + "px", margin: margin}')
  .lr-title(:class='titleClass')
    .lr-title-content {{name}} {{zIndex}} #index:{{index}} #id:{{id}}
    .lr-title-close(@click.stop='removeTask')
</template>

<script>
import store from '__ROOT__/store-global';
export default {
  props: ['index', 'testF'],
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
      return this.testF ? 'lr-focus' : ''
    }
  },
  mounted(){
    //console.log('this.$el', window.$(this.$el).offset())
    const data = window.$(this.$el).offset();
    //console.log(this.$data);
    //data.currTask = this.$data;
    store.commit('reportTaskPosition', data);
    // store.commit('taskWindowFocus', this.$data);
    //this.handleClick();
  }
}
</script>
