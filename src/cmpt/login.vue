<template lang="jade">
.login-container
  .login-box
    input
    input(type='password')
</template>

<script>
export default {
  data(){
    return {
      isRequest: false,
      msg: 'login'
    }
  }
}
</script>