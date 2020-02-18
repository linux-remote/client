<template lang="jade">
FocusMenu(cssBase="lr-start")
  template(v-slot:btn)
    LRIcon(type="css", value="iconfont icon-logo_LR")
    | Start
  template(v-slot:menu)
    h1 menu
</template>
<script>
import FocusMenu from '../focus-menu/base.vue';
import LRIcon from '../../cmpt/icon/icon.vue';
export default {
  components: {
    FocusMenu,
    LRIcon
  }
}
</script>