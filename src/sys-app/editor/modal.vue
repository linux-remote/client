<template lang="jade">
form.lr-window_body(@submit.prevent="handleSubmit", @keydown.enter.prevent)
  .lr-modal-body
    .lr-modal-item
      .lr-modal-label Folder:
      input.lr-input(required='required', name="folder", v-model='currDir')
    .lr-modal-item
      .lr-modal-label Filename:
      input.lr-input(required='required', name="filename", ref="filename", v-model='filename')
  .lr-modal-footer
    button.lr-btn(type="submit", ref="ok") ok
    button.lr-btn(@click="close", type="button") cancel
</template>
<script>
export default {
  props: {
    file: String, 
    ok: Function
  },
  data(){
    const currDir = this.$store.state.homedir;
    return {
      currDir,
      filename: this.file,
      isRequest: false
    }
  },
  methods: {
    handleSubmit(){
      console.log('handleSubmit');
      this.createFile();
    },
    close(){
      this.$parent.close();
    },
    createFile(){
      if(this.isRequest){
        return;
      }
      this.isRequest = true;
      this.ok({
        dir: this.currDir, 
        filename: this.filename, 
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
      this.$refs.filename.focus();
    })

  },
  destroyed(){
    console.log('destroyed')
  }

}
</script>
