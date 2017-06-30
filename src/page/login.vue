<template lang="jade">
.lr-page.lr-login-warp(style='user-select:text')
  h3(v-if='queryUser', :style='{color:"red"}')
    big {{queryUser}}
    | 的session失效了，请重新登录。
  br
  h1 Linux Remote
  .lr-login
    fieldset
      legend login
      label Username:
      input(placeholder='raw username' v-model='username')

      label Password:
      input(type='password' placeholder='raw password' v-model='password')
      .lr-2-footer
        button(@click='login',  :class='{loading:isRequest}') ok


    p(v-html='indexNotice' style="font-size:12px;text-align:right;")


  div(style='position:absolute;bottom:0; width: 600px; margin: 0 auto;')
    small(style='color: #999') Power by:
      a(href='https://github.com/linux-remote' target='_blank') linux-remote
  //- .lr-logined_list_warp(v-if="loginedList.length > 0")
  //-   h2 已登录的用户
  //-   .logined-list
  //-     .row(v-for="i in loginedList")
  //-       .col-sm-9(v-on:click="routeTo(i)") {{i}}
  //-       .col-sm-3
  //-         button.logined-item-right(v-on:click="logout(i)") 注销
</template>

<script>
import store from '../store-global';
import errStore from '../store/error';
export default {
  data(){
    const queryUser = this.$route.query.user;
    return {
      isRequest: false,
      queryUser,
      username: queryUser || '',
      password: ''
    }
  },
  computed: {
    isSelfSigned(){
      return store.state.isSelfSigned
    },
    indexNotice(){
      return store.state.indexNotice
    }
    // loginedList(){
    //   return store.state.loginedList
    // }
  },
  methods: {
    login(){
      const {username, password} = this;
      if(!username){
        return errStore.commit('show', 'Username is empty')
      }
      if(!password){
        return errStore.commit('show', 'Password is empty')
      }
      this.request({
        requestKey: 'isRequest',
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
