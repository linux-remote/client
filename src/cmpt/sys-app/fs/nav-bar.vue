<template lang="jade">
.lr-fs-nav-bar
  .lr-fs-nav-item.lr-fs-nav-left(@click='handleArrowLeftClick', :class='{lr_fs_nav_disabled:backStack.length === 0}')
  .lr-fs-nav-item.lr-fs-nav-up(@click='handleArrowUpClick', :class='{lr_fs_nav_disabled:address === ""}')
  .lr-fs-nav-item.lr-fs-nav-right(@click='handleArrowRightClick', :class='{lr_fs_nav_disabled:goStack.length === 0}')
  .lr-fs-address
    .lr-fs-address-inner(v-if="!isInputFocus")
      .lr-fs-crumb(v-for='(v, i) in addressArr',
                  :key='i',
                  @click='handleCrumbClick(i)',
                  v-if='v') {{v}}
    input(v-model='inputAddress', 
          @focus="handleInputFocus",
          @blur="handleInputBlur",
          @keydown.13='go(inputAddress)')
  .lr-fs-nav-item.lr-fs-nav-reload(v-if='address===inputAddress' @click='onChange(address)')
  .lr-fs-nav-item.lr-fs-nav-go(v-else @click='go(inputAddress)')
</template>
<script>
const MAX_LEN = 50;
export default {
  props: {
    onChange : {
      type: Function
    }
  },
  data(){
    return {
      backStack: [],
      goStack: [],
      addressArr: [],
      inputAddress: null,
      isInputFocus: false
    }
  },
  computed: {
    address(){
      var len = this.addressArr.length;
      if(!len){  //''.split('/')  [""]
        return '';
      }
      if(len === 1){  //''.split('/')  [""]
        return '/';
      }
      return this.addressArr.join('/');
    }
  },
  watch: {
    address(v){
      this.inputAddress = v;
      this.onChange(v);
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
      var len = this.addressArr.length - 1;
      let arr = this.addressArr.slice(0, len);
      this.go(arr);
    },
    beforeGo(){
      if(this.backStack.length === MAX_LEN){
        this.backStack.shift();
      }
      if(this.goStack.length){
        this.goStack = [];
      }
      this.backStack.push(this.addressArr);
    },
    go(newAddress){
      this.beforeGo();
      this.setAddress(newAddress);
    },
    setAddress(path){
      if(typeof path === 'string'){
        if(!path){
          this.addressArr = []
        }else {
          if(path === '/'){
            this.addressArr = ['']
          }else{
            this.addressArr = path.split('/');
          }
        }
      }else{
        this.addressArr = path;
      }
    }
  }
}
</script>
