<style module>
.warp{
  display: flex;
  //align-items: center;
  //-text-align:center;
  height:100%;
  justify-content: center;
}
.login_box{
  width:600px;
}
.login_warp{
  width: 50%;
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
        .col-sm-9 {{i}}
        .col-sm-3
          button.logined-item-right(v-on:click="logout(i)") 注销

  .form-horizontal(:class="$style.login_warp")
      h2(style="text-align:center") 登录
      .form-group
        label.col-sm-2.control-label 用户名：
        .col-sm-10
          input.form-control(placeholder='username')
      .form-group
        label.col-sm-2.control-label 密码：
        .col-sm-10
          input.form-control(type='password' placeholder='password')
      .form-group
        .col-sm-offset-2.col-sm-10
          button.btn.btn-default(@click='login') ok
</template>

<script>
import store from './sess-store';
export default {
  data(){
    return {
      isRequest: false,
      username: 'dw',
      password: 1
    }
  },
  computed: {
    loginedList(){
      return store.state.loginedList
    }
  },
  methods: {
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
        }
      })
    }
  },
  created(){
    //this.getLoginedList();
  }
}
</script>
