<style>
.lr-login-warp{
  justify-content:center;
  flex-direction: column;
  align-items: center;
  
  /* C28E00 ffb900 F5AD3B BDB76B E8A600*/
  /* background-color: #8B4513;
  margin: 0 auto; */
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
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

.lr-login-footer{
  text-align: right;
  padding-top: 10px;
}
.lr-login-error{
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  color:red;
  font-size: 14px;
  /* white-space: nowrap; */
}
</style>
<template lang="jade">
.lr-page.lr-login-warp
  h1.lr-login-h1 Linux Remote
  form(@submit.prevent="login")
    fieldset.lr-login-fieldset(@keydown.13='login')
      legend.lr-login-legend login
      .lr-login-row
        label.lr-login-label 用户名:
        input.lr-login-input( v-model='username' required="required")
      .lr-login-row
        label.lr-login-label 密码:
        input.lr-login-input(type='password' v-model='password' required="required")
      .lr-login-footer
        button(type="submit", :class='{lr_loading:isRequest}') ok
      .lr-login-error(v-show="error") {{error}}
</template>

<script>
export default {
  data(){
    return {
      isRequest: false,
      username: this.$route.query.user || '',
      password: '',
      error: ''
    }
  },
  methods: {
    login(){
      const {username, password} = this;
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
        },
        error(xhr){
          this.error = `http #${xhr.status}: ${xhr.responseText}`;
        }
      })
    },
    routeTo(username){
      this.$router.push('/user/' + username);
    }
  }
}
</script>
