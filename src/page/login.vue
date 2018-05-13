<style>
.lr-login-warp{
  justify-content:center;
  flex-direction: column;
  align-items: center;

}
.lr-login-h1{
  text-align: center;
  color: #333;
  margin-top:0;
}
.lr-login-legend{
  background-color: #333;
  color: #fff;
  padding: 3px;
}
.lr-login-input{
  height: 30px; 
  width: 100%;
}
.lr-login-fieldset{
  display: flex;
  flex-direction: column;
  border-color:#fff;
}
.lr-login-label{
  font-size: .8em;
}
.lr-login-content{
  padding: 20px 10px; 
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.lr-login-footer{
  text-align: right;
  padding: 10px;
}

</style>
<template lang="jade">
.lr-page.lr-login-warp
  h1.lr-login-h1 Linux Remote
  fieldset.lr-login-fieldset(@keydown.13='login')
    legend.lr-login-legend login
    div
      label.lr-login-label Username:
      input.lr-login-input( v-model='username')
    div
      label.lr-login-label Password:
      input.lr-login-input(type='password' v-model='password')
    .lr-login-footer
      button(@click='login', :class='{loading:isRequest}') ok
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
