<template lang="jade">
TaskWindow(:index='index')
  fs-body(v-if='type==="fs"')
  edit-body(v-else-if='type==="edit"' ,:address='address')
  dustbin-body(v-else-if='type==="dustbin"')
  computer-info-body(v-else-if='type==="computerInfo"')
  user-info-body(v-else-if='type==="userInfo"')
  div(v-else='!type') Empty
</template>

<script>
import TaskWindow from './task-window-wrap.vue';
// import FsBody from './window-body/fs';
// import EditBody from './window-body/edit';
// import DustbinBody from './window-body/dustbin';
// import ComputerInfoBody from './window-body/computer-info';
// import UserInfoBody from './window-body/user-info';
export default {
  components: {
    // TaskWindow,
    // FsBody,
    // EditBody,
    // DustbinBody,
    // ComputerInfoBody,
    // UserInfoBody
  },
  props: ['index'],
  data(){
    return this.$store.state.tasks[this.index];
  }
}
</script>
