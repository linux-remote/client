<template lang="jade">
.lr-fs_file(tabindex="-1", v-on="$listeners")
  Contextmenuable(ref="ctx")
    .lr-fs_file_icon_wrap
      template(v-if="item")
        .lr-icon(v-if="item.openApp", v-open-icon="item.openApp.iconUrl")
        .lr-icon(v-open-icon="item.icon", v-else)
      .lr-icon.lr-fs-sym-link(v-if="v.isSymLink", v-open-icon="v.icon")
    .lr-fs_file_name {{v.name}}
    template(v-slot:contextmenu)
      .lr-cm-item(@click="open")
        b Open
      .lr-cm-item(@click="rename") Rename
      hr
      .lr-cm-item(@click="remove") Delete
</template>

<script>
import Contextmenuable from '../../../ui/desktop-cmpt/global/contextmenuable.vue';
export default {
  inject: ['folder'],
  components: {
    Contextmenuable
  },
  props: ['v'],

  computed: {
    item(){
      return this.v.isSymLink ? this.v.linkTarget : this.v;
    }
  },
  methods: {
    open(){
      this.$emit('open');
      this.$refs.ctx.close();
    },
    rename(){
      this.$emit('rename', () => {
        this.$el.focus();
      });
      this.$refs.ctx.close();
    },
    remove(){
      this.$emit('remove');
      this.$refs.ctx.close();
    }
  },
  mounted(){
    const currFocus = this.folder.currFocusItem;
    
    if(currFocus){
      if(currFocus.name === this.v.name){
        this.$nextTick(() => {
          this.$el.focus();
        })
        
      }
    }
  }
}

</script>
