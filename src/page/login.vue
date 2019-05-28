
<template lang="jade">
.lr-page.lr-login-wrap.theme-dark.color-fill-accent-vivid-high
  .lr-logined-wrap(v-if="loginedList.length")
    div
      router-link.lr-logined-item(v-for="username in loginedList", :key="username", :to="'/user/' + username")
        .lr-logined-item-icon
          span.glyph.glyph-contact
        .lr-logined-item-text {{username}}
  .lr-login-box-wrap(:class="{lr_login_have_logined: loginedList.length}")
    img.lr-login-logo(src="/public/img/windows-linux-logo-c.png")
    h2 Linux Remote
    .lr-login-box
      form(@submit.prevent="login", style="display:")
        div
          label {{LANG.username}}
          input.lr-input( v-model='username' required="required")
        div
          label {{LANG.password}}
          input.lr-input(type='password' v-model='password' required="required")
        LoadingBtn.lr-btn.lr-w100.lr-btn-hollow(type="submit", :text="LANG.submitBtn", :isLoading="isRequest")
  //-.lr-login-bottom
    a(href='https://github.com/linux-remote/linux-remote/blob/master/LICENSE', target='_blank') Licenses
    a(href='https://github.com/linux-remote', target='_blank') Source code
</template>

<script>
import LoadingBtn from '../cmpt/loading-btn.vue';
export default {
  components: {
    LoadingBtn
  },
  data(){
    return {
      currLangIndex: this.$store.state.language.currIndex,
      isRequest: false,
      username: this.$route.query.user || '',
      password: '',
      error: ''
    }
  },
  computed: {
    loginedList() {
      return this.$store.state.loginedList
    },
    language(){
      return this.$store.state.language;
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].loginPage;
    }
  },
  methods: {
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
        success(data){
          // {loginedList: []}
          data.username = username;
          this.$store.commit('set', data);
          this.routeTo(username);
        },
        // error(xhr){
        //   this.error = `http #${xhr.status}: ${xhr.responseText}`;
        // }
      })
    },
    routeTo(username){
      this.$router.push('user/' + username);
    }
  }
}
</script>
