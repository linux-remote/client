<template lang="jade">
.lr-fs-status-wrap
  .lr-fs-status(v-if='$parent.currItem.focus')
    span {{$parent.currItem.isSymbolicLink ? 'SymbolicLink' : $parent.currItem.type}}
    span {{$parent.currItem.size | wellSize}}
    span {{$parent.currItem.permission}}
    span {{$parent.currItem.owner}}
    span {{$parent.currItem.group}}
    span(v-if='$parent.currItem.isSymbolicLink') linkTo:
      b.lr-fs-status-link {{$parent.currItem.linkPath}}
  .lr-fs-status(v-else-if='$parent.dir')
    span Items: {{$parent.data.length}}
    //-span DIR
    span {{$parent.dir.permission}}
    span {{$parent.dir.owner}}
    span {{$parent.dir.group}}
    span(v-if='!$parent.dir.readable') readable: {{$parent.dir.readable}}
    span(v-if='!$parent.dir.writeable') writeable: {{$parent.dir.writeable}}
    span(v-if='$parent.dir.isSticky') sticky:{{$parent.dir.isSticky}}
</template>


