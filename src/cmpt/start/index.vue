
<style>
.lr-start{
  width: 80px;
  position: relative;
  display: flex;
}
.lr-start-btn{
  width: 100px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('/public/img/tango-style/start-here.png');
  border: 1px outset #999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lr-start-menu{
  bottom:100%;
  position: absolute;
  left: 0;
  background-color: #888;
  width: 300px;
  height: 500px;
}
.lr-start-menu-item{
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
  padding-left: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;

}
.lr-start-menu-item:hover{
  background-color:#eee;
  color:#000;
}
</style>
<template lang="jade">
.lr-start
  .lr-start-btn(@click='handleClick')
  .lr-start-menu(v-show="isShowMenu")
    .lr-start-menu-item 系统信息
    .lr-start-menu-item 用户信息
    .lr-start-menu-item 所有程序
    br
    AppItem.lr-start-menu-item(v-for='(v, k) in appList',
                              :item="v",
                              :id="k",
                              :key="k")
      .lr-sys-app-icon(:style="`background-image:url(${v.iconUrl})`") 
      .lr-sys-app-title {{v.title}}
</template>

<script>
import AppItem from './app-item.vue';
export default {
  components: {
    AppItem
  },
  data(){
    return {
      isShowMenu: false
    }
  },
  computed: {
    appList(){
      return this.$store.state.app.map
    }
  },
  methods: {
    handleDocMousedown(e){
      console.log('handleDocMousedown');
      if(this.$el === e.target || this.$el.contains(e.target)){
        return;
      }else{
        //console.log('remove by doc mousedown');
        document.removeEventListener('mousedown', 
          this.handleDocMousedown, 
          true); // true is capture! must set.
        this.isShowMenu = false;
      }
    },
    handleClick(){
      this.isShowMenu = !this.isShowMenu;
      if(this.isShowMenu){
        //console.log('Listener by click');
        document.addEventListener('mousedown', this.handleDocMousedown, {
          capture: true
        })
      }else {
        //console.log('remove by click');
        document.removeEventListener('mousedown', this.handleDocMousedown, true);
      }
    }
  }
}
</script>
