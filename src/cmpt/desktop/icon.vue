<style>
.lr-desk-icon{
  position: absolute;
  width: 80px;
  height: 80px;
  user-select: none;
  display:flex;
  flex-direction: column;
  align-items: center;
    z-index:1;
}

.lr-desk-icon-img{
  /* height: 60px; */
  height: 50px;
  width: 100%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.lr-desk-icon-text{
  font-size: 12px;
  line-height: 15px;
  word-break: break-all;
  height: 30px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lr-desk-icon:hover{
  background-color: rgba(255, 255, 255, 0.25);
}

</style>
<template lang="jade">
.lr-desk-icon(draggable="true",
              @dblclick="handleDblclick",
              @dragstart.stop='handleDragStart(item, $event)',
              :style='{left: item.x + "px", top: item.y + "px"}')
  .lr-desk-icon-img(:style="{backgroundImage: `url(${app.iconUrl})`}")
  .lr-desk-icon-text {{app.title}}

  ContextMenu(ref='ctx')
    
    .lr-ctx-item(@click="remove")
      | 移除
    .lr-ctx-item(v-if='item.id === "sys_app_recycle_bin"', @click="clearRecycleBin")
      | 清空
</template>
<script>

import ContextMenu from '../global/contextmenu/index.vue';
export default {

  components: {
    ContextMenu
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  computed: {
    app(){
      return this.$store.getters['app/getById'](this.item.id)
    },
    // currTitle(){
    //   return this.item.title || this.app.title
    // }
  },
  methods: {
    clearRecycleBin(){
      this.request({
        url: '~/recycleBin',
        type: 'delete',
        success(){
          this.$store.commit('recycleBinTrigger', true);
          this.$refs.ctx.hidden();
        }
      })
    },
    hidden(){
      this.$refs.ctx.hidden();
    },
    remove(){
      this.$nextTick(()=> {
        this.$parent.list.splice(this.index, 1);
        this.$parent.save();
      })
    },
    handleDblclick(){
      this.$store.commit('task/add', this.item.id);
    },
    handleDragStart(v, e){
      this.$store.commit('transferDragData', {
        id: this.item.id,
        type: this.item.type,
        _startClient : {
          x: e.clientX,
          y: e.clientY,
          _vueEl: this
        }
      });
    }
  }
}

</script>
