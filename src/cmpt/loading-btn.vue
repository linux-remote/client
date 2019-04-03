

<template lang="jade">
button.btn.loading-btn(:disabled='isLoading')
  span {{text}}
  .progress-ring(v-if="isLoading")
    .progress-circle
    .progress-circle
    .progress-circle
    .progress-circle
    .progress-circle
</template>
<script>

export default {
  props: {
    text: {
      type: String,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    
  }

}

</script>
