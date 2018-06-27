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
    //-.lr-ctx-item(v-if='item.id === "sys_app_recycle_bin"', @click="clearRecycleBin")
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
    // clearRecycleBin(){
    //   if(!confirm('Are you sure to delete All?')){
    //     return;
    //   }
    //   this.request({
    //     url: '~/recycleBin',
    //     type: 'delete',
    //     success(){
    //       this.$store.commit('recycleBinTrigger', true);
    //       this.$refs.ctx.hidden();
    //     }
    //   })
    // },
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
