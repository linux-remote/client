<template lang="jade">
.dw-h100
  .lr-top
    div(style="width:33%;padding-left:10px;")
      b {{hostname}}
    div(style="width:33%;text-align:center;")
      b {{watch}} {{timeZone}}
    div(style="width:34%; text-align:right;padding-right:10px;")
      b {{username}}
      .btn.btn-link.btn-sm(@click='logout') sign out
      router-link.btn.btn-link(to='/') use other account login in
  div(style="") test
  h1 desk {{info}}
</template>
<script>
import store from './sess-store';
import {timeFormat, ONE_MIN} from '../lib/util';
var t;
export default {
  data(){
    return {
      isRequest: false,
      isTimeRequest: false,
      hostname: '',
      time: 0,
      time2: 0,
      timeZone: '',
      timeDiff : 0,
      username: this.$route.params.username,
      info: ''
    }
  },
  methods: {
    //console.log('this.$route', this.$route)
    logout(){
      this.request({
        url: '/logout',
        type: 'post',
        data: {
          username: this.username
        },
        success(data){
          store.commit('set', data);
          this.$router.push('/');
        }
      })
    },
    getTime(){
      this.request({
        requestKey: 'isTimeRequest',
        url: '~/time',
        success(data){
          //this.time = data;
          const d = new Date();
          const currTime = data.time + (d.getTimezoneOffset() - data.timeZone) * ONE_MIN;
          this.timeDiff = d.getTime() - currTime;

          Object.assign(this, data);
        }
      })
    },
    getData(){
      this.apiGet('~/info', function(data){
        Object.assign(this.$data, data);
        //this.info = data;
      });
    }
  },
  computed:{
    watch(){
      const d = new Date();
      console.log
      return timeFormat(this.time2 - this.timeDiff);
    }
  },
  created(){
    this.getData();
    this.getTime();
    t = setInterval(()=> {
      this.time2 = Date.now();
      //this.getTime();
      //this.time = Date.now() + this.timeDiff;
    }, 1000);
  },
  destroyed(){
    clearInterval(t);
  }
}
</script>
