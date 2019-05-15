<template lang="jade">
.lr-start
  .lr-start-btn(@click='handleBtnClick', :class='{lr_start_focus: isShowMenu}')
  .lr-start-menu(v-show="isShowMenu")
    
    .lr-start-column
      h3 Apps
      AppItem.lr-start-menu-item(v-for='(v, k) in sysAppMap',
                                :item="v",
                                v-if="!v.hidden"
                                :id='k',
                                :key="k")
    .lr-start-username {{username}}
    .lr-start-bottom-menu
      button.lr-clear-btn(@click="handleSettingsClick")
        span.glyph.glyph-settings(title="Settings")
      router-link.lr-clear-btn(to='/' target='_blank')
        span.glyph.glyph-other-user(title="Login with other account")
      button.btn.btn-default.btn-sm.theme-dark.lr-start-logout-btn(@click="logout") Sign out
    //-.lr-start-menu-item 第三方程序
    //-AppItem.lr-start-menu-item(v-for='(v, k) in thirdPartyAppMap',
                              :item="v",
                              :id='k',
                              :key="k")
</template>

<script>
import AppItem from './app-item.vue';
import { logout } from '__ROOT__/lib/login';
export default {
  components: {
    AppItem
  },
  data(){
    return {
      isShowMenu: true, // $DEV
      appList: []
    }
  },
  computed: {
    sysAppMap(){
      return this.$store.state.sysApps.sysMap;
    },
    username(){
      return this.$store.state.username;
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].start
    }
    // thirdPartyAppMap(){
    //   return this.$store.state.sysApps.thirdPartyMap;
    // }
  }, 
  methods: {
    handleSettingsClick(){
      this.$store.commit('task/add', 'sys_app_settings');
    },
    toggleMenu(){
      this.isShowMenu = !this.isShowMenu;
    },
    handleBtnClick(){
      this.toggleMenu();
      if(this.isShowMenu){
        //console.log('Listener by click');
        document.addEventListener('mousedown', this.handleDocumentMousedown, {
          capture: true
        })
      }else {
        //console.log('remove by click');
        document.removeEventListener('mousedown', this.handleDocumentMousedown, true);
      }
    },


    handleDocumentMousedown(e){
      //console.log('handleDocumentMousedown');
      if(this.$el === e.target || this.$el.contains(e.target)){
        return;
      }else{
        //console.log('remove by doc mousedown');
        document.removeEventListener('mousedown', 
          this.handleDocumentMousedown, 
          true); // true is capture! must set.
        this.isShowMenu = false;
      }
    },
   logout,
   handleDocKeyDown(e){
     
     // https://stackoverflow.com/questions/36458625 
     if(e.keyCode === 112){
       this.toggleMenu();
       
       e.preventDefault();
     }
     console.log('handleDocKeyDown',  e.keyCode);
   }
  },
  mounted(){
    this.$options._handleDocKeyDown = (e) => {
      this.handleDocKeyDown(e);
    }
    this.$options._handleDocKeyDownOpts = {
      capture: true
    }
    document.addEventListener('keydown', this.$options._handleDocKeyDown, this.$options._handleDocKeyDownOpts);
  },
  destroyed(){
    document.removeEventListener('keydown', this.$options._handleDocKeyDown, this.$options._handleDocKeyDownOpts);
  }
}
</script>
