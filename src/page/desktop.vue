<template lang="jade">
.lr-page.lr-desk-wrap(v-if='deskInited', @mousedown='handleMousedown')
  TopBar
  DeskTop
  TasksBar
</template>
<script>

import TasksBar from '__ROOT__/cmpt/task-bar.vue';
import TopBar from '__ROOT__/cmpt/top-bar/index.vue';
import DeskTop from '__ROOT__/cmpt/desktop/body.vue';
import {createWs, logout} from '__ROOT__/lib/login';

export default {
  components: {
    TopBar,
    TasksBar,
    DeskTop
  },
  computed:{
    sessError(){
      return this.$store.state.sessError
    },
    deskInited(){
      return this.$store.state.deskInited
    },
    username(){
      return this.$store.state.username
    }
  },
  watch: {
    $route(val){
      if(val.params.username !== this.username){ //hold url.
        return this.$router.replace('/user/' + this.username);
      }
    },
    sessError(val){
      if(val){
        console.log('后端403, 前端再退出一下.');
        this.logout();
      }
    }
  },
  methods: {
    handleMousedown(){
      this.$store.commit('task/currentUnFocus');
    },
    openOsInfo(){
      this.$store.commit('task/add', {
        name: 'Server Info',
        type: 'computerInfo',
        unique: true
      });
    },
    openEmptyTask(){
      this.$store.commit('task/add', {
        name: 'Empty',
        unique: true
      });
    },

    logout,
    test500(){
      this.request({
        url: '~/test500'
      })
    },
    createdTask(){
      this.$store.commit('task/add', 'sys_file');
    },
    init(){
      const username = this.$route.params.username;
      this.request({
        url: '~/info', 
        success(data){
          data.isLogin = true;
          data.deskInited = true; //dev use.
          data.username = username;
          document.title = username + '@' + data.hostname;
          this.$store.commit('set', data);
        }
      });


      // const TTL_TIME = 1000 * 60 * 9;
      // this.$options._liveTTL = setInterval(()=>{
      //   if(!this.$store.state.isLogin) return;
      //   this.request({url: '~/live'});
      // }, TTL_TIME)

      createWs(username);
      //this.createdTask();

    }
  },
  mounted(){

    // this.$store.commit('set', {
    //   deskW: window.APP.$elDesk.width(),
    //   deskH: window.APP.$elDesk.height()
    // })
  },
  destroyed(){
    this.$store.commit('task/closeAll');
    //clearInterval(this.$options._liveTTL);
  },

  created(){
    if(!this.deskInited){
      this.init();
    }
  }
}

</script>
