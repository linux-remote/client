<template lang="jade">
textarea.lr_fly_textarea(v-show='open' , :style='{top:top + "px", left: left  + "px", width:width + "px", height: height + "px", lineHeight: lineHeight}', v-model='value', @focus='select', @blur='close', @click.stop='handleClick' @keydown.13='handleKeyDown')
</template>

<script>
import store from '__ROOT__/store/fly-textarea';
export default {
  data(){
    return store.state
  },
  watch:{
    open(val, oldVal){
      //console.log('new: %s, old: %s', val, oldVal)
      if(val){
        setTimeout(() => {
          window.$(this.$el).focus();
        })
      }
    }
  },
  methods:{
    handleKeyDown(){
      window.$(this.$el).blur();
    },
    close(){
      store.commit('close');
    },
    handleClick(){
      return false;
    },
    select(){
      window.$(this.$el).select();
    }
  },
  // mounted(){
  //   window.$(this.$el).focus();
  // }
}
</script>
