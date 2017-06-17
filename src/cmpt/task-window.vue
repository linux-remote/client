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
    const $el = window.$(this.$el);
    const offset = $el.offset();
    const width = $el.width();
    const height = $el.height();
    if(offset.top + height >= this.winH){
      offset.top = 0;
    }
    if(offset.left + width >= this.winW){
      offset.left = 0;
    }
    store.commit('reportTaskPosition', offset);
  }
}
</script>
