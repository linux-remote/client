<template lang="jade">
div(draggable="true",
    @dragstart.stop='handleDragStart')
  .lr-sys-app-icon(:style="`background-image:url(${item.iconUrl})`") 
  .lr-sys-app-title {{item.title}}
</template>

<script>

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },

  methods: {
    handleDragStart(){
      this.$store.commit('transferDragData', {
        isRaw: true,
        id: this.id,
        type: 'app'
      });
    }
  }
}
</script>
