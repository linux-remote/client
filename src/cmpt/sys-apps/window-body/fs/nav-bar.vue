<template lang="jade">
.lr-fs-nav-bar
  .lr-fs-nav-item.lr-fs-nav-left(@click='handleArrowLeftClick', :class='{lr_fs_nav_disabled:backStack.length === 0}')
  .lr-fs-nav-item.lr-fs-nav-up(@click='handleArrowUpClick', :class='{lr_fs_nav_disabled:address === "/"}')
  .lr-fs-nav-item.lr-fs-nav-right(@click='handleArrowRightClick', :class='{lr_fs_nav_disabled:goStack.length === 0}')
  input.lr-fs-address(v-model='inputAddress' @keydown.13='handleGoClick')
  .lr-fs-nav-item.lr-fs-nav-reload(v-if='address===inputAddress' @click='onChange(address)')
  .lr-fs-nav-item.lr-fs-nav-go(v-else @click='handleGoClick')
</template>
<script>
export default {
  props: {
    onChange : {
      type: Function
    },
    defAddress: {
      type: String
    }
  },
  data(){
    return {
      backStack: [],
      goStack: [],
      addressArr: ['/'],
      inputAddress: null
    }
  },
  watch: {
    address(v){
      this.inputAddress = v;
      this.onChange(v);
    }
  },
  computed: {
    address(){
      return '/' + this.addressArr.join('/');
    }
  },
  methods: {
    handleArrowLeftClick(){
      if(!this.backStack.length){
        return;
      } 
      this.goStack.push(this.addressArr);
      const pop = this.backStack.pop();
      this.addressArr = pop;
    },
    handleArrowRightClick(){
      if(!this.goStack.length){
        return;
      } 
      const pop = this.goStack.pop();
      this.addressArr = pop;
    },
    handleGoClick(){
      this.backStack.push(this.addressArr);
      this.setAddress(this.inputAddress);
    },
    handleArrowUpClick(){
      if(!this.address === '/'){
        return;
      } 
      this.goStack = [];
      const i = this.address.lastIndexOf('/');
      this.setAddress(this.address.substr(0, i));
    },

    go(newAddress){
      this.backStack.push(this.addressArr);
      this.setAddress(newAddress);
    },

    setAddress(path){
      const arr = path.split('/');
      const arr2 = [];
      arr.forEach(v => {
        if(v){
          arr2.push(v);
        }
      });
      this.addressArr = arr2;
    }
  }
}
</script>
