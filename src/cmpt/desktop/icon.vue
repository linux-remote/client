<template lang="jade">
button.lr-desktop-icon(draggable="true",
              @click="handleClick",
              @dblclick="handleDblclick",
              @dragstart.stop='handleDragStart(item, $event)',
              :style='{left: item.x + "px", top: item.y + "px"}')
  .lr-desktop-icon-img(:style="{backgroundImage: `url(${app.iconUrl})`}")
  .lr-desktop-icon-text {{LANG.title}}

  ContextMenu(ref='ctx')
    
    .lr-ctx-item(@click="remove")
      | {{$parent.LANG.ctx.remove}}
    template(v-if="item.ctx")
      .lr-ctx-item(v-for="name in item.ctx", @click="handleSpecialCtxClick(item.id, name)") {{name}}
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
      return this.$store.getters['sysApps/getById'](this.item.id)
    },
    LANG(){
      return this.$store.getters['language/currLanguage'][this.item.id] || {
        title: 'Unknown'
      }
    },
    isQuickLaunch() {
      return this.$store.state.isQuickLaunch
    }
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
    handleSpecialCtxClick(id, name) {
      this.$store.dispatch(`sysApps/${id}_${name}`);
      this.hidden();
    },
    remove(){
      this.$nextTick(()=> {
        this.$parent.list.splice(this.index, 1);
        this.$parent.save();
      })
    },
    handleClick(){
      if(this.isQuickLaunch){
        this.launch();
        this.$store.commit('toggleQuickLaunch');
      }
    },
    handleDblclick(){
      if(this.isQuickLaunch){
        return;
      }
      this.launch();
    },
    launch(){
      this.$store.commit('task/add', this.item.id);
    },
    handleDragStart(v, e){
      this.$store.commit('transferDragData', {
        id: this.item.id,
        type: this.item.type,
        _isFromDeskTop: true,
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
