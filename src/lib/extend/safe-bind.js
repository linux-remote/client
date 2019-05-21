

export default window.Vue.extend({
  methods: {
    safeBind(dom, key, fn, opts){
      dom.addEventListener(key, fn, opts);
      this.$options._safeBindedList.push(() => {
        dom.removeEventListener(key, fn, opts);
      })
    }
  },
  _safeBindedList: [],
  destroyed() {
    this.$options._safeBindedList.forEach(unbind => {
      unbind();
    })
  },
});