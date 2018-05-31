<template lang="jade">
.lr-page.lr-desk-wrap(v-if='deskInited')
  TopBar
  DeskTop
    //-   img.lr-desk-icon(src='/public/dustbin.svg')
    //-   .lr-desk-icon-text Dustbin
    //- .lr-desk-icon-wrap(@dblclick="openOsInfo" , :class="{lr_desk_icon_focus: computerInfoUniqueFocus}")
    //-   img.lr-desk-icon(src='/public/server.svg')
    //-   .lr-desk-icon-text Server Info
    //- .lr-desk-icon-wrap(@dblclick="createdTask")
    //-   img.lr-desk-icon(src='/public/file-tree.svg')
    //-   .lr-desk-icon-text File System
    //- .lr-desk-icon-wrap(@dblclick="openEmptyTask")
    //-   .lr-desk-icon-text Empty

    SystemApps(v-for='(item, index) in tasks', :key='item.id', :index='index') 
  TasksBar
</template>
<script>

import TasksBar from '__ROOT__/cmpt/task-bar.vue';
import TopBar from '__ROOT__/cmpt/top-bar/index.vue';
import SystemApps from '__ROOT__/cmpt/sys-apps/index.vue';
import DeskTop from '__ROOT__/cmpt/desktop/body.vue';
import {createWs, logout} from '__ROOT__/lib/login';
const COMPUTER_TYPE = 'computerInfo';

export default {
  components: {
    TopBar,
    TasksBar,
    DeskTop,
    SystemApps,
    
  },
  data(){
    return this.$store.state;
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

    openUserInfo(){
      this.$store.commit('addTask', {
        name: 'User Info',
        type: 'userInfo',
        unique: true
      });
    },
    openOsInfo(){
      this.$store.commit('addTask', {
        name: 'Server Info',
        type: COMPUTER_TYPE,
        unique: true
      });
    },
    openEmptyTask(){
      this.$store.commit('addTask', {
        name: 'Empty',

        unique: true
      });
    },

    logout,
    test500(){
      this.apiGet('~/test500')
    },
    createdTask(){
      this.$store.commit('addTask', {
        name: 'File System',
        address: '/',
        type: 'fs'
      });
    },
    init(){
      const username = this.$route.params.username;
      this.apiGet('~/info', function(data){
        data.isLogin = true;
        data.deskInited = true; //dev use.
        data.username = username;
        document.title = username + '@' + data.hostname;
        this.$store.commit('set', data);
      });

      
      // const TTL_TIME = 1000 * 60 * 9;
      // this.$options._liveTTL = setInterval(()=>{
      //   if(!this.$store.state.isLogin) return;
      //   this.apiGet('~/live');
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
    //clearInterval(this.$options._liveTTL);
  },

  created(){
    if(!this.deskInited){
      this.init();
    }
  }
}

</script>
