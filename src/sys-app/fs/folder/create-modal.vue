<template lang="jade">
form.lr-window_body(@submit.prevent="handleSubmit", @keydown.enter.prevent)
  .lr-modal-body
    .lr-modal-item
      .lr-modal-label New {{type}}:
      input.lr-input(required='required', name="filename", ref="filename", v-model='filename')
  .lr-modal-footer
    button.lr-btn(type="submit", ref="submit", :disabled="filename === ''") ok
    button.lr-btn(@click="close", type="button") cancel
</template>

<script>
export default {
  props: ['type', 'address', 'folder'],
  data(){
    return {
      filename: '',
      isRequest: false
    }
  },
  methods: {
    handleSubmit(){
      this.create();
    },
    create(){
        if(!this.filename){
          return;
        }
 
        const newName = this.filename;
        const filePath = this.folder.getItemPath(newName);
        const data = {
          filePath
        }
        let method;
        if(this.type === 'file'){
          method = 'writeFile';
          data.isCreate = true;
          data.content = '';
        } else {
          method = 'mkdir';
        }
       if(this.isRequest){
          return;
        }
        this.isRequest = true;
        this.$store.commit('wsRequest', {
          method,
          data,
          success: () => {
            this.close();
            this.folder.getNewItemInfo(newName);
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
      this.$refs.filename.focus();
      this.$parent.setEnterBindBtn(this.$refs.submit);
    })

  }
}
</script>
