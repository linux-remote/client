<style>
.lr-cascade{
  position: relative;
}
.lr-cascade-menu{
  position: absolute;
  top: 0;
  min-width: 200px;
  background-color: #fff;
  color: #000;
}
</style>
<template lang="jade">
.lr-cascade(@mouseenter='handleMouseenter', @mouseleave='handleMouseleave')
  slot
  .lr-cascade-menu(v-show='isShowMenu', ref='menu', :style='styleStr', @mouseleave.stop='hendleMenuMouseleave')
    slot(name='menu')
</template>

<script>
export default {
  data(){
    return {
      isShowMenu: false,
      styleStr: ''
    }
  },
  methods: {
    handleMouseenter(e){
      this.isShowMenu = true;
      this.$nextTick(() => {
        const left = e.clientX - e.offsetX;
        const width = this.$el.offsetWidth;
        const menuWidth = this.$refs.menu.offsetWidth;
        if(left + width + menuWidth > this.$store.state.winW){
          this.styleStr = 'right: 100%';
        }else{
          this.styleStr = 'left: 100%;';
        }
      })

    },
    hendleMenuMouseleave(e){
      //console.log('e.toElement === this.$el', e.toElement === this.$el);
      if(e.toElement !== this.$el){
        this.isLeaveOutFromMenu = true; //从菜单移出.
        this.$parent.$el.addEventListener('mouseenter', () => {
          this.isShowMenu = false;
        }, {
          once: true
        })
      }
    },
    handleMouseleave(){
      if(this.isLeaveOutFromMenu){
        this.isLeaveOutFromMenu = false;
        return;
      }

      this.isShowMenu = false;
    }
  }
}
</script>
