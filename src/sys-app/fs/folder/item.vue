<template lang="jade">
Contextmenuable.lr-fs_file(tabindex="-1", v-on="$listeners", ref="ctx")
  .lr-fs_file_icon_wrap
    template(v-if="item")
      .lr-icon(v-if="item.openApp", v-open-icon="item.openApp.iconUrl")
      .lr-icon(v-open-icon="item.icon", v-else)
    .lr-icon.lr-fs-sym-link(v-if="v.isSymLink", v-open-icon="v.icon")
  .lr-fs_file_name {{v.name}}
  template(v-slot:contextmenu="ctx")
    .lr-ctx-item(@click="open", v-if="folder.selectCount === 1")
      b Open
    .lr-ctx-item(@click="rename") Rename
    .lr-hr
    .lr-ctx-item(@click="remove") Delete
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
      // win2000 是打开所有选中的文件
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
    },
    onBeSelecting(isSelected){
      if(isSelected){
        if(!this.folder.isItemSelected(this.v)){
          this.folder.selectItem(this.v);
        }
      } else {
        if(this.folder.isItemSelected(this.v)){
          this.folder.unSelectItem(this.v);
        }
      }
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
