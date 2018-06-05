<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  h2(v-html='data[0]' style='color:red' v-if='error')
  .lr-edit-body(v-else @keydown='handleKeyDown')
    .lr-edit-bar
      button.btn.btn-sm.btn-default(style='padding: 2px' @click='save' , :disabled='isSaveDisabled') save
    textarea.lr_edit_textarea(v-model='data')
</template>

<script>

export default {
  props: ['address'],
  data(){
    return {
      isRequest: false,
      oldData: '',
      data: []
    }
  },
  methods: {
    handleKeyDown(e){
      if(e.ctrlKey && e.which === 83){
        this.save();
        e.preventDefault();
      }
    },
    save(){
      if(this.isSaveDisabled) return;
      this.request({
        url: '~/fs' + this.address,
        stateKey: 'isRequest',
        type: 'put',
        data: {text: this.data},
        success(data){
          this.oldData = this.data;
          console.log(data);
        }
      })
    },
    getData(){
      //return console.log('this.address', this.address)
      this.request({
        url: '~/fs' + this.address,
        data: {file: true},
        success(data){
          this.oldData = data;
          this.data = data;
        },
        error(xhr){
          this.data = [`${xhr.responseText}`]
        }
      })
    }
  },
  computed: {
    isSaveDisabled(){
      return this.oldData === this.data
    },
    error(){
      if(Array.isArray(this.data) && this.data.length){
        return true;
      }else{
        return false;
      }
    }
  },
  created(){
    this.getData();
  }
}
</script>
