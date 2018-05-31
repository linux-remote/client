<template lang="jade">
.lr-user
  .lr-user-name(@click='show', :class='{lr_user_hover:showDrop}') {{username}}
    <svg-triangle svgClass='lr-triangle' width='10' height='5' />
  .lr-user-drop(v-show='showDrop')
    //- .lr-user-p(style='user-select:text' @click='noopStop')
    //-   small uid:
    //-   b {{user.uid}}
    //-   small(style='margin-left:1em') gid:
    //-   b {{user.gid}}
    .lr-user-p(style='user-select:text' @click='noopStop')
      b group:
      | {{group}}
    .lr-user-p(style='user-select:text; line-height:1.2' @click='noopStop')
      b groups:
      small {{groups}}
    hr
    .lr-user-p
      router-link(to='/' target='_blank') login with other account
    hr
    button.lr-user-p.lr-user-logout(@click='logout') logout

</template>

<script>
import { logout } from '__ROOT__/lib/login';
import SvgTriangle from '../svg/triangle.vue';
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
      return this.$store.state.username;
    },
    group(){
      return this.$store.state.groups[0]
    },
    groups(){
      return this.$store.state.groups.join(',')
    },
    homedir(){
      return this.$store.state.homedir;
    },
  },
  methods:{
    openHome(dir){
      this.$store.commit('addTask', {
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
    //this.getData();
  }
}
</script>
