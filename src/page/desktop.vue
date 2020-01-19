<template lang="jade">
.lr-page.lr-desktop-wrap(v-if='!isRequest',
                        :class="{lr_desktop_launch: isQuickLaunch}")
  h2.lr-err-color(v-if="error") {{error}}
  DeskTop(:icons='icons', v-else)
  TasksBar
  .lr-modal(v-if='sessError')
    .lr-modal-box
      .lr-modal-title Invalid session
      .lr-modal-body
        div Invalid session, Please login again.
      .lr-modal-footer
        button(@click="afterLogout") Yes
        button(@click="closeSessErrorModal") No
  //- QuickBar
</template>
<script>
import safeBind from '../lib/mixins/safe-bind';
import logout from '../lib/mixins/logout';
import DeskTop from '__ROOT__/cmpt/desktop/body.vue';
import TasksBar from '__ROOT__/cmpt/task/bar.vue';
// import QuickBar from '__ROOT__/cmpt/quick-bar/quick-bar.vue';

export default {
  mixins: [safeBind, logout],
  components: {
    TasksBar,
    DeskTop,
    // QuickBar
  },
  data(){
    return {
      icons: null,
      isRequest: false,
      error: null
    }
  },
  computed:{
    sessError(){
      return this.$store.state.sessError
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
    }
  },
  methods: {
    closeSessErrorModal(){
      this.$store.commit('set', {
        sessError: false
      })
    },
    init(){
      const username = this.$route.params.username;
      this.error = null;
      this.request({
        url: '~/desktop/bundle',
        stateKey: 'isRequest',
        success(data){

          document.title = username + '@' + data.hostname;
          // id
          // uid=1000(dw) gid=2004(dw) groups=2004(dw),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),113(lpadmin),128(sambashare)

          let id = data.id.trim();
          id = id.split(' ');
          function parseItem(str){
            str = str.substr(str.indexOf('=') + 1);
            let i1 = str.indexOf('(');
            let id = str.substr(0, i1);
            let name = str.substring(i1 + 1, str.length - 1);
            return  {
              id,
              name
            }
          }
          let group = parseItem(id[1]);
          let groups = id[2];
          groups = groups.split(',');
          
          groups = groups.map(item => {
            return parseItem(item)
          });

          let groupNames = [];
          groups.forEach(v => {
            groupNames.push(v.name);
          })
          this.$store.commit('set', {
            isLogin: true,
            username,
            group,
            _groups: groups, // will switch name.
            groups: groupNames,
            homedir: data.homedir,
            hostname: data.hostname
          });
          this.$store.commit('sysApps/changeRecycleBinIcon', data.recycebinIsEmpty);
          this.$store.commit('desktop/setIcons', _initIcons(data.icons));
        },
        error(xhr){
          this.error = this.request.defWrapErr(xhr);
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
    this.$options._keep_alive = setInterval(() => {
      this.request({
        url: '~/alive'
      });
    }, 60 * 1000);

  },
  destroyed(){
    clearInterval(this.$options._keep_alive);
  },

  created(){
    this.init();
  }
}


function _initIcons(icons){

  if(!icons){ // 回收站可以被移除
    icons = [{
      id: 'sys_app_recycle_bin',
      x:0,
      y:0
    }]

  }else{
    icons = JSON.parse(icons);
  }
  return icons;
}
</script>
