<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  NavBar(ref='navBar', :onChange="handleNavChange")
  .lr-fs-bottom-wrap
    Left
    Disk(v-if='address === ""')
    Folder(v-else)
</template>

<script>
import NavBar from './nav-bar.vue';
import Left from './left.vue';
import Disk from './disk.vue';
import Folder from './folder/index.vue';

export default {
  components:{
    Left,
    NavBar,
    Disk,
    Folder
  },
  data(){
    return {
      isRequest: false,
      address: null
    }
  },
  methods: {
    handleNavChange(address){
      this.address = address;
      this.getData();
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
