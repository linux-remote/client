<template lang="jade">
textarea.lr_fly_textarea(v-show='open' , :style='{top:top + "px", left: left  + "px", width:(width + 2) + "px", height: height + "px", fontSize: fontSize + "px", lineHeight: "15px"}', v-model='value', @focus='select', @blur='close', @click.stop='handleClick' @keydown.13='handleKeyDown')
</template>

<script>
import store from '__ROOT__/store/fly-textarea';
const $ = window.$;
export default {
  data(){
    return store.state
  },
  watch:{
    open(val){
      //console.log('new: %s, old: %s', val, oldVal)
      if(val){
        setTimeout(() => {
          $(this.$el).focus();
        })
      }
    }
  },
  methods:{
    handleKeyDown(){
      $(this.$el).blur();
    },
    close(){
      store.commit('close');
    },
    handleClick(){
      return false;
    },
    select(){
      $(this.$el).select();
    }
  }
}
</script>
