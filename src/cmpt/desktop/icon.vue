<template lang="jade">
button.lr-desktop-icon(draggable="true",
              @click="handleClick",
              @dblclick="handleDblclick",
              @dragstart.stop='handleDragStart(item, $event)',
              :style='{left: item.x + "px", top: item.y + "px"}')
  .lr-desktop-icon-img(v-if="iconUrl", :style="{backgroundImage: `url(${iconUrl})`}")
  .lr-desktop-icon-cls(v-else, :class="app.iconClassName")
  .lr-desktop-icon-text {{name}}

  ContextMenu(ref='ctx')
    
    .lr-ctx-item(@click="remove")
      | Remove
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
    iconUrl(){
      const type = this.item.type;
      if(!type){
        return this.app.iconUrl;
      }
      switch(type){
        case 'folder':
          return '/public/img/tango/folder.png';
        case 'file':
          return '/public/img/nuvola/accessories-text-editor-6.png'
      }
    },
    name(){
      const type = this.item.type;
      if(!type){
        return this.LANG.title;
      }
      switch(type){
        case 'folder':
        case 'file':
          return this.item.name;
      }
    },
    isQuickLaunch() {
      return this.$store.state.isQuickLaunch
    }
  },
  methods: {
    onBeSelecting(isBelectSelected){
      this.isBelectSelected = isBelectSelected;
    },
    handleSpecialCtxClick(id, name) {
      this.$refs.ctx.hidden();
      this.$store.dispatch(`sysApps/${id}_${name}`);
    },
    remove(){
      this.$refs.ctx.hidden();
      this.$store.commit('desktop/removeIcon', this.index);
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
      this.$store.commit('task/add', this.item.openWith);
    },
    handleDragStart(v, e){
      // console.log('Desktop icon handleDragStart');
      const value = JSON.stringify({
        id: this.item.id,
        from: 'desktop',
        startClient : {
          x: e.clientX,
          y: e.clientY
        }
      });
      e.dataTransfer.setData("text", value);
      e.dataTransfer.dropEffect = 'move';

      return;
    }
  }
}

</script>
