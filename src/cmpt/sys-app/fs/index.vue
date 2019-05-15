<template lang="jade">
.lr-fs-wrap
  //-.lr-hourglass(v-show='isRequest')
  NavBar(ref='navBar', :onChange="handleNavChange")
  .lr-fs-bottom-wrap
    //-Left
    .lr-fs-index(v-if='address === ""')
      div(@click='go("/")') /
      div(@click='go(homedir)') Home
    Folder(v-else-if='address', :address='address', :triggerContainSame='triggerContainSame')
</template>

<script>
import NavBar from './nav-bar.vue';
//-import Left from './left.vue';
//import Disk from './disk.vue';
import Folder from './folder/index.vue';

export default {
  components:{
    //-Left,
    NavBar,
    //-Disk,
    Folder
  },
  data(){
    return {
      address: null,
      triggerContainSame : null
    }
  },
  computed: {

    go(){
      return this.$refs.navBar.go
    },
    homedir(){
      return this.$store.state.homedir
    }
  },
  methods: {
    handleNavChange(address){
      this.address = address;
      this.triggerContainSame = {
        address
      };
    }
  },
  mounted(){
    const pData = this.$parent;
    const address = pData.address || this.$store.state.homedir;
    this.$refs.navBar.setAddress(address);
  }
}
</script>
