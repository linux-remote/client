<template lang="jade">
.lr-user
  .lr-user-name(@click='show', :class='{lr_2_hover:showDrop}') {{user}}
    <svg-triangle svgClass='lr-triangle' width='10' height='5' />
  .lr-2-drop(v-show='showDrop')
    .lr-3-p(style='font-size: 14px')
      router-link.btn.btn-link(to='/' target='_blank') login with other account
    hr
    .lr-3-p.lr-3-logout(@click='logout') logout

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
      showDrop: false
    }
  },
  computed:{
    user(){
      return store.state.username
    },
  },
  methods:{
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
  }
}
</script>
