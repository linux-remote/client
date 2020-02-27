<style>
.lr-focus{
  width: 55px;
  height: 22px;
  flex-shrink: 0;
}
.lr-focus-btn{
  height: 100%;
  width: 100%;
  line-height: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 11px;
}

.lr-focus-menu{
  position: absolute;
  left: 2px;
  bottom: 24px;
  width: 176px;
  height: 300px;
  z-index: 2;
}
</style>
<template lang="jade">
Focusable(tabindex="-1", @focusleave="handleBlur", :class="cssBase")
  div(:class="{[cssBase + '-btn']: true, lr__focus: isFocus}", @mousedown.left="handleBtnMousedown")
    slot(name="btn")
  transition(name="fade" mode="out-in" appear)
    div(:class="cssBase + '-menu'", ref="menu", style="display: none;")
      slot(name="menu")
</template>
<script>
import Focusable from '../../unit/focusable.vue';
export default {
  components: {
    Focusable
  },
  props: {
    cssBase: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      isFocus: false
    }
  },
  methods: {
    handleBtnMousedown(){
      if(!this.isFocus){
        this.showMenu();
      } else {
        this.hideMenu();
      }
    },
    handleBlur(){
      this.hideMenu();
    },
    showMenu(){
      this.isFocus = true;
      const $dom = window.$(this.$refs.menu);
      $dom.slideDown({
        duration : 200,
        easing : 'linear'
      });
      $dom.focus();
    },
    hideMenu(){
      this.isFocus = false;
      window.$(this.$refs.menu).hide();
    }
  }
}
</script>