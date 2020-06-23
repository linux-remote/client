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
  .lr-desktop-load(v-else)
    span(v-if="isAMDRequest") Loading static resource...
    span(v-else) Connecting user server...
  template(v-if="sessError")
    .lr-window_mask(@mousedown.prevent, style="z-index: 3")
    Block(type="confirm", ref="confirm", title="Invalid session", :text="'Server: ' + sessError.message + '. Invalid session, Please login again. '", status="warn", :okFn="afterLogout", :close="closeSessErrorModal")
  .lr-notice(v-if="isFirstConnected && !wsIsConnected && !isExit") Websoket Disconnected, Reconnecting...
    
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
      isAMDRequest: false,
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
    isExit(){
      return this.$store.state.isExit;
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

      this.$store.commit('set', {
        username,
        homedir: data.homedir,
        hostname: data.hostname
      });
    },
    getPako(cb){
      this.isAMDRequest = true;
      window.require(['pako'], (err, [pako]) => {
        this.isAMDRequest = false;
        window.APP._staticPako = pako;
        cb(pako)
      });
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
    this.safeBind(window, 'unload', () => {

      if(navigator.sendBeacon){
        navigator.sendBeacon(this.request.wrapUrl('~/pageUnload'));
      } else {
        // $compatible
        this.request({
          url: '~/pageUnload',
          type: 'post',
          sync: true
        })
      }
    })
  },

  destroyed(){
  },

  created(){
    
    const username = this.$route.params.username;
    this.$store.commit('setUsername', username);
    this.getPako(() => {
      this.$store.commit('wsConnect', () => {
        this.safeBind(this.$root, 'nsConnected', () => {
          this.isFirstConnected = true;
          console.log('-------------[desktop.vue]: nsConnected---------------------')
          this.getData();
        }, 'once');
      });
    })

    
  }
}

</script>
