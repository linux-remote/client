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
    span X:{{layerX}} Y: {{layerY}} w:{{w}} h:{{h}}
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

      pw: 0,
      ph: 0,
      pscrollTop: 0,
      pscrollLeft: 0,


      _timerY: null,
      _scrollYN: null,

      _scrollTotalH: 0
    
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
    //       if(item.beSelectable && item.beSelected){
    //         item.beSelected = false;
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

        startLayerX: e.layerX,
        startLayerY: e.layerY,
        
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
      if(!isLoop && this.$data._timerY){
        clearTimeout(this.$data._timerY);
        this.$data._timerY = null;
      }

      var shouldLoop = false;

      const el = this.$el;
      const {startScrollLayerY, startScrollLayerX, startClientX, startClientY, maxW, maxH, startScrollTop} = this;
      


      var w = moveE.clientX - startClientX;
      if(w < 0){ // 鼠标向左划 .
      
        this.layerX =  startScrollLayerX + w;
        if(this.layerX < 0){  // 左 border
          this.layerX = 0;
          w = startScrollLayerX;
        }
        if(this.layerX < el.scrollLeft){ // 左滚动条
          el.scrollLeft = this.layerX;
        }
      } else { // 鼠标向右划
        this.layerX = startScrollLayerX;
        let sxw = startScrollLayerX + w;

        if(sxw > maxW){ // 右 border
          w = maxW - startScrollLayerX;
          sxw = startScrollLayerX + w;
        }

        if(sxw > (el.scrollLeft + el.clientWidth)){  //右滚动条
           el.scrollLeft = sxw - el.clientWidth
        }
      }

      this.w = Math.abs(w);

      // **************************** H ******************************


        var scrollH = el.scrollTop - this.startScrollTop;
        //var clientDistance = moveE.clientY - startClientY;
        var h = moveE.clientY - startClientY + scrollH;

        var y;
        if(h < 0){
          y = startScrollLayerY + h;

          // 边界
          if(y < 0){  //上 border
            y = 0;
            h = startScrollLayerY;
          }
          h = Math.abs(h);


          if(y < el.scrollTop){
            el.scrollTop = el.scrollTop - (el.scrollTop - this.layerY);
            shouldLoop = true;
          }
          
        }else{
          y = startScrollLayerY;
          
          // 边界
          if(h + startScrollLayerY > maxH){  //上 border
            h = maxH - startScrollLayerY;
          }
          
          var sCLYh = this.startScrollLayerY  + h;
          var sTcH = el.scrollTop + el.clientHeight;
          if(sCLYh > sTcH){
            //el.scrollTop = el.scrollTop - (el.scrollTop - this.layerY);
            if(maxH > sTcH){
              el.scrollTop = el.scrollTop + (sCLYh - sTcH);
              shouldLoop = true;
            }
          }

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
        this.$data._timerY = setTimeout(() => {
          this.selecting(moveE, true);
        }, 100);

      }else{
        this.$data._timerY = null;
      }

    },
    selectEnd () {
      this.childSelect();
      if(this.$data._timerY){
        clearTimeout(this.$data._timerY);
      }
      this.isSelect = false;
      this.w = 0;
      this.h = 0;
      if(this.onSelected){
        const arr = []
        this.$children.forEach(item => {
          if(item.$options.beSelectable && item.beSelected){
            arr.push(item)
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
      this.$children.forEach(item => {
        if(item.$options.beSelectable){
          if(this.passX(item) && this.passY(item)){
            item.beSelected = true;
          }else{
            item.beSelected = false;
          }
        }
      })
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
