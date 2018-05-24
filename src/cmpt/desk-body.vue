<template lang="jade">
.lr-desk(ref='lr_desk')
  Draggable.lr-icon(@dblclick="openDustBin", :class="{lr_desk_icon_focus: dustbinUniqueFocus}")
    img.lr-desk-icon(src='/public/img/tango-style/user-trash.png')
    .lr-icon-text 回收站
</template>
<script>

import Draggable from '__ROOT__/cmpt/unit/draggable.vue';


export default {
  components: {
    Draggable
  },
  data(){
    return {
      dustbinUniqueFocus: false
    }
  },
  methods: {
    openDustBin(){
      console.log('openDustBin')
      this.$store.commit('addTask', {
        name: 'Dustbin',
        type: 'dustbin',
        unique: true
      });
    },
    initDeskWH(){
      console.log('resize23')
      this.$store.commit('set', {
        deskW: this.$el.offsetWidth,
        deskH: this.$el.offsetHeight
      })
    }
  },
  mounted(){
    this.initDeskWH();
    window.addEventListener('resize', this.initDeskWH);
  },
  destroyed(){
    window.removeEventListener('resize', this.initDeskWH);
  }

}

</script>
