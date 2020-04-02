<template lang="jade">
component(:is="type ? 'Base' : 'Custom'", :type="type", v-bind="$attrs") 
</template>
<script>
import Base from './base.vue';
import Custom from './custom.vue';
export default { // 0.356 
  components: {
    Base,
    Custom
  },
  props: {
    type: {
      type: String
    }
  }
}
</script>