<template lang="jade">
tr(@dblclick='$parent.openItem(item)',
    @click='$parent.itemFocus(item)',
  :class='{lr_file_hidden: item.name[0] === ".", lr_file_focus: item.focus}')
  td

    ContextMenu
      .lr-ctx-item(@click='del')
        .lr-icon(:style="{backgroundImage: 'url(' + recycleIcon + ')'}")
        | 移动到回收站

    .lr-name-wrap
      .lr-icon(:class='"lr_file_type_" + item.type')
        .lr-icon.lr-error-icon(v-if='item.linkTargetError')
      ItemName(:item='item', :p='$parent')
  td
    span(:class='{lr_per_is_on: item.is_owner}') {{item.owner}}
  td
    span(:class='{lr_per_is_on: item.is_group}') {{item.group}}
  td
    .lr-per-wrap
      .lr-per-relation-wrap
        .lr-per-relation(v-for='(v, k) in item.rwxs',
                        :class='{lr_per_is: item["is_" + k]}')
          .lr-per-item(v-for='(v2, k2) in v', :class='{lr_per_item_on: v2 }') {{k2}}
        .lr-per-sticky(v-if='item.isSticky')
      .lr-per-ACL(v-if='item.isMask') ACL
  td {{item.mtime}}
  td(v-if='item.size') {{item.size | wellSize}}
  td(v-else) 
    span.lr_is_device_type {{item.device_type}}
</template>
<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
import ItemName from './item-name.vue';
export default {
  components: {
    ContextMenu,
    ItemName
  },

  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    recycleIcon(){
      return this.$store.state.app.sysMap.sys_app_recycle_bin.iconUrl
    }
  },
  methods: {
    del(){
      this.request({
        type: 'delete',
        url: '~/fs' + this.$parent.getItemPath(this.item.name),
        success(){
          this.$store.commit('onFsDel');
          this.$parent.list.splice(this.index, 1);
        }
      })
    }
  }
}
</script>
