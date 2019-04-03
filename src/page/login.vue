
<template lang="jade">
.lr-page.lr-center-flex.lr-login-wrap.theme-dark.color-fill-accent-vivid-high
  img.lr-login-logo(src="/public/img/windows-linux-logo-c.png")
  h2 Linux Remote
  .lr-login-box
    
    //- fieldset
    //-   legend.lr-login-legend {{LANG.langTitle}}
    //-   select(v-model='currLangIndex', @change="handleChange")
    //-     option(v-for='(v, i) in language.list',
    //-           :value='i',
    //-           :key='v.id') {{v.name}}
    form.theme-dark(@submit.prevent="login")
      .form-group
        label {{LANG.username}}
        input.form-control( v-model='username' required="required")
      .form-group
        label {{LANG.password}}
        input.form-control(type='password' v-model='password' required="required")
      LoadingBtn.btn-default.btn-block.theme-dark.no-outline(type="submit", :text="LANG.submitBtn", :isLoading="isRequest")
      //- button.btn.btn-default.btn-block.theme-dark.no-outline() {{LANG.submitBtn}}
      //-   .progress-bar(v-if="!isRequest")
      //-     .progress-circle
      //-     .progress-circle
      //-     .progress-circle
      //-     .progress-circle
      //-     .progress-circle
    //-fieldset.lr-login-fieldset(@keydown.13='login')
      legend.lr-login-legend {{LANG.title}}
      .lr-login-row
        label.lr-login-label {{LANG.username}}:
        input.lr-login-input( v-model='username' required="required")
      .lr-login-row
        label.lr-login-label {{LANG.password}}:
        input.lr-login-input(type='password' v-model='password' required="required")
      .lr-login-footer
        button(type="submit", :class='{lr_loading:isRequest}') {{LANG.submitBtn}}
      .lr-login-error(v-show="error") {{error}}
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
        success(){
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
