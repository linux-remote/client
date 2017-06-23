<template lang="jade">
.lr-page.lr-desk-wrap(v-if='deskInited')
  .lr-desk
    <top-bar />
    .lr-desk-icon-wrap
      .lr-desk-icon(@dblclick="createdTask") FS

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
      console.log('watch sessError', val);
      if(val){
        this.logout();
      }
    }
  },
  methods: {
    logout,
    test500(){
      this.apiGet('~/test500')
    },
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
