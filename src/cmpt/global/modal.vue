
<template lang="jade">
.lr-modal
  form.lr-modal-box
    .lr-modal-title {{title}}
    .lr-modal-body
      slot
      
    .lr-modal-footer
      button(@click='onSubmit') 确定
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    onSubmit: {
      type: Function
    }
  },
  data(){
    return {
      inputVal: ''
    }
  },
  methods: {

  }
}
</script>
