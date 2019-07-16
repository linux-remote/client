<template lang='jade'>
.lr-upload-input-wrap
  input(type='file' multiple="true" ref='uploadBtn' id='lr-upload-input' style="display:none" @change='handleChange')
  .lr-upload-modal(v-if='coveredList.length')
    .lr-modal-box
      .lr-modal-title {{LANG.fileAlreadyExist}}
      .lr-modal-body
        table
          tr(v-for='(v,i) in coveredList', :key='i')
            td  {{v}}
            td
              button(@click='cover(v, i)') {{LANG.cover}}
              button(@click='skip(v, i)') {{LANG.skip}}
      .lr-modal-footer
        button(@click='coverAll') {{LANG.coverAll}}
        button(@click='skipAll') {{LANG.skipAll}}
        button(@click='cancel') {{LANG.cancel}}
</template>

<script>
import {encodePath} from '__ROOT__/cmpt/sys-app/util';
export default {
  data(){
    return {
      coveredList: []
    }
  },
  computed: {
    address(){
      return this.$store.state.upload.address
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].global
    },
  },
  methods: {
    skipAll(){
      this.coveredList.forEach((name) => {
        this.removeItemByName(name);
      })
      this.coveredList = [];
      this.next();
    },
    coverAll(){
      this.coveredList.forEach(name => {
        this.setCoverByName(name);
      })
      this.coveredList = [];
      this.next();
    },
    cover(name, i){
      this.setCoverByName(name);
      this.coveredList.splice(i, 1);
      this.next();
    },
    setCoverByName(name){
      this.$options._selectedFile.find(v => v.rawFile.name === name)._isUploadCover = true;
    },
    removeItemByName(name){
      var index = this.$options._selectedFile.findIndex((v) => v.rawFile.name === name)
      this.$options._selectedFile.splice(index, 1);
    },
    skip(name ,i){
      this.removeItemByName(name);
      this.coveredList.splice(i, 1);
      this.next();
    },

    next(){
      if(!this.coveredList.length && this.$options._selectedFile.length){
        this.$store.commit('upload/addSelectedFile', this.$options._selectedFile);
        this.$options._selectedFile = null;
      }
    },

    cancel(){
      this.coveredList = [];
      this.$options._selectedFile = null;
    },
    handleChange(e){
      const files = e.target.files;
      const selectedFile = [];
      const fileNameList = [];
      Object.keys(e.target.files).forEach(k => {
        const rawFile = files[k];
        // lastModified: 1557469470259
        // lastModifiedDate: Fri May 10 2019 14:24:30 GMT+0800 (China Standard Time)
        // __proto__: Object
        // name: "AdobeStock_50410339_Preview.jpeg"
        // size: 328749
        // type: "image/jpeg"
        // webkitRelativePath: ""

        selectedFile.push({
          rawFile
        });
        fileNameList.push(rawFile.name);
      });
      
      this.request({
        url: '~/fs/' + encodePath(this.address),
        type: 'post',
        data: {
          type: 'checkCover',
          fileList: fileNameList
        },
        success(covered){
          
          if(covered.length){
            this.$options._selectedFile = selectedFile;
            this.coveredList = covered;
          }else{
            this.$store.commit('upload/addSelectedFile', selectedFile);
          }
        }
      })
      

      this.$refs.uploadBtn.value = '';
    }
  }
}
</script>
