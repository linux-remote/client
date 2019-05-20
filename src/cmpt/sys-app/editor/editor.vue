<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  h2(v-text='data[0]' style='color:red' v-if='error')
  .lr-editor-body(v-else @keydown='handleKeyDown')
    .lr-editor-bar
      button.btn.btn-sm.btn-default(style='padding: 2px' @click='save' , :disabled='isSaveDisabled') save
    textarea.lr_editor_textarea(v-model='data')
  .lr-modal(v-if='isShowModal')
    form(@submit.prevent="submit")
      .lr-modal-box
        .lr-modal-title {{LANG.saveAs}}
        .lr-modal-body
          .lr-modal-item
            | {{LANG.folder}}:
            input(required='required', v-model='folderPath')
          .lr-modal-item
            | {{LANG.fileName}}:
            input(required='required', v-model='flieName')
        .lr-modal-footer
          button.lr-btn-primary(type="submit") {{LANG.ok}}
          button(@click='hiddenModal') {{LANG.cancel}}
</template>

<script>
import {encodePath, pathJoin} from '../fs/folder/util';
export default {
  props: ['task'],
  data(){
    return {
      folderPath: '',
      flieName: '',
      isRequest: false,
      oldData: '',
      data: [],
      isShowModal: false
    }
  },
  methods: {
    hiddenModal(){
      this.isShowModal = false;
    },
    handleKeyDown(e){
      if(e.ctrlKey && e.which === 83){
        this.save();
        e.preventDefault();
      }
    },
    submit(){

      // console.log('folderPath', this.folderPath, 'flieName',this.flieName )
      // console.log('pathJoin', pathJoin(this.folderPath , this.flieName) )
      // return;
      this.task.dir = this.folderPath;
      const address = pathJoin(this.folderPath , this.flieName);
      this.task.address = '~/fs/' + encodePath(address)
      this.task.title = this.flieName
      this.save(() => {
        this.hiddenModal();
      });
      
    },
    save(cb){
      if(this.isSaveDisabled){
        return;
      }
      let url = this.task.address;
      if(!url){
        this.isShowModal = true;
        console.log('new one')
        return;
      }
      var isAdd = typeof cb === 'function';
      this.request({
        url: this.task.address,
        stateKey: 'isRequest',
        type: 'put',
        data: {text: this.data},
        success(data){
          data.name = this.task.title;
          this.$store.commit('fsPublicEmit', {
            address: this.task.dir,
            type: isAdd ? 'add' : 'update',
            item: data
          });
          this.oldData = this.data;
          isAdd && cb();
        }
      })
    },
    getData(){

      this.request({
        url: this.task.address,
        stateKey: 'isRequest',
        dataType: 'text',
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
    LANG(){
      return this.$store.getters['language/currLanguage'].global
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
    if(!this.task.address){
      return;
    }
    this.getData();
  }
}
</script>
