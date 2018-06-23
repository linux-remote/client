<template lang="jade">
.lr-watch(v-if='clientDate')
  .lr-watch-left 
    span {{watch.year}}-{{watch.mounth}}-{{watch.day}} {{watch.hours}}:{{watch.minutes}} 
  .lr-watch-timezone(:title='timeZone.offset.name + ", " +  timeZone.name') | {{formatedOffset}}
</template>

<script>
import {ONE_MIN} from '__ROOT__/lib/util';
function forMatTimeOffset(hours){
  const i = hours.length - 2
  return hours.substr(0, i) + ':' + hours.substr(i)
}
export default {
  data(){
    return {
      clientDate: null,
      count:0,
      now: 0,
      time: 0,
      timeZone: {},
      timeZoneOffset: 0
    }
  },
  computed:{
    timeDiff(){
      return this.clientDate.getTime() - (this.time  + (this.clientDate.getTimezoneOffset() - this.timeZoneOffset) * ONE_MIN);
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

          const offsetHour = Number(data.timeZone.offset.hour) / 100;
          this.time = data.time;
          this.timeZone = data.timeZone;
          this.timeZoneOffset = -(offsetHour * 60);
          this.formatedOffset = forMatTimeOffset(data.timeZone.offset.hour)
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
