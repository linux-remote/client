<template lang="jade">
.lr-fs-nav-bar
  .lr-fs-nav-item(@click='handleArrowLeftClick', :class='{lr_fs_nav_disabled:backStack.length === 0}')
    span.glyph.glyph-back
  .lr-fs-nav-item(@click='handleArrowRightClick', :class='{lr_fs_nav_disabled:goStack.length === 0}')
    span.glyph.glyph-forward
  .lr-fs-nav-item(@click='handleArrowUpClick', :class='{lr_fs_nav_disabled:address === ""}')
    span.glyph.glyph-up

  .lr-fs-address
    .lr-fs-address-inner(v-if="!isInputFocus")
      .lr-fs-crumb(v-for='(v, i) in addressArr',
                  :key='i',
                  @click='handleCrumbClick(i)',
                  v-if='v')
        span.lr-fs-crumb-name {{v}}
        span.glyph.glyph-chevron-right-2
    input(v-model='inputAddress', 
          @focus="handleInputFocus",
          ref='input',
          @blur="handleInputBlur",
          @keydown.13='go(inputAddress)')
  .lr-fs-nav-item(v-if='address===inputAddress' @click='$emit("change", address)')
    span.glyph.glyph-refresh
  .lr-fs-nav-item(v-else @click='go(inputAddress)')
    span.glyph.glyph-forward
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
      //console.log('watch', this.addressArr.length)
      this.inputAddress = v;
      this.$emit('change', v);
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
      console.log(this.address)
    }
  }
}
</script>
