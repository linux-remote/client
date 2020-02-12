
<template lang="jade">
.lr-page.lr-login-wrap
  .lr-logined-wrap(v-if="loggedInList.length")
    div
      router-link.lr-logined-item(v-for="username in loggedInList", :key="username", :to="'/user/' + username")
        .lr-logined-item-icon
          span.iconfont.icon-accountbox
        .lr-logined-item-text {{username}}
  .lr-login-box-wrap
    .lr-login-logo
      span.iconfont.icon-logo_LR
    h1 Linux Remote
    .lr-login-box
      form(@submit.prevent="login")
        div
          label {{LANG.username}}
          input.lr-login-input( v-model='username' required="required")
        div
          label {{LANG.password}}
          input.lr-login-input(type='password', v-model='password', autocomplete="off",  required="required")
        .lr-login-box-footer
          button(type="submit", :class='{lr_loading:isRequest}') {{LANG.submitBtn}}
  .lr-login-bottom
    | Powered By
    a(href='https://github.com/linux-remote', target='_blank') linux-remote
</template>

<script>
export default {
  data(){
    return {
      currLangIndex: this.$store.state.language.currIndex,
      isRequest: false,
      username: this.$route.query.user || '',
      password: '',
      loggedInList: []
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
    // getData(){
    //   this.request({
    //     url: '/loggedInList',
    //     success(data){
    //       this.loggedInList = data;
    //     }
    //   })
    // },
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
  }
}
</script>
