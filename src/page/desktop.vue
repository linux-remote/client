<template lang="jade">
.lr-desktop
  template(v-if="isFirstConnected")
    .lr-bar
      Start
      QuickLaunch
      .lr-task-bar
        TaskItem(v-for='(item, index) in tasks', 
        :key='item.id',
        :index='index',
        :item='item')
      .lr-inner.lr-clock-area
        Watch
    DeskTopBody#lr-desktop
    | {{sessError}}
  template(v-if="sessError")
    .lr-window_mask(@mousedown.prevent, style="z-index: 3")
    Block(type="confirm", ref="confirm", title="Invalid session", :text="'Invalid session, Please login again. ' + sessError.message", :okFn="afterLogout", :close="closeSessErrorModal")
  .lr-notice(v-if="isFirstConnected && !wsIsConnected") Websoket Disconnected, Reconnecting...
    
  //- h2.lr-err-color(v-if="error") {{error}}
  //- DeskTop(:icons='icons', v-else)
  //- TasksBar
  //- .lr-modal(v-if='sessError')
  //-   .lr-modal-box
  //-     .lr-modal-title Invalid session
  //-     .lr-modal-body
  //-       div Invalid session, Please login again.
  //-     .lr-modal-footer
  //-       button(@click="afterLogout") Yes
  //-       button(@click="closeSessErrorModal") No
</template>
<script>
import safeBind from '../lib/mixins/safe-bind';
import termMap from '../sys-app/terminal/map';
import Block from '../ui/desktop-cmpt/block/base.vue';
// import TasksBar from '__ROOT__/cmpt/task/bar.vue';

import {Start, QuickLaunch, TaskItem, Watch, DeskTopBody} from '../ui/index.js';
export default {
  mixins: [safeBind],
  components: {
    // TasksBar,
    // DeskTop,
    Block,
    DeskTopBody,
    Start,
    QuickLaunch,
    TaskItem,
    Watch
    // QuickBar
  },
  data(){
    return {
      icons: null,
      isFirstConnected: false,
      error: null
    }
  },
  computed:{
    tasks(){
      return this.$store.state.task.list;
    },
    sessError(){
      return this.$store.state.sessError
    },
    wsIsConnected(){
      return this.$store.state.wsIsConnected;
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
    }
  },
  methods: {
    getData(){
      this.$store.commit('wsRequest', {
        method: 'getDesktopBundle',
        success: (data) => {
          this.parseBundle(data);
          if(data.createdTerm.length){
            const reloadNotice = '\n--------- Reloaded ---------\n\r';
            const _processReLaunch = () => {
              let termId = data.createdTerm[0];
              termMap[termId] = reloadNotice;
              this.$store.commit('task/add', {
                appId: 'sys_app_terminal',
                id: termId
              });
              data.createdTerm.shift();
              if(data.createdTerm.length){
                this.$nextTick(() => {
                  _processReLaunch();
                });
              }
            }
            _processReLaunch();
          }
          this.$store.commit('wsRequest', {
            method: 'getRecycleBinLen',
            success: (len) => {
              this.$store.commit('recycleBinChange', len);
            }
          })
        }
      })
    },
    afterLogout(){
      location.href = '/#user=' + this.$store.state.username;
    },
    closeSessErrorModal(){
      this.$store.commit('set', {
        sessError: null
      })
    },
    parseBundle(data){
      const username = this.$route.params.username;
      document.title = username + '@' + data.hostname;
      // id
      // uid=1000(dw) gid=2004(dw) groups=2004(dw),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),113(lpadmin),128(sambashare)

      // let id = data.id.trim();
      // id = id.split(' ');
      // function parseItem(str){
      //   str = str.substr(str.indexOf('=') + 1);
      //   let i1 = str.indexOf('(');
      //   let id = str.substr(0, i1);
      //   let name = str.substring(i1 + 1, str.length - 1);
      //   return  {
      //     id,
      //     name
      //   }
      // }
      // let group = parseItem(id[1]);
      // let groups = id[2];
      // groups = groups.split(',');
      
      // groups = groups.map(item => {
      //   return parseItem(item)
      // });

      // let groupNames = [];
      // groups.forEach(v => {
      //   groupNames.push(v.name);
      // })
      this.$store.commit('set', {
        username,
        // group,
        // _groups: groups, // will switch name.
        // groups: groupNames,
        homedir: data.homedir,
        hostname: data.hostname
      });
      window.APP.RECYCLE_BIN_PATH = data.homedir + '/.linux-remote/recycle-bin';
    }
  },

  mounted(){
    this.$store.commit('setDeskTopWH');
    this.safeBind(this.$root, 'sys_app_recycle_bin_ctx', () => {
      this.$store.commit('wsRequest', {
        method: 'emptyRecycleBin',
        success: (len) => {
          this.$root.$emit('emptyRecycleBined');
          this.$store.commit('recycleBinChange', len);
        }
      });
    });
  },

  destroyed(){
  },

  created(){
    const username = this.$route.params.username;
    this.$store.commit('setUsername', username);
    this.$store.commit('wsConnect', () => {
      this.isFirstConnected = true;
      this.getData();
    });
    
  }
}

</script>
