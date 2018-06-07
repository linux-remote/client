<template lang="jade">
.lr-window-body
  table
    thead
      tr
        td(v-for='v in head', :key='v') {{v}}
    tbody
      tr(v-for='(line, i) in body', :key='i')
        td(v-for='v in line') {{v}}
</template>

<script>

export default {
  data(){
    return {
      isRequest: false,
      head: [],
      body: []
    }
  },


  methods: {
    getData(){
      this.request({
        url: '~/disk',
        success(data){
          this.head = data.head;
          this.body = data.body;
        }
      })
    }
  },
  created(){
    this.getData()
  }
}
</script>
