

export default {
  props: {
    tabindex: {
      type: String,
      default: '-1'
    },
    enterBindBtn: {
      type: Boolean,
      default: false
    },
    // isBakLastFocus: {
    //   type: Boolean,
    //   default: true
    // }
  },
  data(){
    return {
      isFocusenter: false
    }
  },
  methods: {
      handleFocusin(e){

        // senior
        const oldEl = this.$options._last_focused_el;
        if(oldEl !== e.target){
          this.$options._last_focused_el = e.target;
        }

        if(!this.isFocusenter){
          this.isFocusenter = true;
          this.onFocusenter();
          this.$emit('focusenter', e);
          // if(this.isBakLastFocus){
          this.bakLastFocusElFocusEnter(oldEl);
          // }
        }

      },
      handleFocusout(e){
        if(!document.hasFocus()){
          return;
        }
        if(!e.relatedTarget || !this.$el.contains(e.relatedTarget)){
          this.isFocusenter = false;
          this.$emit('focusleave', e);
          // if(this.isBakLastFocus){
          this.bakLastFocusElFocusLeave();
          // }
        }
      },
      focusenter(){
        const lastFocusedEl = this.$options._last_focused_el;
        if(lastFocusedEl){
          lastFocusedEl.focus();
        } else {
          this.$el.focus();
        }
      },
      focusleave(){
        const lastFocusedEl = this.$options._last_focused_el;
        if(lastFocusedEl){
          lastFocusedEl.blur();
        } else {
          this.$el.blur();
        }
      },
      // onFocusenter(){

      // },
      // onFocusleave(){

      // },
    setEnterBindBtn(btnEl){
      const oldBtnEl = this.$options._enter_bind_btn_el;
      if(oldBtnEl === btnEl){
        return;
      }
      window.$(oldBtnEl).removeClass('lr__focus');
      window.$(btnEl).addClass('lr__focus');
      this.$options._enter_bind_btn_el = btnEl;
    },

    enterBindHandleKeydown(){
      const btnEl = this.$options._enter_bind_btn_el;
        if(btnEl){
          const $btnEl = window.$(btnEl);
          if($btnEl.hasClass('lr__focus')){
            setTimeout(() => {
              window.$(btnEl).click();
            });
          }
        }
    },
    enterBindHandleFocusIn(e){
        if(e.target.tagName === 'BUTTON'){
          this.setEnterBindBtn(e.target);
        } else {
          let btnEl = this.$options._enter_bind_btn_el;
          if(btnEl){
            if(e.target.tagName !== 'TEXTAREA' && e.target.contentEditable !== 'true'){
              window.$(btnEl).addClass('lr__focus');
            } else {
              window.$(btnEl).removeClass('lr__focus');
            }
          }
        }
    },

    bakLastFocusElFocusEnter(oldEl){
      window.$(oldEl).removeClass('lr__last_focused_bak');
    },
    bakLastFocusElFocusLeave(){
      const lastFocusedEl = this.$options._last_focused_el;
      if(lastFocusedEl){
        window.$(lastFocusedEl).addClass('lr__last_focused_bak');
      }
    }
  },
  mounted() {
    const $el = this.$el;
    $el.tabindex = this.tabindex;

    $el.addEventListener('focusin', (e) => {
      this.handleFocusin(e);
    });
    $el.addEventListener('focusout', (e) => {
      this.handleFocusout(e);
    });

    if(this.enterBindBtn){
      $el.addEventListener('focusin', (e) => {
        this.enterBindHandleFocusIn(e);
      });
      $el.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
          this.enterBindHandleKeydown(e);
        }
      });
    }
  },
  destroyed() {
    if(this.$options._last_focused_el){
      this.$options._last_focused_el = null;
    }
    if(this.$options._enter_bind_btn_el){
      this.$options._enter_bind_btn_el = null;
    }
  }
};
