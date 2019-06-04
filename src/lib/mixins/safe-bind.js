

export default {
  methods: {
    safeBind(dom, key, fn, opts){
      if(dom instanceof window.Vue) {
        dom.$on(key, fn);
        this.$options._safeBindedList.push(() => {
          dom.$off(key, fn);
        });
      } else {
        dom.addEventListener(key, fn, opts);
        this.$options._safeBindedList.push(() => {
          dom.removeEventListener(key, fn, opts);
        })
      }
    }
  },
  created() {
    this.$options._safeBindedList = [];
  },
  destroyed() {
    this.$options._safeBindedList.forEach(unbind => {
      unbind();
    });
  },
};