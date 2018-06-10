<template lang="jade">
.lr-top(@mousedown.stop='')
  //- .lr-top-quick-item(@click='openHome') Home
  //- .lr-top-quick-item(@click='openFs')
    .lr-top-small-icon(style='background-image:url(/public/file-tree.svg)')
  <Watch/>
  <User/>
</template>

<script>
import Watch from './watch.vue';
import User from './user.vue';

export default {
  components:{
    Watch,
    User
  }
}
</script>
