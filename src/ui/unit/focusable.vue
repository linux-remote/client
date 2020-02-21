<template lang='jade'>
div(:tabindex="tabIndex",  @focusout="handleFocusout", @focusin="handleFocusin", v-on="$listeners")
  slot
</template>

<script>
import MixinEnterBindBtn from '__ROOT__/lib/mixins/enter-bind-last-focused-btn.js';
export default {
  mixins: [ MixinEnterBindBtn ],
  props: {
    tabIndex: {
      type: Number,
      default: -1
    }
  },
  methods:{
    handleFocusin(e){
      if(!this.$options._is_focusenter){
        this.$options._is_focusenter = true;
        this.$emit('focusenter', e);
      }
    },
    handleFocusout(e){
      if(!e.relatedTarget || !this.$el.contains(e.relatedTarget)){
        this.$options._is_focusenter = false;
        this.$emit('focusleave', e);
      }
    }
  }
}
</script>
