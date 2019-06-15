
<template lang="jade">
.lr-page.lr-login-wrap
  .lr-logined-wrap(v-if="loginedList.length")
    div
      router-link.lr-logined-item(v-for="username in loginedList", :key="username", :to="'/user/' + username")
        .lr-logined-item-icon
          span.iconfont.icon-accountbox
        .lr-logined-item-text {{username}}
  .lr-login-box-wrap
    .lr-login-logo
      span.iconfont.icon-logo_LR
    h1 Linux Remote
    .lr-login-box
      form(@submit.prevent="login", @keydown.13="login")
        div
          label {{LANG.username}}
          input.lr-input( v-model='username' required="required")
        div
          label {{LANG.password}}
          input.lr-input(type='password', v-model='password', required="required")
        .lr-login-box-footer
          button(type="submit", :class='{lr_loading:isRequest}') {{LANG.submitBtn}}
  //-.lr-login-bottom
    a(href='https://github.com/linux-remote/linux-remote/blob/master/LICENSE', target='_blank') Licenses
    a(href='https://github.com/linux-remote', target='_blank') Source code
</template>

<script>
export default {
  data(){
    return {
      currLangIndex: this.$store.state.language.currIndex,
      isRequest: false,
      username: this.$route.query.user || '',
      password: '',
      loginedList: []
    }
  },
  computed: {
    language(){
      return this.$store.state.language;
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].loginPage;
    }
  },
  methods: {
    getData(){
      this.request({
        url: '/loginedList',
        success(data){
          this.loginedList = data;
        }
      })
    },
    handleChange(){
      this.$store.commit('language/set', this.currLangIndex);
    },
    login(){
      const {username, password} = this;
      this.request({
        stateKey: 'isRequest',
        url: '/login',
        type: 'post',
        data: {
          username,
          password
        },
        success(){
          this.$store.commit('set', {
            username
          });
          this.routeTo(username);
        }
      })
    },
    routeTo(username){
      this.$router.push('user/' + username);
    }
  },
  created(){
    this.getData();
  }
}
</script>
