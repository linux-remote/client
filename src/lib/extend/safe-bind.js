

export default window.Vue.extend({
  methods: {
    safeBind(dom, key, fn, opts){
      dom.addEventListener(key, fn, opts);
      this.$options._selfBindList.push(() => {
        dom.removeEventListener(key, fn, opts);
      })
    }
  },
  _selfBindList: [],
  destroyed() {
    this.$options._selfBindList.forEach(unbind => {
      unbind();
    })
  },
});