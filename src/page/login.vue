
<template lang="jade">
.lr-page(:class="{lr_login_logging: isRequest}")
  .lr-mask(@mousedown.prevent)
  .lr-window(:style="{width: width + 'px', height: height + 'px', left: left + 'px', top: top + 'px'}")
    Focusable.lr-window_main(:enterBindBtn="true", ref="main")
      .lr-title
        .lr-title-content {{title}}
      .lr-window-body
        .lr-login_banner
          Icon.lr-login_logo(type="css", :size="50", value="iconfont icon-logo_LR")
          .lr-login_info
            
            h1 linux-remote
            div Linux web remote desktop
          a.lr-login_powered(href="https://github.com/linux-remote/linux-remote", target="_blank") POWERED BY
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
            Btn(@click="handleBtnClick", ref="submit") {{LANG.submitBtn}}
    Alert(v-if="alertOpt",
      :pWidth="width",
      :pHeight="height",
      :close="closeAlert",
      v-bind="alertOpt")
</template>

<script>
import { Icon,  Btn, Focusable, Alert } from '../ui/index.js';
export default {
  components: {
    Focusable,
    Icon,
    Alert,
    Btn
  },
  data(){
    const CORS = window.CLIENT_CONFIG.CORS;
    let title = 'Log On to Linux';
    title = CORS ? title + ' - ' + CORS : title;
    const width = 417;
    const left = (document.body.clientWidth - width) / 2;
    return {
      title,
      width: 417,
      left,
      top: 200,
      height: 230,
      alertOpt: null,
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
    alert(opt){
      this.alertOpt = opt;
    },
    closeAlert(){
      this.alertOpt = null;
      this.$nextTick(() => {
        this.$refs.main.$el.focus();
      });
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
        },
        error(xhr){
          this.alert({
            title: 'Logon Message',
            text: xhr.responseText,
            status: 'warn'
          });
        }
      })
    },
    handleBtnClick(){
      // this.alert({
      //   text: 'xhr.responseText',
      //   status: 'warn'
      // });
      this.login();
    },
    routeTo(username){
      this.$router.push('user/' + username);
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.$refs.submit.$el.focus();
    });
  }
}
</script>
