<template lang="jade">
.lr-fs-status-wrap
  template(v-if='item && $parent.selectCount === 1')
    .lr-inner.lr-fs-status-type {{item.type}}
    template(v-if="!item.symbolicLink")
      .lr-inner.lr-fs-status-mid
        span(title="owner") {{item.owner}}
        span(title="group") {{item.group}}
        span(title="permission") {{item.permission}}
      .lr-inner(style="padding-right:20px;")
        span(title="mtime") {{item.mtime}}
    .lr-inner.lr-fs-status-mid(v-else)
      span Target: 
      span.lr-fs-status-target-type(v-if="item.linkTarget", title="target") {{item.linkTarget.type}} -> 
      span {{item.symbolicLink}}
      
    .lr-inner.lr-fs-status-size
      span(v-if="item.size", title="size") {{item.size | wellSize}}
      span(v-else-if="item.device_type", title="Device Type") {{item.device_type}}
  .lr-inner.lr-fs-status-mid(v-else)
    span(v-if="$parent.selectCount") {{$parent.selectCount}} object(s) selected
    span(v-else) {{$parent.list.length}} object(s)
    
</template>
<script>
export default {
  props: ['item']
}
</script>


