<template lang="jade">
.lr-error(@mousedown='noopStop' v-show='message.length > 0')
  .lr-error-item(v-for='v in message' v-html='v')

</template>

<script>
import store from '__ROOT__/store/error';
export default {
  data(){
    return store.state
  }
}
</script>
