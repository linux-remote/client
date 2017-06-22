<template lang="jade">
svg(v-once, xmlns="http://www.w3.org/2000/svg", version="1.1", :class="svgClass", :width="width", :height="height")
  polygon(:points="points")
</template>
<script>
export default {
  props: ['svgClass', 'width', 'height'],
  data(){
    return {
      points:`0, 0 ${this.width}, 0 ${this.width / 2}, ${this.height}`
    }
  }
}
</script>
