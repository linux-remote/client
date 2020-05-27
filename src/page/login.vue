
<template lang="jade">
.lr-page(:class="{lr_login_logging: isRequest}")
  .lr-login_mask(@mousedown.prevent)
  Window(:title="title",
         :left="left",
         :top="top",
         :height="height",
         :width="width",
         :autoFocus="true",
         :enterBindBtn="true"
         ref="main")
    .lr-window_body
      .lr-login_banner
        Icon.lr-login_logo(type="css", :size="50", value="iconfont icon-logo_LR")
        .lr-login_info
          
          h1 linux-remote
          div Linux web remote desktop
        a.lr-login_powered(href="https://github.com/linux-remote/linux-remote", target="_blank") POWERED BY
        .lr-login_process_wrap
          .lr-login_process
      form.lr-login_form(@submit.prevent="handleSubmit", @keydown.enter.prevent)
        .lr-login_form_mask Logging...
        .lr-login_input_wrap
          label {{LANG.username}}
          input.lr-input(v-model='username', name="username", ref="username", required="required")
        .lr-login_input_wrap
          label {{LANG.password}}
          input.lr-input(type='password', name="password", v-model='password', autocomplete="username", required="required")
        .lr-login-box-footer
          Btn(ref="submit", type="submit") {{LANG.submitBtn}}
  Block(v-if="alertOpt",
    :close="closeAlert",
    v-bind="alertOpt")
</template>

<script>
import { Icon,  Btn, Window, Block } from '../ui/index.js';
// import FocusableMixin from '../lib/mixins/focusable';
export default {
  // mixins: [FocusableMixin],
  components: {
    Window,
    Icon,
    Block,
    Btn
  },
  data(){
    const CORS = window.CLIENT_CONFIG.CORS;
    let title = 'Log On to Linux';
    title = CORS ? title + ' - ' + CORS : title;
    const width = 417;
    const left = (document.body.clientWidth - width) / 2;
    // console.log('this.$route', this.$route)
    const hash = this.$route.hash;
    let username = '';
    const hashI = hash.indexOf('#user=');
    if(hashI !== -1){
      username = hash.split('=')[1];
    }
    return {
      title,
      width: 417,
      left,
      top: 200,
      height: 230,
      alertOpt: null,
      // currLangIndex: this.$store.state.language.currIndex,
      isRequest: false,
      username,
      password: '',
      loggedInList: []
    }
  },
  computed: {
    language(){
      return this.$store.state.language;
    },
    winH(){
      return this.$store.state.winH;
    },
    winW(){
      return this.$store.state.winW;
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
    alert(opt){
      this.alertOpt = opt;
    },
    closeAlert(){
      this.alertOpt = null;
      this.$nextTick(() => {
        this.$refs.main.focusenter();
      });
    },
    // handleChange(){
    //   this.$store.commit('language/set', this.currLangIndex);
    // },
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
        },
        error(xhr){
          this.alert({
            type: 'alert',
            title: 'Logon Message',
            text: xhr.responseText,
            status: 'warn',
            // mode: 'wide',
            pid: this.$refs.main.id
          });
        }
      })
    },
    handleSubmit(){
      this.login();
    },
    routeTo(username){
      this.$router.push('user/' + username);
    }
  },
  mounted(){
    // this.$refs.username.focus();
    this.$refs.main.setEnterBindBtn(this.$refs.submit.$el);
  }
}
</script>
