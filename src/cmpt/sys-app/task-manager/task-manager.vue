<template lang="jade">
.lr-window-body.lr-tm-wrap
  .lr-hourglass(v-if='isDeling')
  table.lr-tm-table(v-if="total")
    tbody
      tr
        td(style="width: 33%")
          span.lr-tm-span up: 
          | {{total.up}}
        td(style="width: 34%")
          span.lr-tm-span loadAverage: 
          | {{total.loadAverage}}
        td(style="width: 33%") 
          span.lr-tm-span users: 
          | {{total.users}}
      tr
        td
          .lr-tm-cpus
            label 
              span.lr-tm-span cpus:
              br
              | {{cpusPer.toFixed(1)}}%
            .lr-tm-cpu-process
              .lr-tm-cpu-process-bar(:style="{height: cpusPer + '%'}")

        td(colspan='2')
          .lr-tm-mems-wrap
            .lr-tm-mems(v-if="total.mem_avail")
              span.lr-tm-span Avail:
              .lr-tm-porcess-sm.lr-tm-avail-porcess
                .lr-tm-porcess-bar(:style="{width: availPer + '%'}")
                .lr-tm-porcess-info(style="text-align: right") {{total.mem_avail | wellSize}}
            .lr-tm-mems
              span.lr-tm-mem-title Mem: {{memsPer.toFixed(1)}}%
              .lr-tm-porcess
                .lr-tm-porcess-bar(:style="{width: memsPer + '%'}", title="used") 
                .lr-tm-porcess-bar.lr-tm-mem-bc-bg(:style="{width: memBCPer + '%'}", title="buff/cache")
                .lr-tm-porcess-info2 {{total.mem.used | wellSize}}/{{total.mem.total | wellSize}}
            .lr-tm-mems
              span.lr-tm-span Swap:
              .lr-tm-porcess-sm.lr-tm-swap-porcess
                .lr-tm-porcess-bar(:style="{width: swapPer + '%'}")
                .lr-tm-porcess-info
                  span {{total.swap.used | wellSize}}
                  span /{{total.swap.total | wellSize}}
      tr
        td(colspan='3')
          .lr-tm-tasks
            div 
              b Tasks 
              span.lr-tm-span total: 
              | {{total.tasks.total}} 
            div 
              span.lr-tm-span running: 
              | {{total.tasks.running}} 
            div 
              span.lr-tm-span sleeping: 
              | {{total.tasks.sleeping}} 
            div 
              span.lr-tm-span stopped: 
              | {{total.tasks.stopped}}  
            div 
              span.lr-tm-span zombie: 
              | {{total.tasks.zombie}}

  //- div {{JSON.stringify(total, null, '\t')}}
  //- pre.lr-tm-pre {{list}}
  .lr-tm-list(:class="'lr_tm_sort_' + sortType")
    table
      thead
        tr
          th(v-for="v in keys", :key="v", :class="{lr_tm_active: v === sortKey}", @click="sortBy(v)") {{v}}
      tbody
        Item(v-for="v in list", :key="v.pid", :v="v", @click="handleItemClick(v)", :class="{lr_tm_active: v.pid === selectedPid}", @kill="handleItemKill")
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
      sortType: 'asc',
      
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
      isDeling: false
    }
  },

  methods: {
    handleItemKill(pid){
      this.request({
        url: '~/ps/kill/' + pid,
        type: 'delete',
        stateKey: 'isDeling',
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
    sortBy(key, isNotTogger) {
      if(key === this.sortKey && !isNotTogger){
        this.sortType = this.sortType === 'desc' ? 'asc' : 'desc';
      } else {
        this.sortKey = key;
        let defKey = 'asc';
        if(key === 'CPU' || key === 'Memory' || key === 'Time'){
          defKey = 'desc';
        }
        this.sortType = defKey;
      }

      this._sort();
    },
    _sort(){
      let key = this.sortKey;
      if(key === 'Memory'){
        key = 'mem';
      }
      key = key.toLowerCase();
      let isAsc = this.sortType === 'asc';
      switch(key) {
        case 'pid':
          return sortByNumberKey(this.list, key, isAsc);
        case 'cpu':
        case 'mem':
          return sortByNumberKey(this.list, key, isAsc);
        case 'time':
          return sortByNumberKey(this.list, 'sTime', isAsc); 
        default: 
          return sortByStrKey(this.list, key, isAsc); 
      }
    },
    setResult(data) {
      const result = parse(data.toString());
      this.forMatList(result.list);
      this.list = result.list;
      this._sort();
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
      let memBCPer = total.mem['buff/cache'] / total.mem.total;
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
