
const $ = window.$;
const noop = () => {}

export default {
  namespaced: true,
  state: {
    handleBlur: noop,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    lineHeight: 0,
    open: false,
    value: '',
    fontSize: '',
    $el: null
  },
  mutations: {
    open (state, data) {
      console.log('flyTextarea/open')
      const $el = $(data.target);
      const offset = $el.offset();
      const lineHeight = $el.css('lineHeight');
      const fontSize = $el.css('fontSize');
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
      console.log('blur');
      state.open = false;
      state.handleBlur(state.value);
      state.handleBlur = noop;
    }
  }
}


