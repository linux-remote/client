<template lang="jade">
Contextmenuable(@click="handleClick")
  .lr-icon(v-open-icon="app.iconUrl")
  span(v-if="isShowName") {{app.name}}
  template(v-slot:contextmenu)
    .lr-ctx-item(@click="remove") Remove
</template>

<script>
/**
 * item: id
 */
import Contextmenuable from '../global/contextmenuable.vue';
export default {
  components: {
    Contextmenuable
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    },
    isShowName: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    app(){
      return this.$store.state.sysAppMap[this.item.id];
    }
  },
  methods: {
    handleClick(){
      this.$store.commit('task/add', this.item.id);
    },
    remove(){
      this.$parent.rawList.splice(this.index, 1);
      this.$parent.save();
    }
  },
  mounted(){
  }
}
</script>
