<template lang='jade'>
div(:tabindex="tabindex", @focusout="handleFocusout", @focusin="handleFocusin", v-on="$listeners")
  slot
</template>

<script>
import FocusableMixin from '../../lib/mixins/focusable';
export default {
  mixins: [ FocusableMixin ],
  // props: {
  //   tabindex: {
  //     type: Number,
  //     default: -1
  //   },
  //   bakLastFocusEl: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  // methods:{
  //   handleFocusin(e){
  //     if(!this.$options._is_focusenter){
  //       this.$options._is_focusenter = true;
  //       this.$emit('focusenter', e);
  //     }
  //   },
  //   handleFocusout(e){
  //     if(!document.hasFocus()){
  //       return;
  //     }
  //     if(!e.relatedTarget || !this.$el.contains(e.relatedTarget)){
  //       this.$options._is_focusenter = false;
  //       this.$emit('focusleave', e);
  //     }
  //   }
  // }
}
</script>
