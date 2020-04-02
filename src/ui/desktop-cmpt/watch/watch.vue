
<template lang="jade">
.lr-watch(v-if='clientDate', :title="title")
  span {{watch.hours}}:{{watch.minutes}}
  span.lr-watch_timezone {{hourTimeZone}}
  //- .lr-watch-detail 
  //-   p {{watch.year}}/{{watch.mounth}}/{{watch.day}} 
  //-   p {{hourTimeZone}}
</template>

<script>
const ONE_MIN = 1000 * 60;
// function forMatTimeOffset(hours){
//   const i = hours.length - 2
//   return hours.substr(0, i) + ':' + hours.substr(i)
// }
export default {
  data(){
    return {
      clientDate: null,
      count:0,
      now: 0,
      time: 0,
      timeZoneOffset: 0
    }
  },
  computed:{

    timeDiff(){
      return this.clientDate.getTime() - (this.time  + (this.clientDate.getTimezoneOffset() - this.timeZoneOffset) * ONE_MIN);
    },
    hourTimeZone(){
      let t = -this.timeZoneOffset;
      let suffix = t > 0 ? '+' : '-';
      return `${suffix}${t / 60}:00`
    },
    watch(){
      const d = new Date(this.now - this.timeDiff);
      let min = d.getMinutes();
      let hours = d.getHours();
      min = (min < 10) ? ('0' + min) : min;
      hours = (hours < 10) ? ('0' + hours) : hours;
      return {
        year: d.getFullYear(),
        mounth: d.getMonth() + 1,
        day: d.getDate(),
        hours,
        minutes: min,
        seconds: d.getSeconds()
      }
    },
    title(){
      return `${this.watch.year}/${this.watch.mounth}/${this.watch.day}`
    },
  },
  methods:{
    getData(){
      this.$store.commit('wsRequest', {
        method: 'getTime',
        success: (data) => {
          this.clientDate = new Date();
          this.now = this.clientDate.getTime();
          this.time = data.time;
          this.timeZoneOffset = data.timeZoneOffset;
          this.start();
        }
      })
      // this.request({
      //   url: '~/time',
      //   success(data){
      //     this.clientDate = new Date();
      //     this.now = this.clientDate.getTime();

      //     this.time = data.time;
      //     this.timeZoneOffset = data.timeZoneOffset;
      //     this.start();
      //   }
      // })
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
