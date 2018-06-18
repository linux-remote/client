<template lang="jade">
textarea.lr_fly_textarea(v-show='open' , :style='{top:top + "px", left: left  + "px", width:(value.length + 2) + "em", height: height + "px", fontSize: "13px", lineHeight: "15px"}', v-model='value', @focus='select', @blur='close', @click.stop='handleClick' @keydown.13='handleKeyDown')
</template>

<script>

const $ = window.$;
export default {
  data(){
    return this.$store.state.flyTextarea
  },
  watch:{
    open(val){
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
      this.$store.commit('flyTextarea/close');

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
