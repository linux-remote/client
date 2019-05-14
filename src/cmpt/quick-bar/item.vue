<template lang="jade">
.lr-quick-bar-item(
    :style="{backgroundImage: `url(${app.iconUrl})`}",
    @click="handleClick"
    )
    ContextMenu
      .lr-ctx-item(@click='remove') {{$parent.LANG.remove}}
</template>

<script>
import ContextMenu from '../global/contextmenu/index.vue';
export default {
  components: {
    ContextMenu
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    }
  },
  computed: {
    app(){
      return this.$store.getters['sysApps/getById'](this.item.id)
    }
  },
  methods: {
    handleClick(){
      this.$store.commit('task/add', this.item.id);
    },
    remove(){
      this.$parent.list.splice(this.index, 1);
      this.$parent.save();
    }
  },
  mounted(){
  }
}
</script>
