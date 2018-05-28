<template lang="jade">
TaskWindow(:index='index')
  FsBody(v-if='type==="fs"')
  DustbinBody(v-else-if='type==="dustbin"')
  
  //- edit-body(v-else-if='type==="edit"' ,:address='address')
  
  //- computer-info-body(v-else-if='type==="computerInfo"')
  //- user-info-body(v-else-if='type==="userInfo"')
  div(v-else='!type') Empty
</template>

<script>
import TaskWindow from '../task-window.vue';
import FsBody from './window-body/fs.vue';
import DustbinBody from './window-body/dustbin';
// import EditBody from './window-body/edit';
// import ComputerInfoBody from './window-body/computer-info';
// import UserInfoBody from './window-body/user-info';
export default {
  components: {
    TaskWindow,
    FsBody,
    DustbinBody,
    // EditBody,
    
    // ComputerInfoBody,
    // UserInfoBody
  },
  props: ['index'],
  data(){
    return this.$store.state.tasks[this.index];
  }
}
</script>
