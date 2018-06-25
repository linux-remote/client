<template lang="jade">
.lr-start
  .lr-start-btn(@click='handleBtnClick', :class='{lr_start_focus: isShowMenu}')
  .lr-start-menu(v-show="isShowMenu")
    .lr-start-menu-title 系统程序
    AppItem.lr-start-menu-item(v-for='(v, k) in sysAppMap',
                              :item="v",
                              :id='k',
                              :key="k")
    //-.lr-start-menu-item 第三方程序
    //-AppItem.lr-start-menu-item(v-for='(v, k) in thirdPartyAppMap',
                              :item="v",
                              :id='k',
                              :key="k")
</template>

<script>
import AppItem from './app-item.vue';

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
    // thirdPartyAppMap(){
    //   return this.$store.state.app.thirdPartyMap;
    // }
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
  }
}
</script>
