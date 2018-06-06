<template lang="jade">
.lr-fs-nav-bar
  .lr-fs-nav-item.lr-fs-nav-left(@click='handleArrowLeftClick', :class='{lr_fs_nav_disabled:backStack.length === 0}')
  .lr-fs-nav-item.lr-fs-nav-up(@click='handleArrowUpClick', :class='{lr_fs_nav_disabled:address === "/"}')
  .lr-fs-nav-item.lr-fs-nav-right(@click='handleArrowRightClick', :class='{lr_fs_nav_disabled:goStack.length === 0}')
  .lr-fs-address
    .lr-fs-address-inner(v-if="!isInputFocus")
      .lr-fs-crumb(v-for='(v, i) in addressArr', 
                  :key='v',
                  @click='handleCrumbClick(i)') {{v}}
    input(v-model='inputAddress', 
          @focus="handleInputFocus",
          @blur="handleInputBlur", 
          @keydown.13='go')
  .lr-fs-nav-item.lr-fs-nav-reload(v-if='address===inputAddress' @click='onChange(address)')
  .lr-fs-nav-item.lr-fs-nav-go(v-else @click='go')
</template>
<script>
const MAX_LEN = 50;
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
      inputAddress: null,
      isInputFocus: false
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
    handleCrumbClick(index){
      const arr = [];
      for(let i = 0; i <= index; i++){
        arr.push(this.addressArr[i]);
      }
      this.go(arr);
    },
    handleInputFocus(){
      this.isInputFocus = true;
    },
    handleInputBlur(){
      this.isInputFocus = false;
    },
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
    handleArrowUpClick(){
      if(!this.address === '/'){
        return;
      } 
      const i = this.address.lastIndexOf('/');
      this.go(this.address.substr(0, i));
    },

    go(newAddress){
      if(this.backStack.length === MAX_LEN){
        this.backStack.pop();
      }
      if(this.goStack.length){
        this.goStack = [];
      }
      this.backStack.push(this.addressArr);
      this.setAddress(newAddress);
    },

    setAddress(path){
      if(typeof path === 'string'){
        const arr = path.split('/');
        const arr2 = [];
        arr.forEach(v => {
          if(v){
            arr2.push(v);
          }
        });
        this.addressArr = arr2;
      }else{
        this.addressArr = path;
      }
    }
  }
}
</script>
