<template lang="jade">
button.lr-task-item(
              @mousedown="handleMousedown",
              @click='handleClick',
              :class='{lr__focus: isTaskFocus}')
  //- LRIcon(v-bind="$attrs")
  .lr-icon(v-if="item.app.iconUrl", v-open-icon="item.app.iconUrl")
  .lr-icon(v-else :class="item.app.iconClassName")
  | {{item.window.title}}
</template>
<script>
// import LRIcon from '../../cmpt/icon/icon.vue';
export default {
  // components: {
  //   LRIcon
  // },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data(){
    return {
    }
  },
  computed: {
    isTaskFocus(){
      const taskWindow = this.item.window;
      return taskWindow.isFocusenter || taskWindow.isBlockFocusenter;
    }
  },
  methods: {
    close(){
      this.$store.commit('task/remove', this.item.id);
    },
    handleMousedown(){
      this.$options._isFocusenter = this.item.window.isFocusenter;
    },
    handleClick(){
      const taskWindow = this.item.window;
      if(taskWindow.isMin){
        taskWindow.show();
      }else if(this.$options._isFocusenter){
        taskWindow.hidden();
        // this.$store.commit('task/hidden', task);
      }else{
        // 跟win2000不同, 这里会一直闪.
        taskWindow.focusenter();
      }
    }
  }
}
</script>