<template lang="jade">
.lr-watch(v-if='clientDate')
  .lr-watch-left {{watch.year}}-{{watch.mounth}}-{{watch.day}} {{watch.hours}}:{{watch.minutes}}
  //- .lr-watch-right
  //-   span {{watch.hours}}:{{watch.minutes}}
  //-   span 
    //- span {{timeZoneName}}
</template>

<script>
import {ONE_MIN} from '__ROOT__/lib/util';

export default {
  data(){
    return {
      clientDate: null,
      count:0,
      now: 0
    }
  },
  computed:{
    timeDiff(){
      return this.clientDate.getTime() - (this.$store.state.time  + (this.clientDate.getTimezoneOffset() - this.$store.state.timeZoneOffset) * ONE_MIN);
    },
    // timeZoneName(){
    //   return this.$store.state.timeZoneName
    // },
    timeZoneOffset(){
      return this.$store.state.timeZoneOffset
    },
    time(){
      return this.$store.state.time
    },
    watch(){
      const d = new Date(this.now - this.timeDiff);
      let min = d.getMinutes();
      min = (min < 10) ? ('0' + min) : min;
      return {
        year: d.getFullYear(),
        mounth: d.getMonth() + 1,
        day: d.getDate(),
        hours: d.getHours(),
        minutes: min,
        seconds: d.getSeconds()
      }
    }
  },
  methods:{
    getData(){
      this.request({
        url: '/time',
        success(data){
          this.clientDate = new Date();
          this.now = this.clientDate.getTime();
          data.timeInited = true;
          this.$store.commit('set', data);
          this.start();
        }
      })
    },
    start(){
      const self = this;
      this.$options.t = setInterval(() => {
        self.now = Date.now();
      }, 1000);
    }
  },
  destroyed(){
    clearInterval(this.$options.t);
  },
  created(){
    this.getData();
  }
}
</script>
