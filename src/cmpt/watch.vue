<template lang="jade">
.lr-watch(v-if='clientDate')
  .lr-2-left {{watch.hours}}:{{watch.minutes}}
  .lr-2-right
    span {{watch.year}}-{{watch.mounth}}-{{watch.day}}
    span {{timeZoneName}}
</template>

<script>
import {ONE_MIN} from '__ROOT__/lib/util';
import store from '__ROOT__/store-global';

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
      return this.clientDate.getTime() - (store.state.time  + (this.clientDate.getTimezoneOffset() - store.state.timeZoneOffset) * ONE_MIN);
    },
    timeZoneName(){
      return store.state.timeZoneName
    },
    timeZoneOffset(){
      return store.state.timeZoneOffset
    },
    time(){
      return store.state.time
    },
    watch(){
      const d = new Date(this.now - this.timeDiff);

      return {
        year: d.getFullYear(),
        mounth: d.getMonth() + 1,
        day: d.getDate(),
        hours: d.getHours(),
        minutes: d.getMinutes(),
        seconds: d.getSeconds()
      }
      //return timeFormat(this.now - this.timeDiff);
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
          store.commit('set', data);
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
