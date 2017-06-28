<template lang="jade">
.lr-user
  .lr-user-name(@click='show', :class='{lr_2_hover:showDrop}') {{username}}
    <svg-triangle svgClass='lr-triangle' width='10' height='5' />
  .lr-user-drop(v-show='showDrop')
    //- .lr-user-p(style='user-select:text' @click='noopStop')
    //-   small uid:
    //-   b {{user.uid}}
    //-   small(style='margin-left:1em') gid:
    //-   b {{user.gid}}
    .lr-user-p(style='user-select:text')
      small homedir:
      button(style='margin-left:1em' @click='openHome(homedir)') {{homedir}}
    hr
    .lr-user-p
      router-link.btn.btn-link(to='/' target='_blank') login with other account
    hr
    button.lr-user-p.lr-3-logout(@click='logout') logout

</template>

<script>
import store from '__ROOT__/store-global';
import {logout} from '__ROOT__/lib/login';
import SvgTriangle from './svg-triangle';
export default {
  components:{
    SvgTriangle
  },
  data(){
    return {
      showDrop: false,
      uid:null,
      gid:null,
      uname:null,
      gname: null,
      otherGroup: []
    }
  },
  computed:{
    username(){
      return store.state.username;
    },
    homedir(){
      return store.state.homedir;
    },
  },
  methods:{
    // parseData(data){
    //   //data = data.split('/n');
    //   //console.log('data', ansicolor.parse(data));
    // },
    // getData(){
    //   this.request({
    //     url: '~/exec',
    //     data: {
    //       cmd: 'ls -l --color=always /home/dw/test/f3'
    //     },
    //     success(data){
    //       this.parseData(data);
    //     }
    //   })
    // },
    openHome(dir){
      store.commit('addTask', {
        name: 'Home',
        address: dir,
        type: 'fs'
      })
    },
    show(){
      if(this.showDrop) return;
      this.showDrop = true;
      setTimeout(()=>{
        document.addEventListener('click', () => {
          this.showDrop = false;
        }, {
          once: true
        });
      })
    },
    logout
  },
  created(){
    //console.log('created')
    //this.getData();
  }
}
</script>
