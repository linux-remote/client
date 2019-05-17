
<template lang="jade">
.lr-modal(v-if='data')
  .lr-modal-box
    .lr-modal-title Copy {{filename}}
    .lr-modal-body
      label DEST:
      input(v-model="destName", ref="input")
    .lr-modal-footer
      button.btn(@click='ok',:disabled="filename === destName") 确定
      button.btn(@click='$emit("close")') 取消
</template>

<script>
import {encodePath} from './util';
export default {
  props: ['data'],
  data(){
    return {
      filename: this.data.name,
      destName: this.data.name
    }
  },
  methods: {
    ok(){
      const list = this.$parent.list;
      if(list.find(v => v.name === this.destName)){
        alert('重名了');
        return;
      }

      const address = this.$parent.address;
      this.request({
        url: '~/fs/' + encodePath(address),
        type: 'post',
        data: {
          type: 'copy',
          isCopyOneOnSameDir: true,
          srcFile: this.filename,
          destName: this.destName
        },
        success(data){
          this.$emit('success', data);
          this.$emit('close');
        }
      })
    }
  },
  mounted(){
    const input = this.$refs.input;
    input.focus();
    input.select();
  }
}
</script>
