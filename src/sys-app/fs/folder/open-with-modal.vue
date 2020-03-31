<template lang="jade">
.lr-window_body
  .lr-fs_ow_wrap
    .lr-fs_ow-item(@click="handleItemClick")
      .lr-icon(v-open-icon="app.iconUrl")
      span {{app.name}}
  //- .lr-hr
  //- .lr-fs_ow_footer
  //-   button.lr-btn(ref="btn", @click="handleItemClick") OK
</template>

<script>
// false
import {getApp} from '../../../store/module/sys-apps-map';
export default {
  props: ['ok'],
  data(){
    return {
      app: getApp('sys_app_editor')
    }
  },
  methods: {
    handleItemClick(){
      this.ok('sys_app_editor');
      this.$parent.close();
    }
  },
  // mounted(){
  //   this.$parent.setEnterBindBtn(this.$refs.btn);
  // }
}
</script>
