

export default {
  methods: {
    setEnterBindBtn(el){
      let btn = this.$options._last_focused_btn;
      if(btn && btn[0] === el){
        return;
      }
      if(btn){
        btn.removeClass('lr__focus');
      }
      btn = window.$(el);
      this.$options._last_focused_btn = btn;
      btn.addClass('lr__focus');
    },
    removeEnterBindBtn(){
      if(this.$options._last_focused_btn){
        this.$options._last_focused_btn.removeClass('lr__focus');
        this.$options._last_focused_btn = null;
      }
    }
  },
  mounted() {
    this.$el.addEventListener('focusin', (e) => {
      if(e.target.tagName === 'BUTTON'){
        this.setEnterBindBtn(e.target);
      }
    });
    this.$el.addEventListener('keydown', (e) => {
      if(this.$options._last_focused_btn && e.key === 'Enter'){
        this.$options._last_focused_btn.click();
      }
    });
  },
  destroyed() {
    if(this.$options._last_focused_btn){
      this.$options._last_focused_btn = null;
    }
  },
};
