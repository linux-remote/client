<template lang="jade">
FocusMenu(cssBase="lr-start")
  template(v-slot:btn)
    LRIcon(type="css", value="iconfont icon-logo_LR")
    | Start
  template(v-slot:menu)
    .lr-start-username(@click="handleAccountClick") {{username}}
    hr
    .lr-start-apps
      AppItem.lr-start-menu-item(v-for='(v, k) in sysAppMap',
                                :item="v",
                                v-if="!v.hidden"
                                :id='k',
                                :key="k")
    hr
    .lr-start-bottom-menu
      .lr-btn(@click="handleSettingsClick")
        span.iconfont.icon-info(title="About")
      router-link.lr-btn(to='/' target='_blank')
        span.iconfont.icon-accountmultiple(title="Login with other account")
      .lr-btn(@click="logout", style="color: red")
        span.iconfont.icon-logout(title="Exit")
</template>
<script>
import AppItem from './app-item.vue';
import FocusMenu from '../focus-menu/base.vue';
import LRIcon from '../../cmpt/icon/icon.vue';
export default {
  components: {
    AppItem,
    FocusMenu,
    LRIcon
  },

  // data(){
  //   return {
  //     isShowMenu: false,
  //     appList: []
  //   }
  // },
  computed: {
    sysAppMap(){
      return this.$store.state.sysApps.sysMap;
    },
    username(){
      return this.$store.state.username;
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].start;
    }
  }, 
  methods: {
    logout(){

    },
    handleAccountClick(){
      this.$store.commit('task/add', 'sys_app_account');
    },
    handleSettingsClick(){
      this.$store.commit('task/add', 'sys_app_settings');
    }
  }
}
</script>