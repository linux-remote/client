<template lang="jade">
.lr-page.lr-login-warp
  h1.lr-login-h1 Linux Remote
  fieldset.lr-login-fieldset(@keydown.13='login')
    legend.lr-login-legend login
    .lr-login-row
      label.lr-login-label Username:
      input.lr-login-input( v-model='username')
    .lr-login-row
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
