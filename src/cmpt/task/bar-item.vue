
<template lang="jade">
.lr-task-bar-item(@click = 'handleClick',
                  :class='{lr_task_bar_item_focus: item.isFocus, lr_task_bar_item_close: item.isMin, lr_task_bar_item_max: item.isMax}')
  .lr-icon(:style="{backgroundImage: `url(${item.APP.iconUrl})`}")
  | {{itemTitle}}
  ContextMenu
    .lr-ctx-item(@click='close') {{LANG.global.close}}
</template>

<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
export default {
  props: ['item', 'index'],
  components: {
    ContextMenu
  },
  computed: {
    LANG(){
      return this.$store.getters['language/currLanguage']
    },
    itemTitle(){
      return this.LANG[this.item.appId].title
    }
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
