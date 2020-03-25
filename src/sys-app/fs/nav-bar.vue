<template lang="jade">
.lr-fs-nav-bar
  .lr-fs-nav-item(@click='handleArrowLeftClick', :class='{lr_fs_nav_disabled:backStack.length === 0}')
    span.iconfont.icon-left
  .lr-fs-nav-item(@click='handleArrowRightClick', :class='{lr_fs_nav_disabled:goStack.length === 0}')
    span.iconfont.icon-right
  .lr-fs-nav-item(@click='handleArrowUpClick', :class='{lr_fs_nav_disabled:address === ""}')
    span.iconfont.icon-up

  .lr-fs-address
    .lr-fs-address-inner(v-if="!isInputFocus")
      .lr-fs-crumb(@click='goToRoot', v-if='addressArr.length')
        //- span.lr-fs-crumb-name /
        span /
      .lr-fs-crumb(v-for='(v, i) in addressArr',
                  :key='i',
                  @click='handleCrumbClick(i)',
                  v-if='v')
        span.lr-fs-crumb-name {{v}}
        span /
    input(v-model='inputAddress', 
          @focus="handleInputFocus",
          ref='input',
          @blur="handleInputBlur",
          @keydown.stop='handleInputKeydown')
  .lr-fs-nav-item(v-if='address===inputAddress' @click='$emit("change", address)')
    span.iconfont.icon-reload
  .lr-fs-nav-item(v-else @click='go(inputAddress)')
    span.iconfont.icon-right
</template>
<script>
const MAX_LEN = 50;
export default {
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
      if(!len){
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
      //console.log('watch', this.addressArr.length)
      this.inputAddress = v;
      this.$emit('change', v);
    }
  },

  methods: {
    handleInputKeydown(e){
      if(e.key === 'Enter'){
        this.go(this.inputAddress);
        this.$nextTick(() => {
          this.$refs.input.blur();
        });
      }
    },
    goToRoot(){
      this.go('/');
    },
    handleCrumbClick(index){
      const arr = [];
      for(let i = 0; i <= index; i++){
        arr.push(this.addressArr[i]);
      }
      this.go(arr);
    },
    handleInputFocus(){
      this.isInputFocus = true;

      this.$refs.input.select();
    },
    handleInputBlur(){
      this.$refs.input.value = '';
      this.$refs.input.value = this.inputAddress;
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
      if(this.address === ""){
        return;
      }
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
      }else{ // Array
        this.addressArr = path;
      }
      // console.log(this.address)
    }
  }
}
</script>
