<template lang="jade">
.lr-window-body
  .lr-hourglass(v-if='isRequest')
  table.lr-tm-table(v-if="total")
    tbody
      tr
        td(style="width: 33%")
          span up: 
          | {{total.up}}
        td(style="width: 34%")
          span loadAverage: 
          | {{total.loadAverage}}
        td(style="width: 33%") 
          span users: 
          | {{total.users}}
      tr
        td
          .lr-tm-cpus
            label 
              span cpus:
              br
              | {{cpusPer.toFixed(1) + '%'}}
            .lr-tm-cpu-process
              .lr-tm-cpu-process-bar(:style="{height: cpusPer + '%'}")  
        td(colspan='2')
          .lr-tm-mems-wrap
            .lr-tm-mems(v-if="total.mem_avail")
              span avail:
              .lr-tm-porcess.lr-tm-avail-porcess
                .lr-tm-porcess-bar(:style="{width: availPer + '%'}")
                .lr-tm-porcess-info {{total.mem_avail | wellSize}}
            .lr-tm-mems
              span mem:
              .lr-tm-porcess
                .lr-tm-porcess-bar(:style="{width: memsPer + '%'}", title="used") {{memsPer.toFixed(0)}}%
                .lr-tm-porcess-bar.lr-tm-mem-bc-bg(:style="{width: memBCPer + '%'}", title="buff/cache") {{memBCPer.toFixed(0)}}%
            .lr-tm-mems
              span swap:
              .lr-tm-porcess
                .lr-tm-porcess-bar(:style="{width: swapPer + '%'}")
                .lr-tm-porcess-info {{total.swap.used | wellSize}}/{{total.swap.total | wellSize}}
      tr
        td(colspan='3')
          .lr-tm-tasks
            div 
              span tasks: 
              | {{total.tasks.total}} 
            div 
              span running: 
              | {{total.tasks.running}} 
            div 
              span sleeping: 
              | {{total.tasks.sleeping}} 
            div 
              span stopped: 
              | {{total.tasks.stopped}}  
            div 
              span zombie: 
              | {{total.tasks.zombie}}

  //- div {{JSON.stringify(total, null, '\t')}}
  //- pre.lr-tm-pre {{list}}
  table.table.table-hover.lr-tm-list
    thead
      tr
        th(v-for="v in keys", :key="v", :class="{active: v === sortKey}", @click="sortBy(v)") {{v}}
    tbody
      Item(v-for="v in list", :key="v.pid", :v="v", @click="handleItemClick(v)", :class="{active: v.pid === selectedPid}", @kill="handleItemKill")
</template>

<script>
import { composeUserWsUrl, sortByNumberKey, sortByStrKey } from '../util';
import { parse } from './parse';
import Item from './item.vue';
export default {
  components: {
    Item
  },
  data(){
    return {
      keys: ['PID', 'User', 'CPU', 'Memory', 'Time', 'Command'],
      sortKey: 'CPU',
      isRequest: false,
      total: null,
      list: [],
      interval: 1000,
      cpusPer: 0,
      memsPer: 0,
      totalMem2: 0,
      swapPer: 0,
      availPer: 0,
      memBCPer: 0,
      selectedPid : null,
      isRequest: false
    }
  },

  methods: {
    handleItemKill(pid){
      this.request({
        url: '~/ps/kill/' + pid,
        type: 'delete',
        stateKey: 'isRequest',
        success() {
          if(this.selectedPid === pid){
            this.selectedPid = null;
          }
          const index = this.list.findIndex((v) => v.pid === pid);
          if(index !== -1){
            this.list.splice(index, 1);
          }
        }
      });
    },
    handleItemClick(v){
      this.selectedPid = v.pid;
    },
    sortBy(key) {

      this.sortKey = key;
      this.sort();
    },
    sort(){
      let key = this.sortKey;
      if(key === 'Memory'){
        key = 'mem';
      }
      key = key.toLowerCase();
      switch(key) {
        case 'pid':
          return sortByNumberKey(this.list, key, true);
        case 'cpu':
        case 'mem':
          return sortByNumberKey(this.list, key);
        case 'time':
          return sortByNumberKey(this.list, 'sTime'); 
        default: 
          return sortByStrKey(this.list, key); 
      }
    },
    setResult(data) {
      const result = parse(data.toString());
      this.forMatList(result.list);
      this.list = result.list;
      this.sort();
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

      let memBCPer = total.mem['buff/cache'] / total.swap.total;
      this.memBCPer = memBCPer * 100;

      if(total.mem_avail){
        let availPer = total.mem_avail / total.mem.total;
        this.availPer = availPer * 100;
      }

    },
    
    forMatList(list){
      list.forEach(v => {
        let time = v.time;
        time = time.split(':');
        v.sTime = Number(time[0]) * 60 + Number(time[1]);
      })
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
