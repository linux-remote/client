
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
  background-image: url(/public/img/tango-style/start-here.png);
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
</style>
<template lang="jade">
.lr-start
  .lr-start-btn(@click='handleClick', @mousedown.stop='')
  .lr-start-menu(v-show="isShowMenu", 
                @mousedown.stop='')
</template>

<script>

export default {
  data(){
    return {
      isShowMenu: false
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
