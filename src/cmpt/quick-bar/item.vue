<style>
.lr-quick-bar-item{
  width: 40px;
  margin-right: 10px;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-right: 1px solid #888;
}
.lr-quick-bar-item:hover{
  background-color: #000;
}
</style>
<template lang="jade">
.lr-quick-bar-item(
    :style="{backgroundImage: `url(${app.iconUrl})`}",
    @click="handleClick"
    )
    ContextMenu
      .lr-ctx-item(@click='remove') 移除
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
      return this.$store.getters['app/getById'](this.item.id)
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
