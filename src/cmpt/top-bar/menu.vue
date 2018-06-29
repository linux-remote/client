<template lang="jade">
DropMenu
  .lr-icon.lr-menu
  div(slot='menu')

    Cascade.lr-ctx-item 语言
      div(slot='menu')
        .lr-ctx-item hahah
        .lr-ctx-item hahah
</template>

<script>

import DropMenu from './drop-menu.vue';
import Cascade from '__ROOT__/cmpt/global/cascade.vue';
export default {
  components:{
    DropMenu,
    Cascade
  },
}
</script>
