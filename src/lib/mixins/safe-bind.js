
const Vue = window.Vue;

export default {
  methods: {
    safeBind(dom, key, fn, opts){
      const _map = this.$options._safeBindedMap;
      const index = this.$options._safeBindIndex;
      this.$options._safeBindIndex = index + 1;

      if(dom instanceof Vue) {
        // Vue Simple event
        if(!opts){
          dom.$on(key, fn);
          _map[index] = () => {
            dom.$off(key, fn);
          }
        } else {
          // once
          const vuefn2 = (e) => {
            delete(_map[index]);
            fn(e);
          }
          dom.$once(key, vuefn2);
          _map[index] = () => {
            dom.$off(key, vuefn2);
          }

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
    this.$options._safeBindIndex = 1;
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
