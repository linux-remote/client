<style>
.lr-select-area{
  position: absolute;
  width:0;
  height: 0;
  border: 1px solid #000;
  z-index: 999999999;
  background-color: rgba(11, 170, 104, 0.5);

}
</style>
<template lang='jade'>
div(@mousedown='mousedownListener', v-on='$listeners')
  .lr-select-area(v-show='isSelect',:style='style')
    //-span X:{{layerX}} Y: {{layerY}} w:{{w}} h:{{h}}
  slot
</template>

<script>
export default {
  props: ['onSelected'],
  data(){
    return {
      isSelect : false,
      startClientX : 0,
      startClientY : 0,
      startScrollLayerX : 0,
      startScrollLayerY : 0,
      layerX : 0,
      layerY : 0,
      w: 0,
      h: 0,
      _timer: null
    }
  },
  computed: {
    style(){
      const {layerX, layerY, w, h} = this;
      return `top:${layerY}px; left:${layerX}px; width:${w}px; height:${h}px;`
    }
  },
  methods: {
    // clearSelected(){
    //   if(!this.isSelect){
    //     this.$children.forEach(item => {
    //       if(item.beSelectable && item.isBeSelected){
    //         item.isBeSelected = false;
    //       }
    //     });
    //   }
    // },
    selectStart (e) {
      this.isSelect = true;
      const el = this.$el;
      const x = e.layerX + el.scrollLeft;
      const y = e.layerY + el.scrollTop;
      Object.assign(this, {
        layerX :x,
        layerY: y,
        startScrollLayerX : x,
        startScrollLayerY : y,

        startClientX: e.clientX,
        startClientY: e.clientY,

        startScrollTop: el.scrollTop,
        startScrollLeft: el.scrollLeft,

        maxW: el.scrollWidth,
        maxH: el.scrollHeight
      });
    },
    selecting (moveE, isLoop) {
      
      if(!isLoop && this.$data._timer){
        clearTimeout(this.$data._timer);
        this.$data._timer = null;
      }

      var shouldLoop = false;

      const el = this.$el;
      const {startScrollLayerY, 
              startScrollLayerX, 
              startClientX, 
              startClientY, 
              maxW, 
              maxH} = this;

      // **************************** W ******************************

      var scrollW = el.scrollLeft - this.startScrollLeft;
      var w = moveE.clientX - startClientX + scrollW;
      var x;

      var sCLXw = startScrollLayerX  + w;
      var sLcW = el.scrollLeft + el.clientWidth;

      if(w < 0){ // 鼠标向左划 .
        x = sCLXw;

        // 边界
        if(x < 0){  // 左 border
          x = 0;
          w = startScrollLayerX;
        }
        w = Math.abs(w);

        // ==================================================
        if(x < el.scrollLeft){
          el.scrollLeft = el.scrollLeft - (el.scrollLeft - this.layerX);
          shouldLoop = true;
        } else if(x > sLcW){
          el.scrollLeft = el.scrollLeft + (x - sLcW);
          shouldLoop = true;
        }
        // ==================================================

      } else { // 鼠标向右划

        x = startScrollLayerX;
        // 边界
        if(sCLXw > maxW){  //上 border
          w = maxW - startScrollLayerX;
        }

        // ==================================================
        if(sCLXw > sLcW){
          if(maxW > sLcW){
            el.scrollLeft = el.scrollLeft + (sCLXw - sLcW);
            shouldLoop = true;
          }
        } else if(sCLXw < el.scrollLeft){
            el.scrollLeft = el.scrollLeft - (el.scrollLeft - sCLXw);
            shouldLoop = true;
        }
        // ==================================================
      }

      this.layerX =  x;
      this.w = w;
      
      // **************************** H ******************************

        var scrollH = el.scrollTop - this.startScrollTop;
        var h = moveE.clientY - startClientY + scrollH;
        var y;

        var sCLYh = startScrollLayerY  + h;
        var sTcH = el.scrollTop + el.clientHeight;

        if(h < 0){
          y = sCLYh;

          // 边界
          if(y < 0){  //上 border
            y = 0;
            h = startScrollLayerY;
          }
          h = Math.abs(h);

          // ==================================================
          if(y < el.scrollTop){
            el.scrollTop = el.scrollTop - (el.scrollTop - this.layerY);
            shouldLoop = true;
          } else if(y > sTcH){
            el.scrollTop = el.scrollTop + (y - sTcH);
            shouldLoop = true;
          }
          // ==================================================

        }else{
          y = startScrollLayerY;
          // 边界
          if(sCLYh > maxH){  //上 border
            h = maxH - startScrollLayerY;
          }

          // ==================================================
          if(sCLYh > sTcH){
            if(maxH > sTcH){
              el.scrollTop = el.scrollTop + (sCLYh - sTcH);
              shouldLoop = true;
            }
          } else if(sCLYh < el.scrollTop){
              el.scrollTop = el.scrollTop - (el.scrollTop - sCLYh);
              shouldLoop = true;
          }
          // ==================================================

        }

        this.layerY =  y;
        this.h = h;



        // const loopTop = () => {
        //   if(y  < el.scrollTop){
        //     el.scrollTop = el.scrollTop + (el.scrollTop - y)
        //     setTimeout(loopTop, 100)
        //   }
        // }


      // **************************** H end ******************************

      
      
      this.childSelect();


      if(shouldLoop){
        this.$data._timer = setTimeout(() => {
          this.selecting(moveE, true);
        }, 100);

      }else{
        this.$data._timer = null;
      }

    },
    selectEnd () {
      if(this.$data._timer){
        clearTimeout(this.$data._timer);
      }
      this.isSelect = false;
      this.w = 0;
      this.h = 0;
      if(this.onSelected){
        // const arr = this.childSelect();
        const arr = [];
        this.$children.forEach(item => {
          if(item.$options.beSelectable && item.isBeSelected){
            arr.push(item.item);
          }
        })
        this.onSelected(arr);
      }

    },
    mousedownListener(e){
      //e.stopPropagation();
      const self = this;
      self.selectStart(e);
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
      const el = item.$el;
      if(el.offsetLeft > this.layerX){
        if(el.offsetLeft < this.layerX + this.w){
          return true;
        }
      }else{ //鼠标从右向左划
        if(el.offsetLeft + el.offsetWidth > this.layerX){
          return true;
        }
      }
      return false;
    },
    passY(item){
      const el = item.$el;
      if(el.offsetTop > this.layerY){  //鼠标从上向下划
        if(el.offsetTop < this.layerY + this.h){
          return true;
        }
      }else{ //鼠标从下向上划
        if(el.offsetTop + el.offsetHeight > this.layerY){
          return true;
        }
      }
      return false;
    },
    childSelect(){
      // let selectedIndex = 0;
      // const arr = [];
      this.$children.forEach((item, i) => {
        if(item.$options.beSelectable){
          if(this.passX(item) && this.passY(item)){
            item.isBeSelected = true;
            // selectedIndex = selectedIndex + 1;
            // arr.push(item);
          }else{
            item.isBeSelected = false;
          }
        }
      });
      // return arr;
    }
  },
  // mounted(){
  //   this.$parent.el.addEventListener('mousedown', this.mousedownListener)
  //  //console.log(this.$el)
  // },
  // destroyed(){
  //   this.$parent.removeEventListener('mousedown', this.mousedownListener)
  // }
}
</script>
