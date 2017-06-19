<template lang="jade">
.lr-window-body
  .lr-hourglass.glyphicon.glyphicon-hourglass(v-show='isRequest')
  h2(v-html='data' style='color:red' v-if='error')
  .lr-edit-body(v-else @keydown='handleKeyDown')
    .lr-edit-bar
      button.btn.btn-sm.btn-default(style='padding: 2px' @click='save' , :disabled='isSaveDisabled') save
    textarea.lr_edit_textarea(v-model='data') {{data[0]}}
</template>

<script>

export default {
  props: ['address'],
  data(){
    return {
      isRequest: false,
      oldData: '',
      data: [],
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
          this.data = [`http ${xhr.status} 错误: <br>${xhr.responseText}`]
        }
      })
    }
  },
  computed: {
    isSaveDisabled(){
      return this.oldData === this.data
    },
    error(){
      return typeof this.data === 'object';
    }
  },
  created(){
    this.getData();
  }
}
</script>
