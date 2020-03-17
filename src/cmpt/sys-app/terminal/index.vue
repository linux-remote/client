<template lang="jade">
.lr-window-body
</template>
<script>
// 742 440
let _Terminal_cache;
import { composeUserWsUrl } from '../util';
import SafeBind from '../../../lib/mixins/safe-bind.js';
export default {
  mixins: [SafeBind],
  inject: ['taskWindow'],
  data(){
    return {
      isRequest: false
    }
  },
  methods: {

    create(Terminal) {
      const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0;
      const $opt = this.$options;
      const addons = $opt._addons;
      const term = new Terminal({
        windowsMode: isWindows
      });
      const fitAddon = new addons.Fit();
      term.loadAddon(fitAddon);
      term.loadAddon(new addons.WebLinks());
      term._fit = () => {
        fitAddon.fit();
      };
      $opt.term = term;

      term.open(this.$el);
      this.run();
      // resize: 
      term.onResize((size) => {
        if (!$opt.pid) {
          return;
        }
        return;
        const cols = size.cols;
        const rows = size.rows;
        const url = '~/terminals/' + $opt.pid + '/size?cols=' + cols + '&rows=' + rows;

        this.request({
          type: 'post',
          url
        });

      });

      term._fit();
      term.focus();
      return;
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
      term.write('Create success!');
      // term.attach(this.$options.socket);
    },
    termOnError() {
      this.$options.term.write('WebSocket connection error');
    },
    getTerminal(cb){
      if(_Terminal_cache){
        return cb(_Terminal_cache);
      }
      const span = document.createElement('span');
      span.style.color = '#666';
      span.innerText = 'Loading xterm.js static resources...';
      this.$el.appendChild(span);
      window.require(['xterm', 
      'xterm-addon-attach', 
      'xterm-addon-fit',
      'xterm-addon-web-links', 'xterm.css'], (Terminal, attach, Fit, WebLinks) => {
        this.$el.removeChild(span);
        // Terminal.loadAddon(attach);
        // Terminal.loadAddon(fit);
        // Terminal.loadAddon(webLinks);
        this.$options._addons = {
          attach, Fit, WebLinks
        };
        // Uncaught TypeError: Cannot read property 'Browser' of undefined
        // Terminal.loadAddon(zmodem);
        _Terminal_cache = Terminal;
        cb(Terminal);
        });
    }
  },
  mounted(){
    this.getTerminal((Terminal) => {
      this.create(Terminal);
    });
    this.safeBind(this.taskWindow, () => {
      const term = this.$options.term;
      if(term){
        term._fit();
      }
    })
  },
  destroyed() {
    // this.$options.socket.close();
  }
}


</script>
