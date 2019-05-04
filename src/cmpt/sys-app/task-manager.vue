<template lang="jade">
.lr-window-body
  pre {{result}}
</template>

<script>
import { getWsOrigin } from './util';
const wsOrigin = getWsOrigin();
export default {
  data(){
    return {
      isRequest: false,
      result: '',
      interval: 1000
    }
  },

  methods: {
  },
  created(){
    const socket = new WebSocket(wsOrigin + 
              '/ps?user=' + this.$route.params.username);
    socket.onmessage = (e) => {
      this.result = e.data;
    };
    this.$options.socket = socket;
  },
  destroyed() {
    this.$options.socket.close();
  }
}
</script>
