<style>
.lr-login-warp{
  justify-content:center;
  flex-direction: column;
  align-items: center;
}
.lr-login-h1{
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
}

.lr-login-input{
  height: 30px; 
}
.lr-login-fieldset{
  display: flex;
  flex-direction: column;
}
.lr-login-row{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.lr-login-label{
  font-size: .82em;
  line-height: 1;
  margin-right: 10px;
}
.lr-login-content{
  padding: 20px 10px; 
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.lr-login-footer{
  text-align: right;
  padding-top: 10px;
}
</style>
<template lang="jade">
.lr-page.lr-login-warp
  h1.lr-login-h1 Linux Remote
  fieldset.lr-login-fieldset(@keydown.13='login')
    legend.lr-login-legend login
    .lr-login-row
      label.lr-login-label 用户名:
      input.lr-login-input( v-model='username')
    .lr-login-row
      label.lr-login-label 密码:
      input.lr-login-input(type='password' v-model='password')
    .lr-login-footer
      button(@click='login', :class='{lr_loading:isRequest}') ok
</template>

<script>
import store from '../store-global';
import errStore from '../store/error';

export default {
  data(){
    return {
      isRequest: false,
      username: this.$route.query.user || '',
      password: ''
    }
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
          this.routeTo(username);
        }
      })
    },
    routeTo(username){
      this.$router.push('/user/' + username);
    }
  }
}
</script>
