<template lang='jade'>
div
  slot
</template>

<script>
import FriendMain from './friend-main.vue'
export default {
  data(){
    return {
      $friend: this.$parent
    }
  }
}
</script>
