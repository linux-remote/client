<template lang="jade">
div(draggable="true",
    @dragstart.stop='handleDragStart',
    @click='handleCLick')
  .lr-sys-app-icon(:style="`background-image:url(${item.iconUrl})`") 
  .lr-sys-app-title {{LANG.title}}
</template>

<script>

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    app(){
      return this.$store.getters['app/getById'](this.item.id)
    },
    LANG(){
      return this.$store.getters['language/currLanguage'][this.id]
    }
  },
  methods: {
    handleCLick(){
      this.$store.commit('task/add', this.id);
      this.$parent.handleBtnClick();
    },

    handleDragStart(){
      const item = this.item;
      this.$store.commit('transferDragData', {
        isFromStart: true,
        id: this.id,
        title: item.title
      });
    }
  }
}
</script>
