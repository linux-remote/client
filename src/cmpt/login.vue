<style module>
.warp{
  display: flex;
  //align-items: center;
  //-text-align:center;
  height:100%;
  justify-content: center;
}
.login_box{
  width:200px;
}
.login_warp{
  width:500px;
}
.logined_list_warp{
  width:300px; height:100%;
}
</style>
<template lang="jade">
div(:class="$style.warp")
  .logined-list-warp(:class="$style.logined_list_warp" v-if="loginedList.length > 0")
    h2 已登录的用户
    .logined-list
      .row(v-for="i in loginedList")
        .col-sm-9(v-on:click="routeTo(i)") {{i}}
        .col-sm-3
          button.logined-item-right(v-on:click="logout(i)") 注销

  .form-horizontal(:class="$style.login_warp")
      h2(style="text-align:center") login
      .form-group
        label.col-sm-2.control-label 用户名：
        .col-sm-10
          input.form-control(placeholder='username' v-model='username')
      .form-group
        label.col-sm-2.control-label 密码：
        .col-sm-10
          input.form-control(type='password' placeholder='password' v-model='password')
      .form-group
        .col-sm-offset-6.col-sm-2
          button.btn.btn-default(@click='login') ok
</template>

<script>
import store from './sess-store';
export default {
  data(){
    return {
      isRequest: false,
      username: 'dw',
      password: '1'
    }
  },
  computed: {

    loginedList(){
      return store.state.loginedList
    }
  },
  methods: {
    routeTo(username){
      //return console.log('this.$route', this.$router)
      this.$router.push('/user/' + username);
    },
    logout(username){
      this.request({
        url: '/logout',
        type: 'post',
        data: {
          username
        },
        success(data){
          store.commit('set', data);
        }
      })
    },
    login(){
      console.log('this.isRequest', this.isRequest);
      const {username, password} = this;
      this.request({
        url: '/login',
        type: 'post',
        data: {
          username,
          password
        },
        success(data){
          store.commit('set', data);
          this.routeTo(username);
        }
      })
    }
  },
  created(){
    //this.getLoginedList();
  }
}
</script>
