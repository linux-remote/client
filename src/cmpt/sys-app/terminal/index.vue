<template lang="jade">
.lr-window-body
</template>
<script>
// 742 440
let _Terminal_cache;
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
      term.on('resize', (size) => {
        if (!$opt.pid) {
          return;
        }
        const cols = size.cols;
        const rows = size.rows;
        const url = '~/terminals/' + $opt.pid + '/size?cols=' + cols + '&rows=' + rows;

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

      this.$on('resized', () => {
        this.$nextTick(() => {
          term.fit();
        })

      });
    },
    run() {
      const term = this.$options.term;
      term.attach(this.$options.socket);
    },
    termOnError() {
      this.$options.term.writeln('WebSocket connection error');
    },
    getTerminal(cb){
      if(_Terminal_cache){
        return cb(_Terminal_cache);
      }
      window.require(['/public/xterm/3.13.1/xterm.min.js', 
      '/public/xterm/3.13.1/addons/attach/attach.min.js', 
      '/public/xterm/3.13.1/addons/fit/fit.min.js',
      '/public/xterm/3.13.1/addons/webLinks/webLinks.min.js'], (Terminal, attach, fit, webLinks) => {
        Terminal.applyAddon(attach);
        Terminal.applyAddon(fit);
        Terminal.applyAddon(webLinks);
        // Uncaught TypeError: Cannot read property 'Browser' of undefined
        // Terminal.applyAddon(zmodem);
        _Terminal_cache = Terminal;
        cb(Terminal);
        });
    }
  },
  mounted(){
    this.getTerminal((Terminal) => {
      this.create(Terminal);
    });
  },
  destroyed() {
    this.$options.socket.close();
  }
}


</script>
