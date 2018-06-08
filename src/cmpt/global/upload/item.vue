<style>

.lr-upload-item{
  height: 30px;
  border-bottom: 1px solid #eee;
  color:#fff;
  position: relative;
}
.lr-upload-process{
  position: absolute;
  height: 100%;
  bottom: 0;
  left: 0;
  background-color: green;
  transition-duration: .3;
  z-index: 3;
}
.lr-upload-content{
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 4;
  display: flex;
  justify-content: space-between;
}
.lr-upload-ctrl{

}
</style>
<template lang='jade'>
.lr-upload-item(:key='item.key', :title='item.key')
  .lr-upload-content
    div {{item.rawFile.name}}
    div {{wellSize(item.rawFile.size)}}
    .lr-upload-ctrl
      button X
  .lr-upload-process(:style='{width: percentage + "%"}')
</template>

<script>
import {wellSize} from '__ROOT__/lib/util';
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
    wellSize,
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
