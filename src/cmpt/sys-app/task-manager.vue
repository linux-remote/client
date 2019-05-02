<template lang="jade">
.lr-window-body
  pre {{result}}
</template>

<script>
export default {
  data(){
    return {
      isRequest: false,
      result: '',
      interval: 1000
    }
  },

  methods: {
    getData(cb) {
      // this.result = '';
      this.request({
        url: '~/ps',
        success(data) {
          this.result = data;
          cb();
        }
      })
    },
    loop() {
      this.$options.timer = null;
      this.getData(() => {
        this.$options.timer = setTimeout(() => {
          this.loop();
        }, this.interval);
      })
    }
  },

  created(){
    this.loop();
  },
  destroyed() {
    if(this.$options.timer) {
      clearTimeout(this.$options.timer);
    }
  }
}
</script>
