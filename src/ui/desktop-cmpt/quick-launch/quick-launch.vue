<template lang="jade">
.lr-quick-launch
  .lr-groove
  .lr-ridge
  .lr-quick-bar(:style="{width: width + 'px'}",
                :class="{lr_dragenter_self: isDragenterSelf}",
              @dragenter.self='handleDragenter',
              @dragleave.self="handleDragleave",
              @dragover='handleDragover',
              @drop='handleDrop')
    Item.lr-quick-item(v-for="(v,i) in list",
        :item="v",
        :index='i',
        :key="v.id")
  FocusMenu(cssBase="lr-more", v-if="moreList.length")
    template(v-slot:btn)
      span.iconfont.icon-more
    template(v-slot:menu)
      div(style="padding: 1px")
        Item.lr-quick-more-item(v-for="(v,i) in moreList",
            :item="v",
            :index='i',
            :key="v.id",
            :isShowName="true")
  .lr-groove
  .lr-ridge
  Resizable(direction="r", @resizeStart="handleResizeStart", @resizing="handleResizing", @resized="handleResized", :maxWidth="460")
</template>
<script>
import Resizable from '../../unit/resizable.vue';
import FocusMenu from '../focus-menu/base.vue';
import LRIcon from '../../cmpt/icon/icon.vue';
import Item from './item.vue';
const ITEM_WIDTH = 23;
export default {
  components: {
    Resizable,
    FocusMenu,
    LRIcon,
    Item
  },
  data(){
    return {
      rawList: [],
      isDragenterSelf: false,
      width: 0
    }
  },

  computed: {
    limitLen(){
      let len = Math.floor(this.width / ITEM_WIDTH);
      return len > this.rawList.length ? this.rawList.length : len;
    },
    list(){
      let arr = [];
      for(let i = 0, len = this.limitLen; i < len; i++){
        arr.push(this.rawList[i]);
      }
      return arr;
    },
    moreList(){
      let arr = [];
      for(let i = this.limitLen, len = this.rawList.length; i < len; i++){
        arr.push(this.rawList[i]);
      }
      return arr;
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
      this.$store.commit('wsRequest', {
        method: 'saveQuickLaunchWidth',
        data: virtual.width,
        success(){
          console.log('save quickBarWidth ok');
        }
      });
    },
    handleDragenter(){
      console.log('handleDragenter')
      this.isDragenterSelf = true;
    },
    handleDragleave(){
      this.isDragenterSelf = false;
    },
    handleDragover(e){
      e.preventDefault();
    },
    _getDragData(e){
      const data = e.dataTransfer.getData('text');
      if(!data){
        return;
      }
      return JSON.parse(data);
    },
    getDropIndex(offsetX){
      let x = offsetX < 0 ? 0 : offsetX;
      x = Math.round(x / ITEM_WIDTH);
      
      x = x >= this.rawList.length ? this.rawList.length : x;
      return x;
    },
    handleDrop(e){

      if(!this.isDragenterSelf){
        return;
      }
      this.isDragenterSelf = false;
      var data = this._getDragData(e);
      if(!data){
        return;
      }
      var id = data.id;
      const isHave = this.list.find(function(v){
        return v.id === id;
      })

      if(isHave){
        console.error('Alreay have');
        return;
      }
      const index = this.getDropIndex(e.offsetX);
      this.rawList.splice(index, 0, {
        id: data.id
      });
      this.save();
    },
    getData(){
      this.$store.commit('wsRequest',{
        method: 'getQuickLaunch',
        success: (data) => {
          if(!data){
            data = {
              list: []
            }
          } else {
            data = JSON.parse(data);
          }
          if(data.width){
            this.width = data.width;
          }
          this.rawList = data.list;
        }
      });
    },
    save(){
      this.$store.commit('wsRequest', {
        method: 'saveQuickLaunch',
        data: JSON.stringify({
          width: this.width,
          list: this.rawList
        }),
        success(){
          console.log('save quickBar ok');
        }
      });
    }
  },
  created(){
    this.getData();
  },
  mounted(){
  }
}
</script>