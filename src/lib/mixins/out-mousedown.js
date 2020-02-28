

export default {
  mounted() {
    this.safeBind(document, 'mousedown', (e) => {
      if(!this.$el.contains(e.target)){
        this.$emit('outMousedown', e);
      }
    })
  }
};