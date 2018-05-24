<style>
.lr-unit{
  position: absolute;
}
.lr-drag{
  user-select: none;
}
.lr-un-drag{
  position: relative;overflow: hidden;
}
.lr_be_selected{
  background-color: green;
}
</style>
<template lang='jade'>
  .lr-unit(:class='{lr_be_selected: beSelected}', 
            @mousedown.stop='',
           :style='{width:w + "px", height: h  + "px",  top: y + "px", left: x  + "px"}')
    Resizable(v-if='resizable')
    .lr-drag(v-if='draggable')
      slot(name='drag')
    Draggable(v-if='draggable')
    Selectable(v-if='selectable')
      slot
    .lr-un-drag(v-else)
      slot
</template>

<script>
import Resizable from './resizable.vue';
import Draggable from './draggable.vue';
import Selectable from './selectable-area.no-store';
export default {
  props: ['__init', 'className', 'draggable', 'resizable', 'selectable', 'beSelectable'],
  data(){
    return Object.assign({
      x: 600,
      y: 100,
      w: 800,
      h: 800,
      minH: 200,
      minW: 200,
      beSelected: false
    }, this.__init);
  },
  components: {
    Draggable,
    Resizable,
    Selectable
  },
  mounted(){
    // console.log(this.$slots)
    // console.log(this.$children )
  }
}
</script>
