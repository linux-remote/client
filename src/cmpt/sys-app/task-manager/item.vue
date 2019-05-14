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
  props: ['v', 'killSuccess'],
  data(){
    return {
    }
  },

  methods: {
    handlekill(pid){
      this.request({
        url: '~/cmd',
        type: 'post',
        data: {
          cmd: 'kill -9 ' + pid
        },
        success() {
          this.killSuccess(pid);
        },
        complete() {
          this.$refs.ctx.hidden();
        }
      })
      console.log('handlekill', pid);
    }
  }
}
</script>
