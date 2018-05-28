
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
}
.lr-start-menu-item:hover{
  background-color:#eee;
  color:#000;
}
</style>
<template lang="jade">
.lr-start
  .lr-start-btn(@click='handleClick', @mousedown.stop='')
  .lr-start-menu(v-show="isShowMenu", 
                @mousedown.stop='')
    .lr-start-menu-item 系统信息
    .lr-start-menu-item 用户信息
    .lr-start-menu-item 所有程序
    .lr-start-menu-item(v-for='v in appList',
                        :key="v.id")
      {{v.title}}
</template>

<script>

export default {
  data(){
    return {
      isShowMenu: false
    }
  },
  computed: {
    appList(){
      return this.$store.state.appMap
    }
  },
  methods: {
    handleDocumentMousedown(){
      this.isShowMenu = false;
      console.log('handleDocumentMousedown')
    },
    handleClick(){
      this.isShowMenu = !this.isShowMenu;
      if(this.isShowMenu){
        document.addEventListener('mousedown', this.handleDocumentMousedown, {once: true})
      }else {
        document.removeEventListener('mousedown', this.handleDocumentMousedown);
      }
    }
  }
}
</script>
