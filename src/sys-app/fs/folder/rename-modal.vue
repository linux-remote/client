<template lang="jade">
form.lr-window_body(@submit.prevent="handleSubmit", @keydown.enter.prevent)
  .lr-modal-body
    .lr-modal-item
      .lr-modal-label New name:
      input.lr-input(required='required', name="filename", ref="filename", v-model='filename')
  .lr-modal-footer
    button.lr-btn(type="submit", ref="submit", :disabled="filename === this.currFilename") ok
    button.lr-btn(@click="close", type="button") cancel
</template>

<script>
export default {
  props: ['address', 'currFilename', 'success'],
  data(){
    return {
      filename: this.currFilename,
      isRequest: false
    }
  },
  methods: {
    handleSubmit(){
      this.rename();
    },
    rename(){
        if(this.filename === this.currFilename){
          return;
        }
        if(this.isRequest){
          return;
        }
        this.isRequest = true;
        const newName = this.filename;
        this.$store.commit('wsRequest', {
          method: 'sameCwdRename',
          data: {
            cwd: this.address,
            filename: this.currFilename,
            newName
          },
          success: () => {
            this.close();
            this.success(newName);
          },
          error: (err) => {
            this.alert(err.message);
          },
          complete: () => {
            this.isRequest = false;
          }
        })
    },
    close(){
      this.$parent.close();
    },
    alert(text){
      this.$store.commit('block/add', {
        type: 'alert',
        status: 'error',
        text,
        pid: this.$parent.id
      });
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.$refs.filename.select();
      this.$parent.setEnterBindBtn(this.$refs.submit);
    })

  }
}
</script>
