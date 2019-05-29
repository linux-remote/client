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
      return this.$store.getters['sysApps/getById'](this.item.id)
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

    handleDragStart(e){
      const item = this.item;
      const value = JSON.stringify({
        id: this.id,
        from: 'startMenu',
        startClient : {
          x: e.clientX,
          y: e.clientY
        }
      });
      e.dataTransfer.setData("text", value);
      e.dataTransfer.dropEffect = 'move';
    }
  }
}
</script>
