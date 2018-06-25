
<template lang="jade">
.lr-modal(v-if='data', @click='hidden')
  .lr-modal-box(@click.stop='')
    .lr-modal-title 打开方式
    .lr-modal-body
      .lr-open-with-item
        .lr-icon(:style="{backgroundImage: `url(${sysEditor.iconUrl})`}")
        | {{sysEditor.title}}
    .lr-modal-footer
      button(@click='open') 确定
      button(@click='hidden') 取消
</template>

<script>
export default {

  computed: {
    data(){
      return this.$store.state.openWidthData
    },
    sysEditor(){
      return this.$store.getters['app/getById']('sys_app_editor')
    }
  },
  methods: {
    hidden(){
      this.$store.commit('hiddenOpenWith')
    },
    open(){
      const data = this.data;
      this.$store.commit('task/add', {
        appId: 'sys_app_editor',
        title: data.item.name,
        width: 500,
        height:500,
        address: data.address
      });
      this.hidden();
    }
  },

}
</script>
