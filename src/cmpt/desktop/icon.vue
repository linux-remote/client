<style>
.lr-desk-icon{
  position: absolute;
  width: 80px;
  height: 80px;
  user-select: none;
  display:flex;
  flex-direction: column;
  align-items: center;
    z-index:1;
}

.lr-desk-icon-img{
  height: 60px;
  width: 100%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.lr-desk-icon-text{
  font-size: 12px;
}
.lr-desk-icon:hover{
  background-color: #D3D3D3;
}
.lr_desk_icon_focus{
  background-color: #ddd;
}
</style>
<template lang="jade">
.lr-desk-icon(draggable="true",
              @dblclick="handleDblclick",
              @dragstart.stop='handleDragStart(item, $event)',
              
              :class="{lr_desk_icon_focus: app.unique}",
              :style='{left: item.x + "px", top: item.y + "px"}')
  .lr-desk-icon-img(:style="{backgroundImage: `url(${app.iconUrl})`}")
  .lr-desk-icon-text {{currTitle}}
</template>
<script>

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    app(){
      return this.$store.state.appMap[this.item.id]
    },
    currTitle(){
      return this.item.title || this.app.title
    },

  },
  methods: {
    handleDblclick(){
      this.app.handleClick && this.app.handleClick();
    },
    handleDragStart(v, e){
      this.$store.commit('transferDragData', {
        id: this.item.id,
        type: this.item.type,
        _startClient : {
          x: e.clientX,
          y: e.clientY,
          _vueEl: this
        }
      });
    }
  }
}

</script>
