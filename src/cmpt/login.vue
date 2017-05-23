<template lang="jade">
.login-container
  fieldset.login-box
    legend login
    input
    br
    input(type='password')
    br
    button ok
</template>

<script>

export default {
  data(){
    return {
      msg: 'login'
    }
  }
}
</script>