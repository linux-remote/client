<template lang="jade">
tr(@dblclick='$parent.openItem(item)',
  :class='{lr_file_hidden: item.name[0] === "."}')
  td
    .lr-name-wrap
      .lr-icon(:class='"lr_file_type_" + item.type')
        .lr-icon.lr-error-icon(v-if='item.linkTargetError')
      | {{item.name}}
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
export default {
  props: {
    item: {
      type: Object
    }
  }
}
</script>
