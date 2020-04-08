<template lang='jade'>
.lr-window_body
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
export default {
  props: {
    coveredList: Array
  },
  computed: {
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
    }
  }
}
</script>
