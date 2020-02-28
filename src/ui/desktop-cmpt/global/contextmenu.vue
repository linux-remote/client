<template lang="jade">
.lr-contextmenu(:style='{top: y + "px", left: x + "px"}', @contextmenu.prevent)
  slot
</template>

<script>
import MixinSafeBind from '../../../lib/mixins/safe-bind.js';
import MixinOutMousedown from '../../../lib/mixins/out-mousedown.js';
export default {
  mixins: [MixinSafeBind, MixinOutMousedown],
  props: {
    clientX: {
      type: Number,
      required: true
    },
    clientY: {
      type: Number,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data(){
    return {
      x: -999999,
      y: -999999
    }
  },

  mounted(){
    document.getElementById('lr-global').appendChild(this.$el);
    // this.$root.$el.appendChild(this.$el);
    
    const height = this.$el.offsetHeight;
    const width = this.$el.offsetWidth;
    let x = this.clientX;
    let y = this.clientY;

    if(x + width > this.$store.state.winW){
      x = this.$store.state.winW - width;
    }
    if(y + height > this.$store.state.winH){
      y = this.$store.state.winH - height;
    }

    this.x = x;
    this.y = y;
    this.$el.style.width = 0 + 'px';
    this.$el.style.height = 0 + 'px';
    this.$el.style.visibility = 'visible';
    this.$el.style.transition = 'width .15s linear, height .15s linear';
    setTimeout(() => {
      this.$el.style.width = width + 'px';
      this.$el.style.height = height + 'px';
    });

    this.$on('outMousedown', () => {
      this.close();
    });
  },
  destroyed(){
    if(this.$parent._isBeingDestroyed){
      document.getElementById('lr-global').removeChild(this.$el);
    }
  }
}
</script>
