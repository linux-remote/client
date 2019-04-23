<template lang="jade">
.lr-window-body
</template>
<script>
import { getWsOrigin } from './util';
const wsOrigin = getWsOrigin();
export default {
  props: ['task'],
  data(){
    return {
      isRequest: false,
      colAndRows: {
        cols: 87,
        rows: 26
      }
    }
  },
  methods: {
    create() {
      const $opt = this.$options;
      this.request({
        type: 'post',
        url: '~/terminals',
        data: this.colAndRows,
        success: (pid) => {
          // const socket = new WebSocket(wsOrigin + 
          //   '/api/user/' + 
          //   this.$route.params.username + 
          //   '/terminals/' + 
          //   pid);
          const socket = new WebSocket(wsOrigin + 
            '/terminal?user=dw&pid=' + pid);
          socket.onopen = this.run;
          socket.onerror = this.termOnError;
          $opt.socket = socket;
        }
      })
    },
    run() {
      const term = this.$options.term;
      term.attach(this.$options.socket);
    },
    termOnError(e) {
      this.$options.term.writeln('WebSocket connection error');
    }
  },
  mounted(){
    window.require(['/public/xterm/xterm.js', 
    '/public/xterm/addons/attach/attach.js', 
    '/public/xterm/addons/fit/fit.js'], (Terminal, attach, fit) => {
      Terminal.applyAddon(attach);
      Terminal.applyAddon(fit);
      const term = new Terminal;
      term.open(this.$el);
      term.fit();
      this.$options.term = term;
      this.create();
    })
  }
}


</script>
