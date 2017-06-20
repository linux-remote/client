<template lang="jade">
.lr-page.lr-login-warp
  h1(v-if='queryUser', :style='{color:"red"}')
    b {{queryUser}}
    | 的session失效了，请重新登录。
  br
  fieldset.lr-box
      //h1 linux-remote
      legend.title login
      .lr-content
          label Account:
          input.form-control(placeholder='username' v-model='username')
          label Password:
          input.form-control(type='password' placeholder='password' v-model='password')
      .lr-footer
        button.btn.btn-default(@click='login') ok
  //- .lr-logined_list_warp(v-if="loginedList.length > 0")
  //-   h2 已登录的用户
  //-   .logined-list
  //-     .row(v-for="i in loginedList")
  //-       .col-sm-9(v-on:click="routeTo(i)") {{i}}
  //-       .col-sm-3
  //-         button.logined-item-right(v-on:click="logout(i)") 注销
</template>

<script>
//import store from '../store-global';
export default {
  data(){
    const queryUser = this.$route.query.user;
    return {
      //isRequest: false,
      queryUser,
      username: queryUser || 'dw',
      password: '1'
    }
  },
  // computed: {
  //   loginedList(){
  //     return store.state.loginedList
  //   }
  // },
  methods: {
    login(){
      const {username, password} = this;
      this.request({
        url: '/login',
        type: 'post',
        data: {
          username,
          password
        },
        success(){
          // data.username = username;
          // createWs(username);
          //store.commit('set', data);
          this.routeTo(username);
        }
      })
    },
    routeTo(username){
      this.$router.push('/user/' + username);
    }
    // logout,
  }
}
</script>
