<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  NavBar(ref='navBar', :onChange="handleNavChange")
  .lr-fs-bottom-wrap
    Left
    .lr-fs-right
      .lr-fs-folder(v-if='error')
        pre.lr-fs-error(v-html='data' style='color:red')
      Folder(v-else)
</template>

<script>
import NavBar from './nav-bar.vue';
import Left from './left.vue';
import Folder from './folder.vue';

export default {
  components:{
    Left,
    NavBar,
    Folder
  },
  data(){
    return {
      isRequest: false,
      address: null,
      data: []
    }
  },
  computed: {
    error(){
      return !Array.isArray(this.data);
    }
  },
  methods: {
    handleNavChange(address){
      this.address = address;
      this.getData();
    },

    uploadFolder(e){
      const files = e.target.files;
      if(!files.length){
        return; //changel
      }
      var fd = new FormData();
      for (var i = 0; i < files.length; i++) {
        fd.append("file", files[i]);
      }
      this.request({
        type: 'POST',
        contentType: false,
        processData: false,
        url: '~/fs' + this.address + '?type=uploadMultiple',
        data: fd,
        success(){
          console.log('uploadFolder success');
          this.getData();
        }
      })
    },

    getAddress(item){
      let address;
      if(item.isSymbolicLink){
        address = item.linkPath;
      }else{
        address = this.address + '/' + item.name
      }
      return address;
    },
    getData(){

    }
  },
  mounted(){
    const pData = this.$parent;
    const address = pData.address || this.$store.state.homedir;
    this.$refs.navBar.setAddress(address);
  }
}
</script>
