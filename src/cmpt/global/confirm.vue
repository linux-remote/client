
<template lang="jade">
.lr-modal(v-if='confirmData')
  .lr-modal-box(@click.stop='')
    .lr-modal-title Confirm
    .lr-modal-body {{confirmData.text}}
    .lr-modal-footer
      button(@click='open') {{LANG.global.ok}}
      button(@click='hidden') {{LANG.global.cancel}}
</template>

<script>
export default {
  computed: {
    confirmData(){
      return this.$store.state.confirmData;
    },
    LANG(){
      return this.$store.getters['language/currLanguage']
    }
  },
  methods: {
    hidden(){
      this.$store.commit('hiddenConfirm');
    },
    open(){
      this.confirmData.ok();
      this.hidden();
    }
  },

}
</script>
