
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
import {encodePath} from '__ROOT__/cmpt/sys-app/util';
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
      const self = this;
      const item = self.item;

      const formData = new FormData();
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

          xhr.upload.onloadstart = function(e){
            console.log(' xhr.upload.onloadstart');
            self.$store.commit('fsPublicEmit', {
              address: item.address,
              type: 'uploadStart',
              rawFile: item.rawFile
            });
          }
          xhr.upload.addEventListener("progress", function(e){
            self.percentage = (e.loaded / e.total) * 100;

            self.$store.commit('fsPublicEmit', {
              address: item.address,
              type: 'uploadProgress',
              name: item.rawFile.name,
              total: e.total,
              loaded: e.loaded
            });

          });
          // xhr.upload.onloadend = function(){
          //   self.$store.commit('fsPublicEmit', {
          //     address: item.address,
          //     type: 'uploadLoadend',
          //     name: item.rawFile.name,
          //     total: e.total,
          //     loaded: e.loaded
          //   });
          // }
          return xhr;
        },
        success(stdout){
          const item = this.item;
          this.$store.commit('upload/removeItem', this.index);

          this.$store.commit('fsPublicEmit', {
            address: item.address,
            type: 'uploadSuccess',
            stdout
          });

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
