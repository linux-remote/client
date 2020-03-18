<template lang="jade">
.lr-fs_file(tabindex="-1", v-on="$listeners")
  .lr-icon(v-if="item.openApp", v-open-icon="item.openApp.iconUrl")
  .lr-icon(v-open-icon="item.icon", v-else)
    
  .lr-fs_file_name {{item.name}}
</template>

<script>

export default {
  props: ['item'],
  methods: {
    handleDblClick(){

    }
  }
}

</script>
