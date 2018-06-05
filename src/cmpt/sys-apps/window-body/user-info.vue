<template lang="jade">
.lr-window-body(style='user-select:text')
  table.lr-computer-table
    tr
      td(style='color:gray') user:
      td {{username}}
    tr
      td(style='color:gray') group:
      td {{group}}
    tr
      td(style='color:gray') groups:
      td {{groups}}
</template>
<script>
import store from '__ROOT__/store-global';
export default {
  computed:{
    username(){
      return store.state.username
    },
    group(){
      return store.state.groups[0]
    },
    groups(){
      return store.state.groups.join(' , ')
    }
  }
}
</script>
