<template lang="jade">
.lr-task-item(@click='handleClick',
              :class='{lr__focus: item.isFocus}')
  //- LRIcon(v-bind="$attrs")
  .lr-icon(v-if="item.APP.iconUrl", v-open-icon="item.APP.iconUrl")
  .lr-icon(v-else :class="item.APP.iconClassName")
  | {{itemTitle}}
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
      if(task.isMin){
        this.$store.commit('task/show', task);
      }else if(task.isFocus){
        // console.log('hidden')
        this.$store.commit('task/hidden', task);
      }else{
        this.$store.commit('task/focus', task);
      }
    }
  }
}
</script>