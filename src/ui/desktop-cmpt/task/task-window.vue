<template lang="jade">
Window(:title="task.app.name",
       :icon="task.app.iconUrl",
       v-bind="task.app.window",
       :close="handleClose",
       @hidden="handleHidden",
       ref="window")
  component(:is="task.app.id", :task="task")
</template>

<script>
import Window from '../window/window.vue';
import sys_app_fs from '../../../sys-app/fs/fs.vue';
import sys_app_recycle_bin from '../../../sys-app/recycle-bin/recycle-bin.vue';
import sys_app_editor from '../../../sys-app/editor/editor.vue';
import sys_app_terminal from '../../../sys-app/terminal/terminal.vue';
import sys_app_users from '../../../sys-app/users/users.vue';
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
    sys_app_users,
    Window
  },
  methods:{
    handleClose(){
      this.$store.commit('task/remove', this.task.id);
    },
    handleHidden(){
      this.$store.commit('task/focusNext');
    }
  },
  mounted(){
    const win = this.task.window = this.$refs.window;
    const app = this.task.app;

    win.$on('resized', (virtual) => {
      if(win.isMax){
        return;
      }
      if(!app.notFollowWH){
        app.window.width = virtual.width;
        app.window.height = virtual.height;
      }
      app.window.top = virtual.top;
      app.window.left = virtual.left;
    });
    win.$on('moved', (virtual) => {
      app.window.top = virtual.top;
      app.window.left = virtual.left;
    });
 
  }

}
</script>
