<style lang="sass">
  // .lr-top-bg{
  //   user-select: text;
  //   height: $topBarH;
  //   background-color: #D69200;
  //   color:#aaa;
  //   padding-left: 10px;
  // }
  // .lr-top{
  //   height: $topBarH;
  //   display: flex;
  //   flex-shrink: 0;
  //   position: fixed;

  //   right: $rightCtrlWidth + 20;
  //   background-color: rgba(#A0522D, .7);
  //   color:#fff;
  //   z-index: $topZindex;
  //   top: -5px;
  //   border: 5px outset #eee;
  //   border-radius: 0 0 10px 10px;
  //   padding: 0 30px;
    
  //   line-height: $topBarH;
  //   .lr-top-quick-item{
  //     color: yellow;
  //     border-left: 1px solid yellow;
  //     border-right: 1px solid yellow;
  //     padding: 0 5px;
  //     cursor: pointer;
  //     &:hover{
  //       background-color: #333;
  //     }
  //   }
  //   .lr-top-small-icon{
  //     background-size: 100% 100%;
  //     width: $topBarH; height: $topBarH;
  //   }
  // }

  // .lr-watch{
  //   user-select: text;
  //   display: flex; align-items: center;
  //   border-right: 1px solid #fff;padding: 0 5px;
  //   .lr-2-left{
  //     font-size: 24px;
  //   }
  //   .lr-2-right{
  //     display: flex;flex-direction: column;line-height: 10px; font-size: 10px;
  //     text-align: center; margin-left: 5px; align-items: center;
  //   }
  // }



  // .lr-user{
  //   position: relative;
  //   .lr-user-name{
  //     display: flex; align-items: center;
  //     cursor: pointer;
  //     padding: 0 3px 0 5px;
  //     &:hover, &.lr_2_hover{
  //       background-color: #888;
  //     }
  //     >.lr-triangle{
  //       margin: 0 3px;
  //       >polygon{
  //         fill:#fff;
  //       	//stroke-width:0;
  //       }
  //     }
  //   }
  //   &:hover>.lr-user-drop{
  //     display: block;
  //   }

  //   >.lr-user-drop{
  //     font-size: 14px;
  //     position: absolute; width: 200px; right:0;
  //     top: 100%; display: block;padding: 5px 0;
  //     background-color: #fff;
  //     border:1px outset #999;
  //     color:#000;
  //     >.lr-user-p{
  //       padding: 0 10px; word-wrap: break-word;
  //       b{margin-right:.3em}
  //     }
  //     .lr-3-logout{
  //       cursor: pointer;
  //       color: #000; margin-left: 10px;
  //     }
  //   }
  // }

</style>
<template lang="jade">
.lr-top
  //- .lr-top-quick-item(@click='openHome') Home
  //- .lr-top-quick-item(@click='openFs')
  //-   .lr-top-small-icon(style='background-image:url(/public/file-tree.svg)')
  <watch/>
  <user/>
</template>

<script>
import Watch from '__ROOT__/cmpt/watch';
import User from '__ROOT__/cmpt/user';
import store from '__ROOT__/store-global';
import {logout} from '__ROOT__/lib/login';
export default {
  components:{
    Watch,
    User
  },
  data(){
    return {}
  },
  methods:{
    logout,
    openHome(){
      store.commit('addTask', {
        name: 'Home',
        type: 'fs'
      });
    },
    openFs(){
      store.commit('addTask', {
        name: 'File System',
        address: '/',
        type: 'fs'
      });
    }
  },
  computed:{
    username(){
      return store.state.username
    },
    title(){
      return store.state.crrrMaxTaskTitle ||  store.state.hostname
    }
  }
}
</script>
