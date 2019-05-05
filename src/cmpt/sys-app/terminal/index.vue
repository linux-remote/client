<template lang="jade">
.lr-window-body
</template>
<script>
import { composeUserWsUrl } from '../util';
export default {
  props: ['task'],
  data(){
    return {
      isRequest: false
    }
  },
  methods: {

    create(Terminal) {
      const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0;
      const $opt = this.$options;

      const term = new Terminal({
        windowsMode: isWindows
      });

      $opt.term = term;
      term.open(this.$el);
      
      // resize: 
      term.onResize((size) => {
        if (!$opt.pid) {
          return;
        }
        const cols = size.cols;
        const rows = size.rows;
        const url = '/terminals/' + $opt.pid + '/size?cols=' + cols + '&rows=' + rows;

        this.request({
          type: 'post',
          url
        });

      });

      term.fit(); 
      term.focus();

      // fit is called within a setTimeout, cols and rows need this.
      setTimeout(() => {
        this.request({
          type: 'post',
          url: `~/terminals?cols=${term.cols}&rows=${term.rows}`,

          success: (pid) => {
            $opt.pid = pid;
            const url = composeUserWsUrl(this.$route.params.username, 'terminal?pid=' + pid);
            const socket = new WebSocket(url);
            socket.onopen = this.run;
            socket.onerror = this.termOnError;
            $opt.socket = socket;
          }
        })
      }, 0);


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
      this.create(Terminal);
    })
  },
  destroyed() {
    this.$options.socket.close();
  }
}


</script>
