<template lang="jade">
.dw-h100(style="position:relative;height:100%; overflow: hidden;")
  .lr-top
    div(style="width:33%;padding-left:10px;")
      b {{hostname}}
    div(style="width:33%;text-align:center;")
      <watch></watch>
    div(style="width:34%; text-align:right;padding-right:10px;")
      b {{username}}
      button(@click='logout') logout
      router-link.btn.btn-link(to='/') use other account login in
  div(style="") test
  h1 desk {{info}}
  //-#yin-yang
  .lr-fs-icon.glyphicon.glyphicon-hdd(@click="createdTask")
  br
  br
  <tasks-bar />
  <tasks-window v-for='(item, index) in tasks' :key='item.id' :index='index' />
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
    return {
      isRequest: false,
      isTimeRequest: false,
      hostname: '',
      username: this.$route.params.username,
      info: ''
    }
  },
  computed: {
    tasks(){
      return store.state.tasks
    }
  },
  methods: {
    logout,
    createdTask(){
      store.commit('addTask', {
        name: 'test:' + Date.now()
      });
    },
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
