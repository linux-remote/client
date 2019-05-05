<template lang="jade">
.lr-window-body
  pre {{result}}
</template>

<script>
import { composeUserWsUrl } from './util';
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
    const url = composeUserWsUrl(this.$route.params.username, 'ps');
    const socket = new WebSocket(url);
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
