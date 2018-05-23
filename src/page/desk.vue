<template lang="jade">
.lr-page.lr-desk-wrap(v-if='deskInited')
  TopBar
  #lr-desk.lr-desk
    //- DeskIcon
    //-   div(style="background: green; height: 100%;", slot='drag')
    //-     | hahh
    //-   div O
    //- .lr-desk-icon-wrap(@dblclick="openDustBin", :class="{lr_desk_icon_focus: dustbinUniqueFocus}")
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

    TasksWindow(v-for='(item, index) in tasks', :key='item.id', :index='index') 
  TasksBar
</template>
<script>

import TasksBar from '__ROOT__/cmpt/tasks-bar.vue';
import TopBar from '__ROOT__/cmpt/top-bar/index.vue';
import TasksWindow from '__ROOT__/cmpt/task-window';
import DeskIcon from '__ROOT__/cmpt/unit/icon.1.vue';
import {createWs, logout} from '__ROOT__/lib/login';
const COMPUTER_TYPE = 'computerInfo';

export default {
  components: {
    TopBar,
    TasksBar,
    TasksWindow,
    DeskIcon
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
    openDustBin(){
      this.$store.commit('addTask', {
        name: 'Dustbin',
        type: 'dustbin',
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
      const TTL_TIME = 1000 * 60 * 9;
      this.$options._liveTTL = setInterval(()=>{
        if(!this.$store.state.isLogin) return;
        this.apiGet('~/live');
      }, TTL_TIME)

      createWs(username);
      //this.createdTask();
      //this.openDustBin();
    }
  },
  destroyed(){
    clearInterval(this.$options._liveTTL);
  },
  mounted(){
    window.APP.$elDesk = this.$el;
  },
  created(){
    if(!this.deskInited){
      this.init();
    }
  }
}

</script>
