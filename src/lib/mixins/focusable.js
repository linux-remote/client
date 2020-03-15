

export default {
  props: {
    tabindex: {
      type: Number,
      default: -1
    },
    enterBindBtn: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      isFocusEnter: false
    }
  },
  methods: {
    handleFocusin(e){
      if(!this.isFocusEnter){
        this.isFocusEnter = true;
        this.onFocusenter(e);
      }
    },
    handleFocusout(e){
      if(!document.hasFocus()){
        return;
      }
      if(!e.relatedTarget || !this.$el.contains(e.relatedTarget)){
        this.isFocusEnter = false;
        this.onFocusleave(e);
      }
    },
    enterBindBtnSet(el){
      const lastFocused = this.$options._last_focused;
      lastFocused.el = el;
      let btn = lastFocused.btn;
      if(btn && btn[0] === el){
        return;
      }
      if(btn){
        btn.removeClass('lr__focus');
      }
      btn = window.$(el);
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
  enterBindHandleKeydown(e){
    const lastFocused = this.$options._last_focused;
      if(lastFocused.btn && lastFocused.btn.hasClass('lr__focus')){
        setTimeout(() => {
          lastFocused.btn.click();
        });
        e.stopPropagation();
      }
  },
  enterBindHandleFocusIn(e){
      const lastFocused = this.$options._last_focused;
      if(lastFocused.el === e.target){
        return;
      }
      if(e.target.tagName === 'BUTTON'){
        this.enterBindBtnSet(e.target);
      } else {
        if(lastFocused.btn){
          if(e.target.tagName !== 'TEXTAREA' && e.target.contentEditable !== 'true'){
            lastFocused.btn.addClass('lr__focus');
          } else {
            lastFocused.btn.removeClass('lr__focus');
          }
        }
        this.$options._last_focused.el = e.target;
      }
  },
  enterBindHandleFocus(){
    const lastFocused = this.$options._last_focused;
    if(lastFocused.el){
      lastFocused.el.focus();
    }
  }
  },
  mounted() {

    this.$el.tabindex = this.tabindex;
    this.$el.addEventListener('focusin', (e) => {
      this.handleFocusin(e);
    });
    this.$el.addEventListener('focusout', (e) => {
      this.handleFocusout(e);
    });

    if(this.enterBindBtn){
      this.$options._last_focused = Object.create(null);

      this.$el.addEventListener('focusin', (e) => {
        this.enterBindHandleFocusIn(e);
      });
      this.$el.addEventListener('focus', (e) => {
        this.enterBindHandleFocus(e);
      });
      this.$el.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
          this.enterBindHandleKeydown(e);
        }
      });
    }
  },
  destroyed() {
    if(this.enterBindBtn){
      this.$options._last_focused = null;
    }
  },
};
