<template lang="jade">
.dw-h100
  .lr-top
    div(style="width:33%;padding-left:10px;")
      b {{hostname}}
    div(style="width:33%;text-align:center;")
      <watch></watch>
    div(style="width:34%; text-align:right;padding-right:10px;")
      b {{username}}
      .btn.btn-link.btn-sm(@click='logout') sign out
      router-link.btn.btn-link(to='/') use other account login in
  div(style="") test
  h1 desk {{info}}
</template>
<script>
// import store from '__ROOT__/store-global';
import Watch from './watch';
import {logout, createWs} from '__ROOT__/lib/login'
export default {
  components: {Watch},
  data(){
    return {
      isRequest: false,
      isTimeRequest: false,
      hostname: '',
      time: 0,
      timeZoneOffset: '',
      timeZoneName:'',
      timeDiff : 0,
      username: this.$route.params.username,
      info: ''
    }
  },
  methods: {
    logout,
    getData(){
      this.apiGet('~/info', function(data){
        Object.assign(this.$data, data);
        //this.info = data;
      });
    }
  },
  created(){
    //store.commit('set', {username: this.username});
    createWs(this.username);
    this.getData();
  }
}
</script>
