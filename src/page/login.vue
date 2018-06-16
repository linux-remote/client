
<template lang="jade">
.lr-page.lr-login-warp
  h1.lr-login-h1 Linux Remote
  fieldset
    legend.lr-login-legend {{LANG.langTitle}}
    select(v-model='currLangIndex', @change="handleChange")
      option(v-for='(v, i) in language.list',
            :value='i',
            :key='v.id') {{v.name}}
  form(@submit.prevent="login")
    fieldset.lr-login-fieldset(@keydown.13='login')
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
</template>

<script>
export default {
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
        error(xhr){
          this.error = `http #${xhr.status}: ${xhr.responseText}`;
        }
      })
    },
    routeTo(username){
      this.$router.push('user/' + username);
    }
  }
}
</script>
