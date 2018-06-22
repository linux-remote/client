
<template lang='jade'>
.lr-upload-item(:title='item.fullPath')
  .lr-upload-content
    .lr-upload-name {{item.rawFile.name}}
    div {{item.rawFile.size | wellSize}}
    .lr-upload-ctrl
      button X
  .lr-upload-process(:style='{width: percentage + "%"}')
</template>

<script>
import {encodePath} from '__ROOT__/cmpt/sys-app/fs/folder/util';
export default {
  props: {
    item: {
      type: Object,
      required: true,
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
      this.request({
        type: 'put',
        url: '~/upload/' + encodePath(item.address) + '?type=uploadMultiple',
        data: formData,
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
          this.$store.commit('fsTrigger', {
            address: item.address,
            type: item._isCover ? 'update' : 'add',
            item: data
          })
          //console.log('data', data)
        }
      })
      
    }
  },
  mounted(){
    this.upload();
  }
}
</script>
