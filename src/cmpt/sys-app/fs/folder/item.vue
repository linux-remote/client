<template lang="jade">
.lr-fs_file(tabindex="-1", v-on="$listeners")
  .lr-fs_file_icon_wrap
    template(v-if="item")
      .lr-icon(v-if="item.openApp", v-open-icon="item.openApp.iconUrl")
      .lr-icon(v-open-icon="item.icon", v-else)
    .lr-icon.lr-fs-sym-link(v-if="v.isSymLink", v-open-icon="v.icon")
  .lr-fs_file_name {{v.name}}
</template>

<script>

export default {
  props: ['v'],
  computed: {
    item(){
      return this.v.isSymLink ? this.v.linkTarget : this.v;
    }
  }
}

</script>
