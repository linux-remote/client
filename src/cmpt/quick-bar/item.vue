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

</template>

<script>
export default {
  
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    app(){
      return this.$store.getters['app/getById'](this.item.id)
      //return this.$store.state.app.map[this.item.id] || this.$store.state.lr_sys_unknown_app
    }
  },
  methods: {
    handleClick(){
      this.$store.commit('task/add', this.item.id);
    }
  },
  mounted(){
  }
}
</script>
