<template lang="jade">
.dw-h100(style="position:relative;height:100%; overflow: hidden;" v-if='deskInited')
  .lr-top
    div(style="width:33%;padding-left:10px;")
      b {{hostname}}
    div(style="width:33%;text-align:center;")
      <watch/>
    div(style="width:34%; text-align:right;padding-right:10px;")
      b {{username}}
      button(@click='logout') logout
      router-link.btn.btn-link(to='/') use other account login in
  br
  .lr-fs-icon.glyphicon.glyphicon-hdd(@dblclick="createdTask")
  button.btn.btn-default(@click='test500') test500
  br
  <tasks-bar />
  <tasks-window v-for='(item, index) in tasks' :key='item.id' :index='index'>
  </tasks-window>
</template>
<script>
import store from '__ROOT__/store-global';
import Watch from '__ROOT__/cmpt/watch';
import TasksBar from '__ROOT__/cmpt/tasks-bar';
import TasksWindow from '__ROOT__/cmpt/task-window';
import {logout, createWs} from '__ROOT__/lib/login';

export default {
  components: {
    Watch,
    TasksBar,
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
      console.log('watch sessError', val);
      if(val){
        this.logout();
      }
    }
  },
  methods: {
    test500(){
      this.apiGet('~/test500')
    },
    logout,
    createdTask(){
      store.commit('addTask', {
        name: 'test:' + Date.now(),
        type: 'fs',
        height: 500, width: 600
      });
    },
    init(){
      const username = this.$route.params.username;
      this.apiGet('~/info', function(data){
        data.deskInited = true; //dev use.
        data.username = username;
        document.title = username + '@' + data.hostname;
        store.commit('set', data);
      });
      const TTL_TIME = 1000 * 60 * 9;
      const TTL = () => {
        setTimeout(()=>{
          this.apiGet('~/live');
          TTL();
        }, TTL_TIME)
      }
      TTL();
      createWs(username);
      this.createdTask();
    }
  },
  created(){
    if(!this.deskInited){
      this.init();
    }
  }
}

</script>
