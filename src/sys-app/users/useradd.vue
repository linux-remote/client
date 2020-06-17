<template lang="jade">
form.lr-window_body(@submit.prevent="handleSubmit", @keydown.enter.prevent)
  .lr-modal-body
    .lr-modal-item
      .lr-modal-label Username:
      input.lr-input(required='required', ref="username", name="username", v-model='username')
    .lr-modal-item
      .lr-modal-label Password:
      input.lr-input(required='required', type="password", autocomplete="new-password", name="password", ref="password", v-model='password')
  .lr-modal-footer
    button.lr-btn(type="submit", ref="ok") ok
    button.lr-btn(@click="close", type="button") cancel
</template>
<script>
export default {
  props: {
    ok: Function
  },
  data(){
    return {
      username: '',
      password: '',
      isRequest: false
    }
  },
  methods: {
    handleSubmit(){
      this.createUser();
    },
    close(){
      this.$parent.close();
    },
    createUser(){
      if(this.isRequest){
        return;
      }
      this.isRequest = true;
      this.$store.commit('wsRequest', {
        method: 'useradd',
        
      });

      this.ok({
        data: {
          password: this.password, 
          username: this.username
        },
        pid: this.$parent.id, 
        end: (isSuccsss) => {
          this.isRequest = false;
          if(isSuccsss){
            this.close();
          }
        }
      });
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.$parent.setEnterBindBtn(this.$refs.ok);
      this.$refs.username.focus();
    });
  },
  destroyed(){
    console.log('destroyed')
  }

}
</script>
