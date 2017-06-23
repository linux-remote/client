<template lang="jade">
.lr-page.lr-login-warp
  h3(v-if='queryUser', :style='{color:"red"}')
    big {{queryUser}}
    | 的session失效了，请重新登录。
  br

  .lr-login
      //h1 linux-remote

      h1 login
      hr
      .lr-2-content
        table
          tr
            td Account:
            td
              input(placeholder='username' v-model='username')
          tr
            td Password:
            td
              input(type='password' placeholder='password' v-model='password')

      .lr-2-footer
        button(@click='login') ok
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
