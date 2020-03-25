<template lang="jade">
FocusMenu(cssBase="lr-start")
  template(v-slot:btn)
    LRIcon(type="css", value="iconfont icon-logo_LR")
    | Start
  template(v-slot:menu)
    //- .lr-start_inner
    //-   .lr-start_left
    .lr-start-username(@click="handleAccountClick") {{username}}
    .lr-hr
    .lr-start-apps
      AppItem.lr-start-menu-item(v-for='(v, k) in sysAppMap',
                                :item="v",
                                v-if="!v.hidden"
                                :id='k',
                                :key="k")
    .lr-hr
    .lr-start_bottom
      .lr-btn_nf(@click="handleSettingsClick")
        span.iconfont.icon-info(title="About")
      router-link.lr-btn_nf(to='/' target='_blank')
        span.iconfont.icon-accountmultiple(title="Login with other account")
      .lr-btn_nf(@click="logout", style="color: red")
        span.iconfont.icon-logout(title="Exit")
</template>
<script>
import AppItem from './app-item.vue';
import FocusMenu from '../focus-menu/base.vue';
import LRIcon from '../../cmpt/icon/icon.vue';
import sysAppMap from '../../../store/module/sys-apps-map';
export default {
  components: {
    AppItem,
    FocusMenu,
    LRIcon
  },

  data(){
    return {
      sysAppMap
    }
  },
  computed: {
    // sysAppMap(){
    //   return this.$store.state.sysApps.sysMap;
    // },
    username(){
      return this.$store.state.username;
    }
  }, 
  methods: {
    logout(){
      this.$store.commit('wsRequest', {
        method: 'logout',
        noReply: true
      });
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