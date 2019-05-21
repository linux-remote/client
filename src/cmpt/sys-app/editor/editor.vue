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
            input(required='required', v-model='dir')
          .lr-modal-item
            | {{LANG.fileName}}:
            input(required='required', v-model='fliename')
        .lr-modal-footer
          button.lr-btn-primary(type="submit") {{LANG.ok}}
          button(@click='hiddenModal') {{LANG.cancel}}
</template>

<script>
import {encodePath, pathJoin, getDirAndBase} from '__ROOT__/cmpt/sys-app/util';
export default {
  inject: ['taskWindow'],
  data(){


    
    return {
      isRequest: false,

      fliename: '',
      dir: '',


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
    init(){
      const filePath = this.taskWindow.filePath;

      const dirAndBase = getDirAndBase(filePath);
      this.fliename = dirAndBase.base;
      this.dir = dirAndBase.dir;

      this.taskWindow.title = this.fliename;
    },
    submit(){

      // console.log('folderPath', this.folderPath, 'fliename',this.fliename )
      // console.log('pathJoin', pathJoin(this.folderPath , this.fliename) )
      // return;


      


      // this.taskWindow.dir = this.folderPath;
      // const address = pathJoin(this.folderPath , this.fliename);
      // this.taskWindow.address = '~/fs/' + encodePath(address)
      

      this.save(() => {
        this.hiddenModal();
      });
      
    },
    save(addCallback){
      if(this.isSaveDisabled){
        return;
      }
      let filePath = this.taskWindow.filePath;
      if(!filePath){
        this.isShowModal = true;
        return;
      }
      var isAdd = typeof addCallback === 'function';

      this.request({
        url: `~/fs/` + encodePath(this.taskWindow.filePath),
        stateKey: 'isRequest',
        type: 'put',
        data: {
          text: this.data
        },
        success(resData){
          console.log('resData', resData);

          // resData.name = this.taskWindow.title;

          // this.$store.commit('fsPublicEmit', {
          //   address: this.taskWindow.dir,
          //   type: isAdd ? 'add' : 'update',
          //   item: resData
          // });

          this.oldData = this.data;
          
          isAdd && addCallback();
        }
      });
    },
    getData(){

      this.request({
        url:  `~/fs/` + encodePath(this.taskWindow.filePath),
        stateKey: 'isRequest',
        dataType: 'text',
        data: {
          file: true
        },
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
      return this.oldData === this.data;
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
    if(this.taskWindow.filePath){
      this.init();
      this.getData();
    }
    
  }
}
</script>
