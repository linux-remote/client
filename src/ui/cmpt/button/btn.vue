<template lang="jade">
button.lr-btn(:type="submit ? 'submit' : 'button'", v-on="$listeners")
  slot
</template>
<script>
export default {
  props: {
    submit: { // Chrome default type is submit. WTF
      type: Boolean,
      default: false
    }
  }
}
</script>