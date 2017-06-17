<template lang="jade">
<button></button>
</template>

<script>
export default {
  props: ['isRequest', 'disabled'],
  data(){
    return {
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
