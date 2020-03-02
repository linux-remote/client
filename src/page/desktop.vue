<template lang="jade">
.lr-desktop(v-if="isConnected")
  .lr-bar
    Start
    QuickLaunch
    .lr-task-bar
      TaskItem ABC
      TaskItem focus
    .lr-inner.lr-clock-area
      Watch
  .lr-desktop_body(ref="body")
    Window.lr-desktop_container(
    :startIsMax="true")
      DeskTopBody
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
import Contextmenuable from '../ui/desktop-cmpt/global/contextmenuable.vue';
// import TasksBar from '__ROOT__/cmpt/task/bar.vue';

import {Start, QuickLaunch, TaskItem, Window, Watch, DeskTopBody} from '../ui/index.js';
export default {
  mixins: [safeBind],
  components: {
    // TasksBar,
    // DeskTop,
    DeskTopBody,
    Contextmenuable,
    Start,
    QuickLaunch,
    TaskItem,
    Window,
    Watch
    // QuickBar
  },
  data(){
    return {
      icons: null,
      isConnected: false,
      error: null
    }
  },
  computed:{
    sessError(){
      return this.$store.state.sessError
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
        }
      })
    },
    closeSessErrorModal(){
      this.$store.commit('set', {
        sessError: false
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
        isLogin: true,
        username,
        // group,
        // _groups: groups, // will switch name.
        // groups: groupNames,
        homedir: data.homedir,
        hostname: data.hostname
      });
    },
    createWs(){
      this.$store.commit('wsConnect');
    },
    handleSr(sr){
      sr.request({method: 'getTime'}, function(data){
        console.log('data', data);
      });
      sr.request({method: 'getDesktopBundle'}, function(data){
        console.log('data', data);
      });
    }
  },

  mounted(){
  },

  destroyed(){
  },

  created(){
    const username = this.$route.params.username;
    this.$store.commit('setUsername', username);
    this.$store.commit('wsConnect', () => {
      this.isConnected = true;
      this.getData();
    });
    // window.require(['pako'], (pako) => {
    //   this.createWs(pako, (sr) => {
    //     this.handleSr(sr);
    //   });
    // });
    
  }
}

</script>
