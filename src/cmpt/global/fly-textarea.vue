<template lang="jade">
textarea.lr_fly_textarea(v-show='open' , :style='{top:top + "px", left: left  + "px",  height: height + "px", fontSize: fontSize, lineHeight: height + "px"}', v-model='value', @focus='select', @input='handleInput', @blur='close', @click.stop='handleClick' @keydown.13='handleKeyDown')
</template>

<script>
export default {
  data(){
    return this.$store.state.flyTextarea
  },
  watch:{
    open(val){
      if(val){
        var vmDom = this.$options.vmDom;
        vmDom.style.fontSize = this.fontSize;
        this.getWidth(this.value);
        setTimeout(() => {
          this.$el.focus();
        })
      }
    }
  },
  methods:{
    handleKeyDown(){
      this.$el.blur();
    },
    handleInput(e){
      this.getWidth(e.target.value);
    },
    getWidth(val){
      var vmDom = this.$options.vmDom;
      vmDom.innerText = val;
      this.$el.style.width = (vmDom.clientWidth + 30) + "px"; 
    },
    close(){
      this.$store.commit('flyTextarea/close');
    },
    handleClick(){
      return false;
    },
    select(){
      this.$el.select();
    }
  },
  mounted(){
    const vmDom = document.createElement('div');
    vmDom.style.position = 'absolute';
    vmDom.style.zIndex = 99999;
    vmDom.style.left = '-9999999';
    vmDom.className = 'lr_fly_textarea';
    document.body.appendChild(vmDom);
    this.$options.vmDom = vmDom;
  }
}
</script>
