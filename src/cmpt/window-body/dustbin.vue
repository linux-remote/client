<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  h2(v-html='error' style='color:red' v-if='!data')
  .lr-dustbin-wrap
    .lr-fs-bar
      button Clear All
    .lr-dustbin-item(v-for='item in data') {{item.name}}

</template>

<script>
import store from '__ROOT__/store-global';
export default {
  //props: ['address'],
  data(){
    return {
      isRequest: false,
      data: null,
      error: null
    }
  },
  methods: {
    getData(){
      this.request({
        url: this.address,
        data: {
          dir: true
        },
        success(data){
          this.data = data;
        },
        error(xhr){
          this.data = null;
          this.error = xhr.responseText;
        }
      })
    }
  },
  computed: {
    address(){
      return '~/fs/var/tmp/linux-remote/dustbin/' + store.state.username
    },
    isError(){
      return !this.data && this.error
    }
  },
  created(){
    this.getData()
  }
}
</script>
