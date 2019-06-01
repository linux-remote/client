<template lang="jade">
tr
  td {{item.source.base}}
    ContextMenu(ref='ctx')
      .lr-ctx-item(@click="restore") Restore
      hr
      .lr-ctx-item(@click='del') Delete
  td {{item.source.dir}}
  td {{item.source.delTime}}
  td {{item.size | wellSize}}
</template>

<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
export default {
  props: ['item'],
  components: {
    ContextMenu
  },

  methods: {
    restore(){
      this.$parent.restore(this.item);
      this.$refs.ctx.hidden();
    },
    del(){
      this.$parent.del(this.item);
      this.$refs.ctx.hidden();
    }
  }
}
</script>
