<style>
body{
  padding:0; margin:0;
}
.lr-select-warp{
  position: absolute;
  width:0;
  height: 0;
  border: 1px dotted #000;
  z-index: 999999999;
  background-color: rgba(255, 0, 0, 0.5);
}

</style>
<template lang='jade'>
.lr-un-drag(@mousedown='mousedownListener')
  .lr-select-warp(v-show='isSelect',
  :style='style')
    //-span X:{{offsetX}} Y: {{offsetY}} w:{{w}} h:{{h}}
  slot
</template>

<script>
export default {
  props: ['start'],
  data(){
    return {
      isSelect : false,
      startClientX : 0,
      startClientY : 0,
      startOffsetX : 0,
      startOffsetY : 0,
      offsetX : 0,
      offsetY : 0,
      w: 0,
      h: 0
    }
  },
  computed: {
    style(){
      const {offsetX, offsetY, w, h} = this;
      return `top:${offsetY}px; left:${offsetX}px; width:${w}px; height:${h}px;`
    }
  },
  methods: {
    // clearSelected(){
    //   if(!this.isSelect){
    //     this.$children.forEach(item => {
    //       if(item.beSelectable && item.beSelected){
    //         item.beSelected = false;
    //       }
    //     });
    //   }
    // },
    selectStart (areaXY) {
      this.isSelect = true;
      Object.assign(this, areaXY);
    },
    selecting (moveE) {
      const {startOffsetY, startOffsetX, startClientX, startClientY} = this;
      const w = moveE.clientX - startClientX;
      const h = moveE.clientY - startClientY;
      if(w < 0){
        this.offsetX = startOffsetX + w;
      }
      if(h < 0){
        this.offsetY = startOffsetY + h;
      }
      this.w = Math.abs(w);
      this.h = Math.abs(h);
      this.childSelect();
    },
    selectEnd () {
      this.childSelect();
      this.isSelect = false;
      this.w = 0;
      this.h = 0;
    },
    mousedownListener(e){
      e.stopPropagation();
      const self = this;
      self.selectStart({
        offsetX : e.offsetX,
        offsetY: e.offsetY,
        startOffsetX : e.offsetX,
        startOffsetY : e.offsetY,
        startClientX: e.clientX,
        startClientY: e.clientY
      });
      window.addEventListener('mousemove', mousemoveListener);
      window.addEventListener('mouseup', mouseupListener, {
        once: true
      });

      function mousemoveListener(e){
        e.preventDefault();
        self.selecting(e);
      }

      function mouseupListener(){
        self.selectEnd();
        window.removeEventListener('mousemove', mousemoveListener);
      }
    },
    passX(item){
      //鼠标从左向右划
      if(item.x > this.offsetX){
        if(item.x < this.offsetX + this.w){
          return true;
        }
      }else{ //鼠标从右向左划
        if(item.x + item.w > this.offsetX){
          return true;
        }
      }
      return false;
    },
    passY(item){
      if(item.y > this.offsetY){  //鼠标从上向下划
        if(item.y < this.offsetY + this.h){
          return true;
        }
      }else{ //鼠标从下向上划
        if(item.y + item.h > this.offsetY){
          return true;
        }
      }
      return false;
    },
    childSelect(){
      this.$children.forEach(item => {
        if(item.beSelectable){
          if(this.passX(item) && this.passY(item)){
            item.beSelected = true;
          }else{
            item.beSelected = false;
          }
        }
      })
    }
  },
  mounted(){
    //console.log(this.$children)
  }
}
</script>
