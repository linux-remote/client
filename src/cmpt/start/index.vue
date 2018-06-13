<template lang="jade">
.lr-start
  .lr-start-btn(@click='handleBtnClick', :class='{lr_start_focus: isShowMenu}')
  .lr-start-menu(v-show="isShowMenu")
    .lr-start-menu-item 系统信息
    .lr-start-menu-item 用户信息
    .lr-start-menu-item 系统程序
    AppItem.lr-start-menu-item(v-for='(v, k) in sysAppMap',
                              :item="v",
                              :id='k',
                              :key="k")
    .lr-start-menu-item 第三方程序
    AppItem.lr-start-menu-item(v-for='(v, k) in thirdPartyAppMap',
                              :item="v",
                              :id='k',
                              :key="k")
</template>

<script>
import AppItem from './app-item.vue';
const API_ROOT = window.SERVER_CONFIG.API_ROOT;
export default {
  components: {
    AppItem
  },
  data(){
    return {
      isShowMenu: false,
      appList: []
    }
  },
  computed: {
    sysAppMap(){
      return this.$store.state.app.sysMap;
    },
    thirdPartyAppMap(){
      return this.$store.state.app.thirdPartyMap;
    }
  }, 
  methods: {
    handleBtnClick(){
      this.isShowMenu = !this.isShowMenu;
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

    getData(){
      this.request({
        url: '/app/list',
        success(data){
          var map = Object.create(null);
          data.forEach((v) => {
            v.main = '/app' + v.staticPath + '/' + v.main;
            v.iconUrl = API_ROOT + '/app' + v.staticPath + '/' + v.icon;
            // v.main = API_ROOT + '/app' + v.staticPath + '/' + v.main;
            delete(v.icon);
            delete(v.staticPath);
            map[v.id] = v;
            delete(v.id);
          });
          this.$store.commit('app/setThirdPartyMap', map);
        }
      })
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
    }
  },
  mounted(){
    this.getData();
  }
}
</script>
