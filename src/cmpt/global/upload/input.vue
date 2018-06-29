<style>
.lr-upload-input-wrap{
  width:0;
  height:0;
  position: absolute; 
  z-index: 2;
}
.lr-upload-modal{
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20000;
  background-color: rgba(255, 255, 255, .5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
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
import {encodePath} from '__ROOT__/cmpt/sys-app/fs/folder/util';
export default {
  data(){
    return {
      coveredList: [],
      _selectedFile: []
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
      this.tmp_selectedFile.find(v => v.rawFile.name === name)._isCover = true;
    },
    removeItemByName(name){
      var index = this.tmp_selectedFile.findIndex((v) => v.rawFile.name === name)
      this.tmp_selectedFile.splice(index, 1);
    },
    skip(name ,i ){
      this.removeItemByName(name);
      this.coveredList.splice(i, 1);
      this.next();
    },

    next(){
      if(!this.coveredList.length && this.tmp_selectedFile.length){
        this.$store.commit('upload/addSelectedFile', this.tmp_selectedFile);
        this.tmp_selectedFile = null;
      }
    },

    cancel(){
      this.coveredList = [];
      this.tmp_selectedFile = null;
    },
    handleChange(e){
      const files = e.target.files;
      const selectedFile = [];
      const fileNameList = [];
      Object.keys(e.target.files).forEach(k => {
        selectedFile.push({
          rawFile: files[k]
        });
        fileNameList.push(files[k].name);
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
            this.tmp_selectedFile = selectedFile;
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
