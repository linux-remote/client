<template lang="jade">
.lr-chat(v-if='users.list.length')
  .lr-chat-title
    div {{LANG.currently}} 
      b(style="color:#EEA1AF") {{users.list.length}} 
      | {{LANG.peopleUse}} linux-remote

    .lr-chart-ctrl(@click.stop='maxToggle',
                  :class='isMax ? "lr_task_control_shrink" : "lr-task-control-max"')
  .lr-chat-bottom(v-if='isMax')
    .lr-chat-left
      .lr-chat-name(v-for='(v,i) in users.list', :class='{lr_chat_name_is_me: v.id === users.id}')
        b {{v.name}}
        small # {{v.id}}
    .lr-chat-right
      .lr-chat-body(ref='body')
        .lr-chat-msg-item(v-for='v in messages', :class='{lr_chat_my_msg: v.isMe}')
          span.lr-chat-name(v-if='!v.isMe')
            b {{v.name}}
            small # {{v.id}}
          | {{v.msg}}
          span.lr-chat-name(v-if='v.isMe')
            b {{v.name}}
            small # {{v.id}}
      .lr-chat-input-wrap
        input(v-model='value', @keydown.13='handleClick')
        button(@click='handleClick') send
</template>
<script>

export default {
  data(){
    return {
      value: '',
      isMax: false
    }
  },

  computed: {
    users(){
      return this.$store.state.users;
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].global
    },
    messages(){
      return this.users.messages
    }
  },
  watch: {
    messages(){
      this.$nextTick(() => {
        this.$refs.body.scrollTop = 9999999;
      })
      
    }
  },
  methods: {
    maxToggle(){
      this.isMax = !this.isMax
    },
    handleClick(){
      if(this.value){
        window.APP.user_ws.send(this.value);
        // this.$store.commit('users/addMessage', {
        //   isMe: true,
        //   msg: this.value
        // })
        this.value = '';
      }
    }
  }
}

</script>
