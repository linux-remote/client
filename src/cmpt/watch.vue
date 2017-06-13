<template lang="jade">
div {{watch}} {{timeZoneOffset}} {{timeZoneName}}
</template>

<script>
import {timeFormat, ONE_MIN} from '__ROOT__/lib/util';
import store from '__ROOT__/store-global';
export default {
  data(){
    return {
      // time: 0,
      // timeZoneOffset: '',
      // timeZoneName:'',
      // timeDiff : 0,
      nowDate: null
    }
  },
  computed:{
    timeDiff(){
      return this.nowDate.getTime() - (store.state.time  + (this.nowDate.getTimezoneOffset() - store.state.timeZoneOffset) * ONE_MIN);
    },
    timeZoneName(){
      return store.state.timeZoneName
    },
    timeZoneOffset(){
      return store.state.timeZoneOffset
    },
    watch(){
      return timeFormat(this.now - this.timeDiff);
    }
  },
  created(){
    //this.nowDate = new Date();
    const self = this;
    function loop(){
      self.nowDate = new Date();
      setTimeout(()=> {
        loop()
      }, 1000)
    }
    loop();
  }
}
</script>
