<template lang="jade">
.lr-page.lr-desktop-wrap(v-if='deskInited',
                        :class="{lr_desktop_launch: isQuickLaunch}")
  DeskTop(:icons='icons')
  TasksBar
  //- QuickBar
</template>
<script>
import safeBind from '../lib/mixins/safe-bind';
import DeskTop from '__ROOT__/cmpt/desktop/body.vue';
import TasksBar from '__ROOT__/cmpt/task/bar.vue';
// import QuickBar from '__ROOT__/cmpt/quick-bar/quick-bar.vue';
import { logout } from '__ROOT__/lib/login';
const EVENT_CAPTURE = {capture: true};
// const API_ROOT = window.SERVER_CONFIG.API_ROOT;
export default {
  mixins: [safeBind],
  components: {
    TasksBar,
    DeskTop,
    // QuickBar
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
    },
    isQuickLaunch() {
      return this.$store.state.isQuickLaunch
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

      this.request({
        url: '~/desktop/bundle',
        success(data){
          document.title = username + '@' + data.hostname;

          this.$store.commit('set', {
            isLogin: true,
            deskInited: true,
            username,
            groups: data.groups,
            homedir: data.homedir,
            hostname: data.hostname
          });
          this.$store.commit('sysApps/changeRecycleBinIcon', data.recycebinIsEmpty);
          this.icons = data.icons;
        }
      });

    },
    handleDocKeyDown(e){
      if(e.ctrlKey && e.key === 'Meta'){
        this.$store.commit('toggleQuickLaunch');
        e.preventDefault();
        e.stopPropagation();
      }
    }
  },

  mounted(){
    
    this.safeBind(document, 'keydown', (e) => {
      this.handleDocKeyDown(e);
    });

  },
  destroyed(){
  },

  created(){
    if(!this.deskInited){
      this.init();
    }
  }
}
</script>
