<template lang="jade">
.lr-window_body
</template>
<script>
// 742 440
// import { composeUserWsUrl } from '../util';
import map from './map.js';
import SafeBind from '../../lib/mixins/safe-bind.js';
export default {
  mixins: [SafeBind],
  inject: ['taskWindow'],
  data(){
    return {
      isRequest: false
    }
  },
  methods: {

    create({FemTerminal, FemFit, FemWebLinks}) {
      // Terminal: ƒ, AttachAddon: ƒ, FitAddon: ƒ, WebLinksAddon
      // const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0;
      const $opt = this.$options;
      const term = new FemTerminal.Terminal({
        // windowsMode: isWindows,
        /**
         * xtermjs\src\browser\renderer\dom\DomRenderer.ts
         * A fallback renderer for when canvas is slow. This is not meant to be
         * particularly fast or feature complete, more just stable and usable for when
         * canvas is not an option.
         * 
         * https://xtermjs.org/docs/guides/security/#3-websockets
         * anything coming from the terminal might contain malicious data
         * 
         */
        rendererType: 'canvas'
      });
      const fitAddon = new FemFit.FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new FemWebLinks.WebLinksAddon());
      term._fit = () => {
        fitAddon.fit();
      };
      $opt.term = term;

      term.open(this.$el);
      // this.run();
      // resize: 
      term.onResize((size) => {
        if (!$opt._termId) {
          return;
        }
        const cols = size.cols;
        const rows = size.rows;
        console.log('onResize', size);
        this.$store.commit('wsRequest', {
          method: 'termResize',
          data: {
            id: $opt._termId,
            cols,
            rows
          },
          noReply: true
        });
        // return;
        // const cols = size.cols;
        // const rows = size.rows;
        // const url = '~/terminals/' + $opt.pid + '/size?cols=' + cols + '&rows=' + rows;

        // this.request({
        //   type: 'post',
        //   url
        // });

      });

      term._fit();
      setTimeout(() => {
        term.focus();
      });
      
      if(!this.$options._termId){
        this.createServerTerm();
      } else {
        this.attach();
      }
    },
    createServerTerm(){
      const opt = this.$options;
      this.$store.commit('wsRequest', {
        method: 'termCreate',
        data: {
          cwd: opt._cwd,
          rows: opt.term.rows,
          cols: opt.term.cols
        },
        success: (id) => {
          console.log('createServerTerm', id)
          this.$options._termId = id;
          this.attach();
        }
      });
    },
    write(data){
      const term = this.$options.term;
      if(term){
        term.write(data);
      }
    },
    close(){
      this.taskWindow.close();
    },
    attach(){
      const {term, _termId} = this.$options;
      if(typeof map[_termId] === 'string'){
        term.write(map[_termId]);
      }
      if(typeof map[_termId] !== 'object'){
        map[_termId] = this;
      }

      term.onData((data) => {
        this.$store.commit('wsRequest', {
          method: 'termWrite',
          noReply: true,
          isArray: true,
          data: [2, _termId, data]
        });
      });
    },
    termOnError() {
      this.$options.term.write('WebSocket connection error');
    },
    getTerminal(cb){
      if(this.$options._amdLoaded){
        cb(this.$options._amdLoaded);
        return;
      }
      const span = document.createElement('span');
      span.style.color = '#666';
      span.innerText = 'Loading xterm.js static resources...';
      this.$el.appendChild(span);
      window.require(['xterm', 
      'xterm-addon-attach', 
      'xterm-addon-fit',
      'xterm-addon-web-links', 'xterm.css'], (FemTerminal, FemAttach, FemFit, FemWebLinks) => {
        this.$el.removeChild(span);
        // Terminal.loadAddon(attach);
        // Terminal.loadAddon(fit);
        // Terminal.loadAddon(webLinks);
        // Uncaught TypeError: Cannot read property 'Browser' of undefined
        // Terminal.loadAddon(zmodem);
        // console.log('FemTerminal', FemTerminal)
        const loaded = this.$options._amdLoaded = {
          FemTerminal, FemFit, FemWebLinks
        };
        cb(loaded);
        });
    },
    killPty(id){
      this.$store.commit('wsRequest', {
        method: 'termKill',
        data: id,
        noReply: true
      });
    }
  },
  mounted(){
    const opt = this.taskWindow.launchOption;
    this.$options._termId = opt.id;
    this.$options._cwd = opt.cwd;
    this.getTerminal((amdLoaded) => {
      this.create(amdLoaded);
    });
    this.safeBind(this.taskWindow, 'resized', () => {
      const term = this.$options.term;
      if(term){
        term._fit();
      }
    });
    this.safeBind(this.taskWindow, 'focus', () => {
      const term = this.$options.term;
      if(term){
        term.focus();
      }
    });
    this.safeBind(this.taskWindow, 'close', (e) => {
      const id = this.$options._termId;
      if(id && map[id]){
        e.preventDefault();
        this.killPty(id);
      }
    });
  },
  destroyed() {
    // this.$options.socket.close();
    this.$options._amdLoaded = null;
  }
}


</script>
