<template lang="jade">
.lr-file-icon
  .lr-file-icon-front
  .lr-per-relation-wrap
    .lr-per-relation(v-for='(v, k) in item.rwxs',
     :class='{lr_per_is: item["is_" + k]}')
      .lr-per-item(v-for='v2 in v' , :class='{lr_per_item_on: v2 }')
    .lr-per-sticky(v-if='item.isSticky')
  span(v-if='item.suffix') {{item.suffix}}
  .lr-file-link(v-if='item.isSymbolicLink')
  .lr-error-icon(v-if='item.linkTargetError')
</template>

<script>
export default {
  props: ['item']
}
</script>
