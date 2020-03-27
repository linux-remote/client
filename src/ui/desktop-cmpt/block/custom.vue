<template lang="jade">
Window(
  :width="width",
  :height="height",
  :top="top",
  :left="left",
  :movable="true",
  :pid="pid",
  ref="window",
  v-bind="$attrs")
  .lr-window_body(ref="body")
</template>
<script>
import Window from '../window/window.vue';

export default { // 0.356 
  components: {
    Window,
    
  },
  props: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    pid: {
      type: Number,
      required: true
    },
    cmpt: {

    },
    propsData: {
      type: Object
    }
  },
  data(){
    const width = this.width;
    const height = this.height;
    const pWindow = Window.get(this.pid);
    const top = pWindow.top + ((pWindow.height - height) / 2);
    const left = pWindow.left + ((pWindow.width - width) / 2);
    return {
      top,
      left
    }
  },
  mounted(){
    const Cmpt = window.Vue.extend(this.cmpt);
    const cmpt = new Cmpt({
      parent: this.$refs.window,
      propsData: this.propsData
    });
    cmpt.$mount();
    this.$refs.body.replaceWith(cmpt.$el);
    this.$options._bodyCmpt = cmpt;
  },
  beforeDestroy(){
    const cmpt = this.$options._bodyCmpt;
    cmpt.$el.replaceWith(this.$refs.body);
    cmpt.$destroy();
  }
}
</script>