<template lang="jade">
.lr-page.lr-desk-wrap(v-if='deskInited')
  TopBar
  DeskTop(:icons='icons')
  TasksBar
</template>
<script>

import TasksBar from '__ROOT__/cmpt/task/bar.vue';
import TopBar from '__ROOT__/cmpt/top-bar/index.vue';
import DeskTop from '__ROOT__/cmpt/desktop/body.vue';
import {logout} from '__ROOT__/lib/login';

const API_ROOT = window.SERVER_CONFIG.API_ROOT;
export default {
  components: {
    TopBar,
    TasksBar,
    DeskTop
  },
  data(){
    return {
      icons: null
    }
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


    logout,
    init(){
      const username = this.$route.params.username;
      var count = 0, TOTAL = 2, data;

      const initAppMap = () => {
        if(!this.$store.state.app.thirdPartyMap){
          this.request({
            url: '/app/list',
            success(data){
              var map = Object.create(null);

              data.forEach((v) => {
                v.main = '/app' + v.staticPath + '/' + v.main;
                v.iconUrl = API_ROOT + '/app' + v.staticPath + '/' + v.icon;
                delete(v.icon);
                delete(v.staticPath);
                map[v.id] = v;
                delete(v.id);
              });
              this.$store.commit('app/setThirdPartyMap', map);
              initAppMap();
            }
          })
        } else {
          done();
        }
      }

      const getBundle = () => {
        this.request({
          url: '~/desktop/bundle',
          success(_data){
            data = _data;
            done();
          }
        });
      }

      const done = () => {
        count = count + 1;
        if(count === TOTAL){

          document.title = username + '@' + data.hostname;

          this.$store.commit('set', {
            isLogin: true,
            deskInited: true,
            username,
            groups: data.groups,
            homedir: data.homedir,
            hostname: data.hostname,
            mask: data.mask,
            quickBarItems: JSON.parse(data.quickBar)
          });
          this.$store.commit('app/changeRecycleBinIcon', data.recycebinIsEmpty);
          this.icons = data.icons;
        }
      }


      initAppMap();
      getBundle();

      //createWs(username);
    }
  },

  destroyed(){
    //
  },

  created(){
    if(!this.deskInited){
      this.init();
    }
  }
}

</script>
