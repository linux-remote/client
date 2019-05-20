
<template lang='jade'>
.lr-upload-item(:title='item.fullPath')
  .lr-upload-content
    .lr-upload-name {{item.rawFile.name}}
    div {{item.rawFile.size | wellSize}}
    .lr-upload-ctrl
      button(@click='close') X
  .lr-upload-process(:style='{width: percentage + "%"}')
</template>

<script>
import {encodePath} from '__ROOT__/cmpt/sys-app/fs/folder/util';
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: Number
    }
  },
  data(){
    return {
      percentage: 0,
      error: null
    }
  },
  methods: {
    upload(){
      var self = this;
      var item = self.item;
      var formData = new FormData();
      formData.append('file', item.rawFile);
      this.$options.xhr = this.request({
        type: 'put',
        url: '~/upload/' + encodePath(item.address),
        data: formData,
        stateKey: 'isRequest',
        contentType: false,
        processData: false,
        xhr(){
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function(e){
            self.percentage = (e.loaded / e.total) * 100;
          });
          return xhr;
        },
        success(data){
          const item = this.item;
          console.log('item._isCover', item._isCover);

          data.name = item.rawFile.name;
          this.$store.commit('upload/removeItem', this.index);
          this.$store.commit('fsPublicEmit', {
            address: item.address,
            type: item._isCover ? 'update' : 'add',
            item: data
          })
          //console.log('data', data)
        }
      })
    },
    close(){
      this.$parent.selectedFiles.splice(this.index, 1);
    }
  },
  beforeDestroy(){
    if(this.isRequest){
      this.$options.xhr.abort();
    }
  },
  mounted(){
    this.upload();
  }
}
</script>
