
<template lang="jade">
.lr-error(@mousedown='noopStop' v-if="message.length" , style="display:none")
  .lr-error-title 
    b 错误

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
