
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
        url: '~/upload' + item.address + '?type=uploadMultiple',
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
        success(){
        }
      })
      
    }
  },
  mounted(){
    this.upload();
  }
}
</script>
