<template lang="jade">
.lr-task-item(@click='handleClick',
              @mousedown.prevent,
              :class='{lr__focus: item.window.isFocusenter}')
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
  methods: {
    close(){
      this.$store.commit('task/remove', this.item.id);
    },
    handleClick(){
      const taskWindow = this.item.window;
      if(taskWindow.isMin){
        taskWindow.show();
      }else if(taskWindow.isFocusenter){
        taskWindow.hidden();
        // this.$store.commit('task/hidden', task);
      }else{
        taskWindow.focusenter();
      }
    }
  }
}
</script>