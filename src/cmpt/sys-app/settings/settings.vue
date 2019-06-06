<template lang="jade">
.lr-window-body
  button.lr-tmp-btn(style="font-size: 12px") OK
  button.lr-tmp-btn(disabled="disabled") OK
  button Cancel
  table.lr-tmp-table
    thead
      tr
        th id
        th name
    tbody
      tr(tabindex="-1")
        td 1
        td hello
</template>
<script>
// import Menu from './menu.vue';
export default {
  // components:{
  //   Menu
  // },
  data(){
    return {
    }
  },
  computed:{
  },
  methods: {
  },
  created(){
  }
}
</script>
