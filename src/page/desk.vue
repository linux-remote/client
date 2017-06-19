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
  methods: {
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
        data.deskInited = true;
        data.username = username;
        document.title = username + '@' + data.hostname;
        store.commit('set', data);
      })

      createWs(username);
    }
  },

  mounted(){
    if(!this.deskInited){
      this.init();
      this.createdTask();
    }
  }
}

</script>
