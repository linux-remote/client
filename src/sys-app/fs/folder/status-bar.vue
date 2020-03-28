<template lang="jade">
.lr-fs-status-wrap
  template(v-if='item && $parent.selectCount === 1')
    .lr-inner.lr-fs-status-type {{item.type}}
    .lr-inner.lr-fs-status-mid(v-if="!item.symbolicLink")
      span {{item.owner}}
      span {{item.group}}
      span {{item.permission}}
    .lr-inner.lr-fs-status-mid(v-else)
      span Target: 
      span.lr-fs-status-target-type(v-if="item.linkTarget") {{item.linkTarget.type}} -> 
      span {{item.symbolicLink}}
      
    .lr-inner.lr-fs-status-size
      span(v-if="item.size") {{item.size | wellSize}}
      span(v-else-if="item.device_type") {{item.device_type}}
  .lr-inner.lr-fs-status-mid(v-else)
    span(v-if="$parent.selectCount") {{$parent.selectCount}} object(s) selected
    span(v-else) {{$parent.list.length}} object(s)
    
</template>
<script>
export default {
  props: ['item']
}
</script>


