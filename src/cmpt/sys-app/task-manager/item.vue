<template lang="jade">
tr(v-on="$listeners")
  td {{v.pid}}
    ContextMenu(ref="ctx")
      .lr-ctx-item(@click='handlekill(v.pid)') Kill
  td {{v.user}}
  td {{v.cpu}}%
  td {{v.mem}}%
  td {{v.time}}
  td {{v.command}}
</template>

<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
export default {
    components: {
    ContextMenu
  },
  props: ['v'],
  data(){
    return {
      isRequest: false
    }
  },

  methods: {
    handlekill(pid){
      this.$emit('kill', pid);
      this.$refs.ctx.hidden();
    }
  }
}
</script>
