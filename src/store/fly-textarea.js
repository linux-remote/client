import Vuex from 'vuex';
import $ from 'jquery';
const noop = () => {}
const store = new Vuex.Store({
  state: {
    handleBlur: noop,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    lineHeight: 0,
    open: false,
    value: '',
    fontSize: ''
  },
  mutations: {
    open (state, data) {
      const $el = $(data.target);
      const offset = $el.offset();
      const lineHeight = $el.css('lineHeight');
      const fontSize = $el.css('fontSize');
      console.log('lineHeight', lineHeight);
      const data2 = {
        top: offset.top,
        left: offset.left,
        width: $el.width(),
        height: $el.height(),
        lineHeight,
        fontSize,
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
