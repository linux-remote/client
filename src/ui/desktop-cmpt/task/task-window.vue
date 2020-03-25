<template lang="jade">
Window(:title="task.app.name",
       :icon="task.app.iconUrl",
       v-bind="task.app.window",
       :close="handleClose", ref="window")
  component(:is="task.app.id", :task="task", v-bind="task.launchOption")
</template>

<script>
import Window from '../window/window.vue';
import sys_app_fs from '../../../sys-app/fs/fs.vue';
import sys_app_recycle_bin from '../../../sys-app/recycle-bin/recycle-bin.vue';
import sys_app_editor from '../../../sys-app/editor/editor.vue';
import sys_app_terminal from '../../../sys-app/terminal/terminal.vue';
export default {
  props: {
    task: {
      type: Object
    }
  },
  components: {
    sys_app_fs,
    sys_app_terminal,
    sys_app_editor,
    sys_app_recycle_bin,
    Window
  },
  methods:{
    handleClose(e){
      this.$emit('close', e);
      if(e.preventDefaulted){
        return;
      }
      this.$store.commit('task/remove', this.task.id);
    }
  },
  mounted(){
    this.task.window = this.$refs.window;
  }

}
</script>
