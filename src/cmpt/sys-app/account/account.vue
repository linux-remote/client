<template lang="jade">
.lr-window-body(style="user-select: text;")
  div(style="border-top: 1px solid #f0f0f0;")
  table

    tr
      td username: 
      td {{username}}
    tr
      td group: 
      td {{group}}
    tr
      td groups: 
      td {{groups}}
</template>
<script>
export default {
  computed: {
    username(){
      return this.$store.state.username;
    },
    group(){
      return this.$store.state.groups[0]
    },
    groups(){
      return this.$store.state.groups.join(', ');
    }
  }
}
</script>
