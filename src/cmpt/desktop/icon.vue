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
              @contextmenu='handleContextmenu',
              @dblclick="handleDblclick",
              @dragstart.stop='handleDragStart(item, $event)',
              :style='{left: item.x + "px", top: item.y + "px"}')
  .lr-desk-icon-img(:style="{backgroundImage: `url(${app.iconUrl})`}")
  .lr-desk-icon-text {{app.title}}
  ContextMenu(v-if="contextmenuIsShow", :close="contextmenuClose")
    .lr-contextmenu-item(@click="remove")
      | 移除

</template>
<script>
import ContextmenuExtend from '../global/contextmenu/extend.vue';

export default {
  extends: ContextmenuExtend,

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
    }
    // currTitle(){
    //   return this.item.title || this.app.title
    // },
  },
  methods: {
    remove(){
      this.contextmenuClose();
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
