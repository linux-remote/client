<template lang="jade">
.lr-page.lr-desk-wrap(v-if='deskInited')
  <top-bar />
  .lr-top-bg LR {{hostname}}
  #lr-desk.lr-desk
    .lr-desk-icon-wrap(@dblclick="openDustBin", :class="{lr_desk_icon_focus: dustbinUniqueFocus}")
      img.lr-desk-icon(src='/public/dustbin.svg')
      .lr-desk-icon-text Dustbin
    .lr-desk-icon-wrap(@dblclick="openOsInfo" , :class="{lr_desk_icon_focus: computerInfoUniqueFocus}")
      img.lr-desk-icon(src='/public/server.svg')
      .lr-desk-icon-text Computer
    .lr-desk-icon-wrap
      img.lr-desk-icon(src='/public/user.svg')
      .lr-desk-icon-text User Info
    .lr-desk-icon-wrap(@dblclick="createdTask")
      img.lr-desk-icon(src='/public/file-tree.svg')
      .lr-desk-icon-text File System


    //-button.btn.btn-default(@click='test500') test500

    <tasks-window v-for='(item, index) in tasks' :key='item.id' :index='index'>
    </tasks-window>
  <tasks-bar />
</template>
<script>
import store from '__ROOT__/store-global';
import TasksBar from '__ROOT__/cmpt/tasks-bar';
import TasksWindow from '__ROOT__/cmpt/task-window';
import TopBar from '__ROOT__/cmpt/top-bar';
import {createWs, logout} from '__ROOT__/lib/login';
const COMPUTER_TYPE = 'computerInfo';

export default {
  components: {
    TasksBar,
    TopBar,
    TasksWindow
  },
  data(){
    return store.state;
  },
  watch: {
    $route(val){
      if(val.params.username !== this.username){ //hold url.
        return this.$router.replace('/user/' + this.username);
      }
    },
    sessError(val){
      //console.log('watch sessError', val);
      if(val){
        this.logout();
      }
    }
  },
  // computed: {
  //   isComputerInfoOpen(){
  //     //return this.uniqueTaskMap[COMPUTER_TYPE] !== null
  //     //return stote.state.uniqueTaskMap[COMPUTER_TYPE] !== null
  //     return false
  //   }
  // },
  methods: {
    openOsInfo(){
      store.commit('addTask', {
        name: 'Computer Info',
        type: COMPUTER_TYPE,
        unique: true
      });
    },
    openDustBin(){
      store.commit('addTask', {
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
      store.commit('addTask', {
        name: 'File System',
        address: '/home/dw',
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
        store.commit('set', data);
      });
      const TTL_TIME = 1000 * 60 * 9;
      this.$options._liveTTL = setInterval(()=>{
        if(!store.state.isLogin) return;
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
