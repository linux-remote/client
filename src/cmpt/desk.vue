<template lang="jade">
.dw-h100
  .lr-top
    div(style="width:33%") 服务器信息
    div(style="width:33%") time
    div(style="width:34%; text-align:right;padding-right:10px;")
      | user
      .btn.btn-default(@click='logout') sign out
  div(style="") test
  h1 desk {{info}}
</template>
<script>
import store from './sess-store';
export default {
  data(){
    return {
      isRequest: false,
      username: this.$route.params.username,
      info: ''
    }
  },
  methods: {
    //console.log('this.$route', this.$route)
    logout(){
      this.request({
        url: '/logout',
        type: 'post',
        data: {
          username: this.username
        },
        success(data){
          store.commit('set', data);
          this.$router.push('/');
        }
      })
    },
    getData(){
      this.apiGet('~/info', function(data){
        this.info = data;
      })
    }
  },
  created(){
    this.getData();
  }
}
</script>
