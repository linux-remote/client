<template lang="jade">
button.lr-btn(:type="type", v-on="$listeners")
  slot
</template>
<script>
export default {
  props: {
    type: { // Chrome default type is submit. WTF
      type: String,
      default: 'button'
    }
  }
}
</script>