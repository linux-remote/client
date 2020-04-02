<template lang="jade">
div(draggable="true",
    @dragstart.stop='handleDragStart',
    @click='handleCLick')
  .lr-icon(v-open-icon="item.iconUrl")
  .lr-sys-app-title {{item.name}}
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
  methods: {
    handleCLick(){
      this.$store.commit('task/add', this.id);
    },

    handleDragStart(e){
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
