<template lang="jade">
.lr-icon(v-if="value", :style="{width: size + 'px', height: size + 'px', fontSize: size + 'px'}")
  span(v-if="type === 'css'", :class="value")
  img(v-else, :src="value")
</template>
<script>
export default {
  props: {
    type: {
      type: String, // img, css
      default: 'img'
    },
    value: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 16
    }
  }
}
</script>