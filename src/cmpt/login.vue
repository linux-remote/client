<template lang="jade">
.login-container
  .logined-list-warp(v-if="loginedList.length > 0")
    .title 已登录的用户
    .logined-list
      .logined-item(v-for="i in loginedList") {{i}}
          
        button.logined-item-right 注销

  .login-box-warp
    fieldset.login-box
      legend 登录
      .input-wrap
        label 用户名：
        input(placeholder='username')
      .input-wrap
        label 密码：
        input(type='password' placeholder='password')
      .submit-warp
        button.submit(@click='login') ok
</template>

<script>

export default {
  data(){
    let  loginedList = sessionStorage.loginedList;
    loginedList = loginedList ?
    JSON.parse(loginedList) :
    [];
    return {
      isRequest: false,
      loginedList: loginedList,
      msg: 'login'
    }
  },
  methods: {
    getLoginedList(){
      this.apiGet('/login', (data) => {
        console.log('data', data);
      })
    },
    login(){
      const username = 'dw';
      this.request({
        url: '/login',
        type: 'post',
        data: {
          username,
          password: 1
        },
        success(port){
          console.log(port);
          this.loginedList.push({
            username,
            port
          });
          sessionStorage.loginedList = JSON.stringify(this.loginedList);
        }
      })
    }
  },
  created(){
    //this.getLoginedList();
  }
}
</script>