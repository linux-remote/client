<template lang='jade'>
div
  FriendMain(name="test")
  FriendMain(name="world")

</template>

<script>
import FriendMain from './friend-main.vue'
export default {
  components: {
    FriendMain
  }
}
</script>
