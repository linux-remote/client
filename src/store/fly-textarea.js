import Vuex from 'vuex';
const noop = () => {}
const store = new Vuex.Store({
  state: {
    handleBlur: noop,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    open: false,
    value: ''
  },
  mutations: {
    open (state, data) {
      const $el = window.$(data.target);
      const offset = $el.offset();
      const data2 = {
        top: offset.top,
        left: offset.left,
        width: $el.width(),
        height: $el.height(),
        value: $el.text(),
        open: true,
        handleBlur : data.handleBlur
      }
      Object.assign(state, data2);
    },
    close(state){
      state.open = false;
      state.handleBlur(state.value);
      state.handleBlur = noop;
    }
  }
});

export default store;
