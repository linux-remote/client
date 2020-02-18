
<template lang="jade">
.lr-page
  .lr-mask(@mousedown.prevent)
  Window(ref="win",
  :title="title",
  :enterBindBtn="true",
  style="top: 21%; left: 0; right: 0; margin: auto; width: 417px; height: 230px"
  )
    .lr-login_banner
      Icon.lr-login_logo(type="css", :size="50", value="iconfont icon-logo_LR")
      .lr-login_powerBy 
        div POWERED BY
        h1 linux-remote
        //- a(href="https://github.com/linux-remote/linux-remote", target="_blank") linux-remote
      .lr-login_process_wrap
        .lr-login_process
    form.lr-login_form(@submit.prevent)
      .lr-login_form_mask Logging...
      .lr-login_input_wrap
        label {{LANG.username}}
        input.lr-input( v-model='username' required="required")
      .lr-login_input_wrap
        label {{LANG.password}}
        input.lr-input(type='password', v-model='password', autocomplete="off",  required="required")
      .lr-login-box-footer
        Btn(type="submit", @click="handleBtnClick", ref="submit") {{LANG.submitBtn}}

//-.lr-page.lr-login-wrap
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
import { Window,  Icon,  Btn  } from '../ui/index.js';
export default {
  components: {
    Window,
    Icon,
    Btn
  },
  data(){
    const CORS = window.CLIENT_CONFIG.CORS;
    let title = 'Log On to Linux';
    title = CORS ? title + ' - ' + CORS : title;
    return {
      title,
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
    handleBtnClick(){
      this.login();
    },
    routeTo(username){
      this.$router.push('user/' + username);
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.$refs.submit.$el.focus();
      // this.setEnterBindBtn(this.$refs.submit.$el);
    });
  }
}
</script>
