
<template lang="jade">
.lr-modal(v-if='data', @click='hidden')
  .lr-modal-box(@click.stop='')
    .lr-modal-title {{LANG.global.openWith}}
    .lr-modal-body
      .lr-open-with-item
        .lr-icon(:style="{backgroundImage: `url(${sysEditor.iconUrl})`}")
        | {{editorTitle}}
    .lr-modal-footer
      button(@click='open') {{LANG.global.ok}}
      button(@click='hidden') {{LANG.global.cancel}}
</template>

<script>
export default {

  computed: {
    data(){
      return this.$store.state.openWidthData
    },
    LANG(){
      return this.$store.getters['language/currLanguage']
    },
    editorTitle(){
      return this.LANG.sys_app_editor.title
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
