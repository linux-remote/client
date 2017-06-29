<template lang="jade">
.lr-window-body(style='user-select:text')
  //-.lr-hourglass(v-show='isRequest')

  table.lr-computer-table(v-if='platform')
    tr
      td(style='color:gray') platform:
      td {{platform}}
    tr
      td(style='color:gray') hostname:
      td {{hostname}}
    tr
      td(style='color:gray') arch:
      td {{arch}}
    tr
      td(style='color:gray') release:
      td {{release}}
    tr
      td(style='color:gray') issue:
      td {{issue}}
    tr
      td(style='color:gray') totalmem:
      td {{wellTotalMem}}
    tr
      td(style='color:gray') uptime:
      td {{wellUptime}}
    tr
      td(style='color:gray') loadavg:
      td {{loadavg.join(' , ')}}
    tr
      td(style='color:gray') endianness:
      td {{endianness}}
    tr
      td(style='color:gray') cpus:
      td
        p(v-for="v in cpus") {{v.model}}
    tr
      td(style='color:gray') networkInterfaces:
      td
        table.leftHead
          tr(v-for="(v, k) in networkInterfaces")
            td {{k}}:
            td
              table.lr-small-table
                tr
                 th(v-for='n in netThKeys') {{n}}
                tr(v-for='v2 in v')
                  td(v-for='n2 in netThKeys') {{v2[n2]}}
              //small(v-for='(v3, k3) in v2'){{k3}}: {{v3}} <br>
</template>
<script>
//import store from '__ROOT__/store-global';
import {wellSize} from '__ROOT__/lib/util'
export default {
  data(){
    return {
      isRequest: false,
      platform: null,
      hostname: null,
      uptime: null,
      cpus: null,
      arch: null,
      release: null,
      issue: null,
      loadavg: null,
      totalmem: null,
      tmpdir: null,
      endianness: null,
      networkInterfaces: null,
      netThKeys : ['address', 'netmask', 'family', 'mac', 'scopeid', 'internal']
    }
  },
  computed:{
    wellTotalMem(){
      return wellSize(this.totalmem, 2);
    },
    wellUptime(){
      let s = this.uptime;
      let  _a, m , h , d;
      if(s >= 60){
        _a = s % 60;
        m = (s - _a) / 60;
        s = _a;
      }
      if(m >= 60){
        _a = m % 60;
        h = (m - _a) / 60
        m = _a;
      }
      if(h >= 24){
        _a = h % 24;
        d = (h - _a) / 24
        h = _a;
      }
      d = (d === undefined ? '' : d + ' Days ');
      h = (h === undefined ? '' : h + ' hours ');
      m = (m === undefined ? '' : m + ' minutes ');
      s = s + ' Seconds';
      return d + h + m + s
    }
  },
  methods: {
    getData(){
      this.request({
        url: '~/serverInfo',
        requestKey : 'isRequest',
        success(data){
          Object.assign(this, data);
        }
      })
    }
  },
  created(){
    this.getData();
  }
}
</script>
