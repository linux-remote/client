<template lang="jade">
.lr-window-body
  table
    tbody
      tr
        td up: {{total.up}}
        td(style="width: 33%") loadAverage: {{total.loadAverage}}
        td users: {{total.users}}
      tr
        td
          .progress.lr-progress
            .progress-bar(:style="{width: cpusPer + '%'}")  cpus
        td
          .progress.lr-progress
            .progress-bar(:style="{width: memsPer + '%'}")  mem
        td
          .progress.lr-progress
            .progress-bar(:style="{width: swapPer + '%'}")  swap
      tr
        td(colspan='3') tasks: {{total.tasks.total}} running: {{total.tasks.running}} sleeping: {{total.tasks.sleeping}} stopped: {{total.tasks.stopped}}  zombie: {{total.tasks.zombie}}

  div {{JSON.stringify(total, null, '\t')}}
  //- pre.lr-tm-pre {{list}}
  table.table.table-hover
    thead
      tr
        th PID
        th User
        th CPU
        th Memory
        th Time
        th Command
    tbody
      tr(v-for="v in list", :key="v.pid")
        td {{v.pid}}
        td {{v.user}}
        td {{v.cpu}}%
        td {{v.mem}}%
        td {{v.time}}
        td {{v.command}}
</template>

<script>
import { composeUserWsUrl } from '../util';
import { parse } from './parse';
export default {
  data(){
    return {
      isRequest: false,
      total: '',
      list: '',
      interval: 1000,
      cpusPer: 0,
      memsPer: 0,
      totalMem2: 0,
      swapPer: 0,
    }
  },

  methods: {
    sortByNumberKey(key){
      this.list.sort((a, b) => {
        return b[key] - a[key];
      });
    },
    setResult(data) {
      const result = parse(data.toString());
      this.list = result.list;

      const total = result.total;
      this.total = total;
      let cpusPer = total.cpus.us + total.cpus.sy;
      // cpusPer = Math.floor(cpusPer);
      this.cpusPer = cpusPer;

      let memsPer = total.mem.used / total.mem.total;
      memsPer = memsPer * 100;
      this.memsPer = memsPer;
      
      let swapPer = total.swap.used / total.swap.total;
      this.swapPer = swapPer * 100;
    }
  },
  created(){
    const url = composeUserWsUrl(this.$route.params.username, 'ps');
    const socket = new WebSocket(url);
    window.require(['/public/js/pako_inflate.min.js'], (pako) => {
      // socket.binaryType = "arraybuffer";
      socket.onmessage = (e) => {

        // https://stackoverflow.com/questions/38632849
        var reader = new FileReader();
        reader.onload = (event) => {
            var result = pako.inflate(event.target.result, { to: 'string' });
            this.setResult(result);
        }
        reader.readAsArrayBuffer(e.data);
      };
    });
    
    this.$options.socket = socket;
  },
  destroyed() {
    this.$options.socket.close();
  }
}
</script>
