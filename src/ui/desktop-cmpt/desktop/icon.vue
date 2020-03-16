<template lang="jade">
button.lr-desktop-icon(draggable="true",
              @dblclick="handleDblclick",
              @dragstart.stop='handleDragStart(item, $event)',
              @dragend.stop='handleDragEnd',
              :style='{left: item.x + "px", top: item.y + "px"}',
              :class='{lr_draging: isDraging}')
  .lr-desktop-icon-img(v-if="iconUrl", v-open-icon="iconUrl")
  .lr-desktop-icon-cls(v-else, :class="app.iconClassName")
  .lr-desktop-icon-text {{name}}

  //- ContextMenu(ref='ctx')
    
  //-   .lr-ctx-item(@click="remove")
  //-     | Remove
  //-   template(v-if="app.ctx")
  //-     .lr-ctx-item(v-for="name in app.ctx", @click="handleSpecialCtxClick(item.id, name)") {{name}}
</template>
<script>

export default {
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
  data(){
    return {
      isDraging: true
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
          return 'tango/folder.png';
        case 'file':
          return 'nuvola/accessories-text-editor-6.png'
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
    handleDblclick(){
      this.launch();
    },
    launch(){
      this.$store.commit('task/add', this.item.id);
    },
    handleDragStart(v, e){
      // console.log('Desktop icon handleDragStart');
      this.isDraging = true;
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
    },
    handleDragEnd(){
      this.isDraging = false;
    }
  }
}

</script>
