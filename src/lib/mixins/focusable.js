

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
    isBakLastFocus: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      isFocusenter: false
    }
  },
  methods: {
      handleFocusin(e){

        // senior
        const lastFocused = this.$options._last_focused;
        const oldEl = lastFocused.el;
        if(oldEl !== e.target){
          lastFocused.el = e.target;
          if(this.enterBindBtn){
            this.enterBindHandleFocusIn(e, lastFocused);
          }
        }

        if(!this.isFocusenter){
          this.isFocusenter = true;
          this.$emit('focusenter', e);
          if(this.isBakLastFocus){
            this.bakLastFocusElFocusEnter(oldEl);
          }
        }

      },
      handleFocusout(e){
        if(!document.hasFocus()){
          return;
        }
        if(!e.relatedTarget || !this.$el.contains(e.relatedTarget)){
          this.isFocusenter = false;
          this.$emit('focusleave', e);
          if(this.isBakLastFocus){
            this.bakLastFocusElFocusLeave();
          }
        }
      },
      focusenter(){
        const lastFocused = this.$options._last_focused;
        if(lastFocused && lastFocused.el){
          lastFocused.el.focus();
        } else {
          this.$el.focus();
        }
      },
      focusleave(){
        const lastFocused = this.$options._last_focused;
        if(lastFocused.el){
          lastFocused.el.blur();
        } else {
          this.$el.blur();
        }
      },
      // onFocusenter(){

      // },
      // onFocusleave(){

      // },
      setEnterBindBtn(btnEl){
        this.$options._last_focused.btnEl = btnEl;
        this._setEnterBindBtn();
      },
      _setEnterBindBtn(){
        const lastFocused = this.$options._last_focused;
        if(!lastFocused.btnEl){
          lastFocused.btnEl = lastFocused.el;
        }
        let btn = lastFocused.btn;
        if(btn && btn[0] === lastFocused.btnEl){
          return;
        }
        if(btn){
          btn.removeClass('lr__focus');
        }
        btn = window.$(lastFocused.btnEl);
        btn.addClass('lr__focus');
        lastFocused.btn = btn;
      },
    // removeEnterBindBtn(){
    //   const lastFocused = this.$options._last_focused;
    //   if(lastFocused.btn){
    //     lastFocused.btn.removeClass('lr__focus');
    //     lastFocused.btn = null;
    //   }
    // },
    enterBindHandleKeydown(){
      const lastFocused = this.$options._last_focused;
        if(lastFocused.btn && lastFocused.btn.hasClass('lr__focus')){
          setTimeout(() => {
            lastFocused.btn.click();
          });
          // e.stopPropagation();
        }
    },
    enterBindHandleFocusIn(e, lastFocused){
        if(e.target.tagName === 'BUTTON'){
          this._setEnterBindBtn();
        } else {
          if(lastFocused.btn){
            if(e.target.tagName !== 'TEXTAREA' && e.target.contentEditable !== 'true'){
              lastFocused.btn.addClass('lr__focus');
            } else {
              lastFocused.btn.removeClass('lr__focus');
            }
          }
          
        }
    },

    bakLastFocusElFocusEnter(oldEl){
      window.$(oldEl).removeClass('lr__last_focused_bak');
    },
    bakLastFocusElFocusLeave(){
      const lastFocused = this.$options._last_focused;
      window.$(lastFocused.el).addClass('lr__last_focused_bak');

    }
  },
  mounted() {
    const $el = this.$el;
    $el.tabindex = this.tabindex;
    this.$options._last_focused = Object.create(null);

    $el.addEventListener('focusin', (e) => {
      this.handleFocusin(e);
    });
    $el.addEventListener('focusout', (e) => {
      this.handleFocusout(e);
    });

    if(this.enterBindBtn){
      $el.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
          this.enterBindHandleKeydown(e);
        }
      });
    }

  },
  destroyed() {
    if(this.$options._last_focused){
      this.$options._last_focused = null;
    }
  },
};
