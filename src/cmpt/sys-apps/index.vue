<template lang="jade">
TaskWindow(:index='index')
  FsBody(v-if='appId==="sys_file"')
  RecycleBinBody(v-else-if='appId==="sys_recycle_bin"')
  DiskBody(v-else-if='appId==="sys_disk"')
  //- edit-body(v-else-if='type==="edit"' ,:address='address')
  
  //- computer-info-body(v-else-if='type==="computerInfo"')
  //- user-info-body(v-else-if='type==="userInfo"')
  div(v-else='!type') Empty
</template>

<script>
import TaskWindow from '../task-window.vue';
import FsBody from './window-body/fs/index.vue';
import RecycleBinBody from './window-body/recycle-bin.vue';
import DiskBody from './window-body/disk.vue';
// import EditBody from './window-body/edit';
// import ComputerInfoBody from './window-body/computer-info';
// import UserInfoBody from './window-body/user-info';
export default {
  components: {
    TaskWindow,
    FsBody,
    RecycleBinBody,
    DiskBody
    // EditBody,
    
    // ComputerInfoBody,
    // UserInfoBody
  },
  props: ['index'],
  data(){
    return this.$store.state.task.list[this.index];
  }
}
</script>
