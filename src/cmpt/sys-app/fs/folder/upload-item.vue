<template lang="jade">
tr.lr-fs-upload-tr(@mousedown.stop='', v-on="$listeners")
  td
    ContextMenu(ref='ctx')
      .lr-ctx-item(@click='handleAbort')
        | Abort
    .lr-name-wrap
      .lr-icon(:class='["lr_file_type_" + item.type, {["lr_fs_open_type_" + item.openType]: item.type === "RegularFile"}]', :style='iconStyle')
        .lr-icon.lr-error-icon(v-if='item.linkTargetError')
      .lr-fs-item-name {{item.name}}
  td
    span(:class='{lr_per_is_on: item.is_owner}') {{item.owner}}
  //- td
  //-   span(:class='{lr_per_is_on: item.is_group}') {{item.group}}
  //- td
  //-   .lr-per-wrap
  //-     .lr-per-relation-wrap
  //-       .lr-per-relation(v-for='(v, k) in item.rwxs',
  //-                       :class='{lr_per_is: item["is_" + k]}')
  //-         .lr-per-item(v-for='(v2, k2) in v', :class='{lr_per_item_on: v2 }') {{k2}}
  //-       .lr-per-sticky(v-if='item.isSticky')
  //-     .lr-per-ACL(v-if='item.isMask') ACL
  //- td {{item.mtime}}
  td(colspan="2")
    .lr-fs-upload-process
      .lr-fs-upload-processbar(:style="{width: per}")
      .lr-fs-upload-info {{item.status}}
  td(colspan="2") {{item.size | wellSize}}/{{item.totalSize | wellSize}}

  //- td
  //-   span(:class='{lr_per_is_on: item.is_owner}') {{item.owner}}
  //- td(colspan="4", style="position: relative;background-color:#eee")
  //-   .lr-fs-upload-processbar(:style="{width: ((item.size / item.totalSize) * 100) + '%'}")
  //-   .lr-fs-upload-info {{item.size | wellSize}}
</template>
<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';


export default {
  components: {
    ContextMenu
  },

  props: {
    item: {
      type: Object
    },
    p: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    LANG(){
      return this.p.LANG.ctx
    },
    per(){
      return ((this.item.size / this.item.totalSize) * 100) + '%';
    },
    iconStyle(){
      const app = this.item.openApp;
      return app ? 
      'background-image: url(' + app.iconUrl + ')'
      : undefined
    }
  },
  methods: {
    handleAbort(){
      const path = this.p.address + '/' + this.item.name;
      this.$store.commit('upload/removeItemByPath', {
        srcTaskId: this.p.taskWindow.id, 
        path
      });
      this.$refs.ctx.hidden();
    }
  }
}


</script>
