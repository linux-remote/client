
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
    fontSize: ''
  },
  mutations: {
    open (state, data) {
      const $dom = $(data.target);
      const offset = $dom.offset();
      const lineHeight = $dom.css('lineHeight');
      const fontSize = $dom.css('fontSize');
      const data2 = {
        top: offset.top,
        left: offset.left,
        width: $dom.width(),
        height: $dom.height(),
        lineHeight,
        fontSize,
        value: $dom.text(),
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
}


