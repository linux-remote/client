<template lang="jade">
.lr-quick-launch
  .lr-groove
  .lr-ridge
  .lr-quick-bar(:style="{width: width + 'px'}")
    .lr-quick-item(v-for="v in list")
      LRIcon(:type="v.icon.type", :value="v.icon.value")
  FocusMenu(cssBase="lr-more", v-if="moreList.length")
    template(v-slot:btn)
      span.iconfont.icon-more
    template(v-slot:menu)
      div(style="padding: 1px")
        .lr-quick-more-item(v-for="v in moreList")
          LRIcon(:type="v.icon.type", :value="v.icon.value")
          | {{v.name}}
  .lr-groove
  .lr-ridge
  Resizable(direction="r", @resizeStart="handleResizeStart", @resizing="handleResizing", @resized="handleResized", :minWidth="69", :maxWidth="460")
</template>
<script>
import Resizable from '../../unit/resizable.vue';
import FocusMenu from '../focus-menu/base.vue';
import LRIcon from '../../cmpt/icon/icon.vue';
const ITEM_WIDTH = 23;
const MIN_WIDTH = ITEM_WIDTH * 3;
export default {
  components: {
    Resizable,
    FocusMenu,
    LRIcon
  },
  data(){
    let w = localStorage.quickLaunchWidth;
    return {
      list: [],
      moreList: [],
      width: w ? Number(w) : MIN_WIDTH
    }
  },
  watch: {
    width(){
      this.parse();
    }
  },
  methods: {
    handleResizeStart(virtual){
      virtual.width = this.width;
    },
    handleResizing(virtual){
      this.width = virtual.width;
    },
    handleResized(virtual){
      localStorage.quickLaunchWidth = virtual.width;
    },
    parse(rawList){
      if(!rawList){
        return;
      }
      let list = [], moreList = [];
      let crrList = list;
      let limitLen = Math.floor(this.width / ITEM_WIDTH) - 1;
      for(let i = 0, len = rawList.length; i < len; i++){
        if(i > limitLen){
          crrList = moreList
        }
        crrList.push(rawList[i]);
      }
      this.list = list;
      this.moreList = moreList;
    }
  },
  created(){
    this.$store.commit('wsRequest',{
      method: 'getQuickLaunchItems',
      success: (data) => {
        this.parse(data);
      }
    });
  },
  mounted(){
    // this.$options._rawList = [{
    //     icon: {
    //       type: 'img',
    //       value: '/public/note.jpg'
    //     },
    //     name: 'note.txt'
    //   },{
    //     icon: {
    //       type: 'img',
    //       value: '/public/note.jpg'
    //     },
    //     name: 'note.txt'
    //   },{
    //     icon: {
    //       type: 'img',
    //       value: '/public/note.jpg'
    //     },
    //     name: 'note.txt'
    //   },{
    //     icon: {
    //       type: 'img',
    //       value: '/public/note.jpg'
    //     },
    //     name: 'note.txt'
    //   },{
    //     icon: {
    //       type: 'css',
    //       value: 'iconfont icon-logo_LR'
    //     },
    //     name: 'note.txt'
    //   }]
    // this.parse();
  }
}
</script>