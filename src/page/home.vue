<style module>
.title{font-size: 50px}
.title .test {color:red}
</style>


<template lang="jade">
div(:class="$style.title")
  .title {{msg}}

</template>

<script>
export default {
  data(){
    return {
      isRequest: false,
      msg: 'Home'
    }
  }
}
</script>