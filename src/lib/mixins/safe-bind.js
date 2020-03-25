
const Vue = window.Vue;

export default {
  methods: {
    safeBind(dom, key, fn, opts){
      const _map = this.$options._safeBindedMap;
      const index = this.$options._safeBindIndex;
      this.$options._safeBindIndex = index + 1;

      if(dom instanceof Vue) {
        // Vue Simple event
        dom.$on(key, fn);
        _map[index] = () => {
          dom.$off(key, fn);
        }

      } else {
        if(opts && opts.once === true){
          // Once model:
          const fn2 = (e) => {
            delete(_map[index]);
            fn(e);
          }
          dom.addEventListener(key, fn2, opts);
          _map[index] = () => {
            dom.removeEventListener(key, fn2, opts);
          }

        } else {

          dom.addEventListener(key, fn, opts);
          _map[index] = () => {
            dom.removeEventListener(key, fn, opts);
          }

        }
      }
    }
  },
  created() {
    this.$options_safeBindIndex = 1;
    this.$options._safeBindedMap = Object.create(null);
  },
  destroyed() {
    const _map = this.$options._safeBindedMap;
    let i;
    
    for(i in _map){
      _map[i]();
    }
  },
};
