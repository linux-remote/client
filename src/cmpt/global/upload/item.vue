
<template lang='jade'>
.lr-upload-item(:title='item.fullPath')
  //- .lr-upload-content
  //-   .lr-upload-name {{item.rawFile.name}}
  //-   div {{item.rawFile.size | wellSize}}
  //-   .lr-upload-ctrl
  //-     button(@click='close') X
  //- .lr-upload-process(:style='{width: percentage + "%"}')
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

      this.$options.xhr = this.request({
        type: 'put',
        // rootUrl: 'http://192.168.56.101:3001', 
        url: '~/upload/' + encodePath(item.address + '/' + item.rawFile.name),
        data: item.rawFile,
        stateKey: 'isRequest',
        contentType: false,
        processData: false,
        xhr(){
          
          var xhr = new window.XMLHttpRequest();

          xhr.upload.onloadstart = function(){
            console.log(' xhr.upload.onloadstart');
            self.$store.commit('fs/publicEmit', {
              address: item.address,
              type: 'uploadStart',
              rawFile: item.rawFile
            });
          }
          xhr.upload.addEventListener("progress", function(e){
            self.percentage = (e.loaded / e.total) * 100;

            self.$store.commit('fs/publicEmit', {
              address: item.address,
              type: 'uploadProgress',
              name: item.rawFile.name,
              total: e.total,
              loaded: e.loaded
            });

          });

          xhr.upload.onerror = function(e){
            // console.log('uploadError', e);
            self.$store.commit('fs/publicEmit', {
              address: item.address,
              type: 'uploadError',
              name: item.rawFile.name,
              total: e.total,
              loaded: e.loaded
            });
          }
          xhr.upload.onabort = function(){
            // console.log('onabort', e);
            self.$store.commit('fs/publicEmit', {
              address: item.address,
              type: 'uploadAbort',
              name: item.rawFile.name
            });

            // self.$store.dispatch('fs/thoroughDelItemsDev', {
            //   address: item.address,
            //   files: [item.rawFile.name]
            // });
          }
          xhr.upload.ontimeout = function(){
            // console.log('ontimeout', e);
            self.$store.commit('fs/publicEmit', {
              address: item.address,
              type: 'uploadTimeout',
              name: item.rawFile.name,
              srcTaskId: item.srcTaskId
            });
          }
          return xhr;
        },
        success(stdout){
          const item = this.item;
          self.close();

          self.$store.commit('fs/publicEmit', {
            address: item.address,
            type: 'uploadSuccess',
            stdout
          });

        }
      })
    },
    close(){
      this.$store.commit('upload/removeItem', this.index);
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
