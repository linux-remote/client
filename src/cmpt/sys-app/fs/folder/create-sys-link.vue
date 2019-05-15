<template lang="jade">
.lr-modal
  .lr-modal-box
    .lr-modal-title {{LANG.sys_app_fs.ctx.createSymbolicLink}}
    .lr-modal-body
      input(v-model='name', ref='input', required="required")
    .lr-modal-footer
      button(@click='submit') {{LANG.global.ok}}
      button(@click='close') {{LANG.global.cancel}}
</template>

<script>
import {encodePath} from './util';
export default {

  computed: {

    LANG(){
      return this.$store.getters['language/currLanguage']
    },
  },
  data(){
    return {
      name: this.$parent.createSysLinkName + '.lnk'
    }
  },
  methods: {
    close(){
      this.$parent.createSysLinkName = null;
    },
    submit(){
      const name = this.name;
      const address = this.$parent.getItemPath(this.$parent.createSysLinkName);
      this.request({
        type: 'post',
        url: '~/fs/' + encodePath(address),
        data: {
          type: 'createSymbolicLink',
          name
        },
        success(data){
          data.name = name;
          this.$store.commit('fsTrigger', {
            address: this.$parent.address,
            type: 'add',
            item: data
          });
          this.$parent.createSysLinkName = null;
        }
      })
    }
  },
  mounted(){
    this.$refs.input.select();
  }
}

</script>
