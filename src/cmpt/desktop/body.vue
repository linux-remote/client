<template lang="jade">
#lr-desktop.lr-desktop(@drop.stop='handleDeskDrop',
                    @dragenter.stop='handleDragenter',
                    @dragover.stop='handleDragover',
                    @mousedown='handleMousedown')
  .lr-desktop-icons
    Icon(v-for="(v,i) in list",
        :key="v.id",
        :index="i",
        :item="v")

  ContextMenu(ref='ctx')
    .lr-ctx-item(@click="sortIcon")
      | {{LANG.ctx.SortOut}}
    .lr-ctx-item(@click="reload")
      | {{LANG.ctx.Refresh}}
  //- UsersChat
  TaskWindow(v-for='(item, index) in tasks', :key='item.id', :index='index')
</template>
<script>

import Icon from './icon.vue';
import TaskWindow from '__ROOT__/cmpt/task/window/window.vue';

import ContextMenu from '../global/contextmenu/index.vue';
//import Cascade from '../global/cascade.vue';
const ICON_WIDTH = 80;
const ICON_HEIGHT = 80;
export default {
  components: {
    Icon,
    TaskWindow,
    ContextMenu,
    //Cascade
  },
  props: ['icons'],
  data(){

    return {
      list: this.getIconsFromProp(),
      _isInDesk: false
    }

  },
  computed:{
    deskTopEvent(){
      return this.$store.state.deskTopEvent
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].deskTop
    },
    tasks(){
      return this.$store.state.task.list;
    }
  },
  watch: {
    deskTopEvent(e){
      switch(e.type){
        case 'add':
          this.list.push(e.item);
          this.save();
          break;
        case 'quickLaunch':
          console.log('quickLaunch');
          break;
      }
    }
  },
  methods: {
    getIconsFromProp(){
      var icons = this.icons;

      if(!icons){ // 回收站可以被移除
        icons = [{
          id: 'sys_app_recycle_bin',
          x:0,
          y:0
        }]

      }else{
        icons = JSON.parse(icons);
      }
      
      icons = this.forMatList(icons);
      return icons;
    },
    wrapItem(v){
      const app = this.$store.getters['sysApps/getById'](v.id);
      Object.assign(v, app);
    },
    forMatList(arr){
      arr.forEach(v => {
        this.wrapItem(v);
      });
      return arr;
    },
    handleDragenter(e){
      e.preventDefault();
    },
    handleDragover(e){
      e.preventDefault();
    },
    handleMousedown(e){
      if(!e._isHandle){
        this.$store.commit('task/currentUnFocus');
      }
    },
    sortIcon(){
      let deskH = this.$el.offsetHeight;
      let maxRow = Math.floor(deskH / ICON_HEIGHT);
      let cum = 0;
      this.list.forEach((v, i) => {
        v.x = cum * ICON_WIDTH;
        if( i > maxRow){
          cum = cum + 1;
        }
        v.y = (i % maxRow) * ICON_HEIGHT;
      })
      this.save();
      this.$refs.ctx.hidden();
    },
    reload(){
      this.getData();
      this.$refs.ctx.hidden();
    },
    _getDragData(e){
      const data = e.dataTransfer.getData('text');
      return JSON.parse(data);
    },
    save(){
        const arr = this.list.map(v => {
          return {
            id: v.id,
            x: v.x,
            y: v.y
          }
        });
        // console.log('save', arr);

        
        this.request({
          url: '~/desktop/icons',
          type: 'post',
          data: {
            content: JSON.stringify(arr)
          },
          success(){
            console.log('desktop save ok');
          }
        })

    },
    handleDeskDrop(e){
      // console.log('handleDeskDrop');
      e.preventDefault();
      const data = this._getDragData(e);
      if(!data){
        return;
      }
      const item = this.list.find(v => v.id === data.id);
      if(item){
        if(data.from === 'desktop'){
          this.setDropedItemXY(data, item, e);
        } else {
          this.$store.commit('error/show', 'The icon already exists on the desktop.');
        }
        
        this.save();
      } else {
        if(data.from === 'startMenu'){
          let newItem = {
            id: data.id,
            x: e.clientX,
            y: e.clientY
          }
          this.wrapItem(newItem);
          const xy = this.keepIconIn(e.clientX, e.clientY);
          newItem.x = xy.x;
          newItem.y = xy.y;
          this.list.push(newItem);
          this.save();
        }
      }
      
    },
    setDropedItemXY(data, item, e){
      const startClient = data.startClient;
      const positionLeft =  item.x + (e.clientX - startClient.x);
      const positionTop = item.y  + (e.clientY - startClient.y);
      

      const result = this.keepIconIn(positionLeft, positionTop);

      item.x = result.x;
      item.y = result.y;
    },
    keepIconIn(x, y){
      if(x < 0){
        x = 0;
      } else {
        const deskW = this.$el.offsetWidth;
        const elW = ICON_WIDTH;
        if(x + elW > deskW){
          x = deskW - elW;
        }
      }
      if(y < 0){
        y = 0;
      } else {
        const deskH = this.$el.offsetHeight;
        const elH = ICON_HEIGHT;
        if(y + elH > deskH){
          y = deskH - elH;
        }
      }
      return {
        x,
        y
      }
    },
    getData(){
      this.request({
        url: '~/desktop/icons',
        success(result){
          if(!result){
            return;
          }
          result = JSON.parse(result);
          this.list = this.forMatList(result);
        }
      })
    }
  },
  created(){

      this.$options._isCanDrop = true;
  },
  mounted(){
    this.$store.commit('setDeskTopWH');
    // this.$store.commit('task/add', {appId: 'sys_app_recycle_bin'});
    // this.$store.commit('task/add', {appId: 'sys_app_fs', address: '/home/dw/fs'});
    // this.$store.commit('task/add', {appId: 'sys_app_fs', address: '/home/dw/fs2'});
    this.$store.commit('task/add', {appId: 'sys_app_settings'});
  }
}
    // Cascade.lr-ctx-item
    //   | 设置桌面壁纸
    //   .lr-test-parent(slot='menu')
    //     .lr-ctx-item 选择
    //     .lr-ctx-item 上传
    //     Cascade 333
    //       div(slot='menu')
    //         .lr-ctx-item 333
    //         .lr-ctx-item 333
    //         Cascade 444
    //           div(slot='menu')
    //             .lr-ctx-item 444
    //             .lr-ctx-item 444
</script>
