<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  h2(v-text='error' style='color:red' v-if='error')
  .lr-editor-body(v-else @keydown='handleKeyDown')
    .lr-editor-bar
      button.btn.btn-sm.btn-default(style='padding: 2px' @click='save', :disabled='isSaveDisabled') save
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
            input(required='required', v-model='filename')
        .lr-modal-footer
          button.lr-btn-primary(type="submit") {{LANG.ok}}
          button(@click='hiddenModal') {{LANG.cancel}}
  .lr-modal(v-if='isShowBeforeCloseModal')
    .lr-modal-box
      .lr-modal-title {{taskWindow.appTitle}}
      .lr-modal-body
        div Do you want to save changes to
        div {{taskWindow.filePath || 'Untitled'}}?
      .lr-modal-footer
        button(@click="saveAndClose") Save
        button(@click="donotSaveAndClose") Don't Save
        button(@click="cannelBeforeCloseModal") {{LANG.cancel}}
</template>

<script>
import {encodePath, pathJoin, getDirAndBase} from '__ROOT__/cmpt/sys-app/util';
import safeBind from '../../../lib/mixins/safe-bind';
export default {
  inject: ['taskWindow'],
  mixins: [safeBind],
  data(){


    
    return {
      isRequest: false,

      filename: '',
      dir: '',


      oldData: '',
      data: '',
      error: '',
      isShowModal: false,
      isShowBeforeCloseModal: false
    }
  },

  computed: {
    isSaveDisabled(){
      // $优化: this.oldData.length === this.data.length  性能测试: 看浏览器有没有优化.
      return this.oldData === this.data ;
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].global
    }
  },
  methods: {
    hiddenModal(){
      this.$nextTick(() => { // bug: 在第二个输入框输入后, 点关闭不消失.
        this.isShowModal = false;
      });
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
      this.filename = dirAndBase.base;
      this.dir = dirAndBase.dir;

      this.taskWindow.title = this.filename;
    },
    submit(){

      // console.log('folderPath', this.folderPath, 'filename',this.filename )
      // console.log('pathJoin', pathJoin(this.folderPath , this.filename) )
      // return;

      // this.taskWindow.dir = this.folderPath;
      // const address = pathJoin(this.folderPath , this.filename);
      // this.taskWindow.address = '~/fs/' + encodePath(address)
   
      this.create(() => {
          this.hiddenModal();
      });
      
    },
    create(cb){
      this.request({
        stateKey: 'isRequest',
        type: 'post',
        url: `~/fs/` + encodePath(this.dir),
        data: {
          type: 'createFile',
          name: this.filename,
          content: this.data
        },
        success() {
          this.taskWindow.filePath = pathJoin(this.dir, this.filename);
          this.taskWindow.title = this.filename;
          this.oldData = this.data;
          cb && cb();
          if(this.$options._isSaveAndClose) {
             this.closeTaskWindow();
          }
        }
      })
    },
    save(){
      if(this.isSaveDisabled){
        return;
      }
      let filePath = this.taskWindow.filePath;
      if(!filePath) {
        this.isShowModal = true;
        this.$nextTick(() => {
          let dom = this.$refs.modalFolderInput;
          if(dom){
            dom.focus();
          }
        });
        return;
      }

      this.request({
        url: `~/fs/` + encodePath(filePath),
        stateKey: 'isRequest',
        type: 'put',
        data: {
          text: this.data
        },
        success(resData){
          // console.log('resData', resData);

          // resData.name = this.taskWindow.title;

          // this.$store.commit('fsPublicEmit', {
          //   address: this.taskWindow.dir,
          //   type: isAdd ? 'add' : 'update',
          //   item: resData
          // });
          
          this.oldData = this.data;

          if(this.$options._isSaveAndClose) {
             this.closeTaskWindow();
          }
        }
      });
    },
    getData(){
      if(this.error) {
        this.error = '';
      }
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
          this.error = xhr.responseText;
        }
      })
    },
    _isFirstCreateEmpty(){
       if(this.taskWindow.filePath){
         return false;
       }
       if(!this.data && !this.oldData){
         return true;
       }
       return false;
    },
    handleTaskWindowClose(e){
      if(this._isFirstCreateEmpty()){
        return;
      }
      if(!this.isSaveDisabled && !this.$options._isDonotSaveAndClose){
        this.isShowBeforeCloseModal = true;
        e.preventDefault();
      }
    },
    donotSaveAndClose(){
      this.$options._isDonotSaveAndClose = true;
      this.closeTaskWindow();
    },
    closeTaskWindow(){
      this.$nextTick(() => {
        this.taskWindow.close();
      });
    },
    saveAndClose(){
      this.$options._isSaveAndClose = true;
      if(!this.taskWindow.filePath){
        this.isShowBeforeCloseModal = false;
      }
      this.save();
    },
    cannelBeforeCloseModal(){
      if(this.$options._isSaveAndClose) { // 无法保存的情况.
        this.$options._isSaveAndClose = false;
      }
      this.isShowBeforeCloseModal = false;
    }
  },
  created(){
    if(this.taskWindow.filePath){
      this.init();
      this.getData();
    } else {
      this.dir = this.$store.state.homedir;
    }
    
  },
  mounted(){
    this.safeBind(this.taskWindow, 'close', (e) => {
      this.handleTaskWindowClose(e);
    })
  }
}
</script>
