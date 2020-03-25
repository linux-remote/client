<template lang="jade">
.lr-window_body(style="user-select: text;")
  div(style="border-top: 1px solid #f0f0f0;")
  table.lr-about-table

    tr
      td Author: 
      td Du Wei &lt;hezedu@hotmail.com&gt;
    tr
      td repositorie: 
      td 
        a(target="_blank" href="https://github.com/linux-remote/linux-remote") github
    //- tr
    //-   td AFR and keep alive: 
    //-   td 
    //-     | AFR (Awary From Request) 10 minite you session will clean. the client will request 
    tr
      td Donate: 
      td 
        a(target="_blank" href="https://www.patreon.com/hezedu") Patreon
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
