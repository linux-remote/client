<template lang="jade">
.lr-window_body
  .lr-hourglass(v-show='isRequest && !$parent.isBlock')
  h2(v-text='error' style='color:red' v-if='error')
  .lr-editor-body(v-else @keydown.s='handleKeyDown')
    .lr-editor-bar
      button.lr-btn_nf.lr-editor-btn(@click='save', :disabled='isSaveDisabled') Save
    textarea.lr_editor_textarea(v-model='data')

</template>

<script>

import {pathJoin, getDirAndBase} from '../util';
import safeBind from '../../lib/mixins/safe-bind';
import Modal from './modal.vue';
export default {
  props: ['task'],
  mixins: [safeBind],
  data(){
    return {
      isRequest: false,

      filename: '',
      dir: '',


      oldData: '',
      data: '',
      error: null
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
    openSaveAs(){
      this.$store.commit('block/add', {
            title: 'Save As',
            width: 325,
            height: 175,
            enterBindBtn: true,
            // mode: 'wide',
            cmpt: Modal,
            propsData: {
              file: this.filename,
              ok: (opt) => {
                this.writeFile(opt)
              }
            },
            pid: this.$parent.id
      })
    },
    writeFile(opt){
      let filePath, pid, isCreate;
      if(opt){
        filePath = pathJoin(opt.dir, opt.filename);
        pid = opt.pid;
        isCreate = true;
      } else {
        filePath = this.$options._filePath;
        pid = this.$parent.id;
        isCreate = false;
      }
      if(this.isRequest){
        return;
      }
      this.isRequest = true;
      this.$store.commit('wsRequest', {
        method: 'writeFile',
        data: {
          filePath,
          content: this.data,
          isCreate
        },
        success: () => {
          this.oldData = this.data;
          if(this.$options._isSaveAndClose) {
            this.close();
          } else {
            if(opt){
              this.dir = opt.dir;
              this.filename = opt.filename;
              this.$options._filePath = filePath;
              this.chTitle();
              opt.end(true);
            }
          }
        },
        error: (err) => {
          this.$store.commit('block/add', {
            type: 'alert',
            status: 'error',
            text: err.message,
            title: 'Error: ' + err.method + ' ' + err.status,
            pid
          });
          if(opt){
            opt.end(false);
          }
        },
        complete: () => {
          this.isRequest = false;
        }
      });
    },
    handleKeyDown(e){
      if(e.ctrlKey){
        this.save();
        e.preventDefault();
      }
    },
    save(){
      if(this.isSaveDisabled){
        return;
      }
      let filePath = this.$options._filePath;
      if(!filePath) {
        this.openSaveAs();
        return;
      }
      this.writeFile();
    },
    chTitle(){
      this.$parent.title = this.filename  + ' - ' + this.task.app.name;
    },
    getData(){
      if(this.error) {
        this.error = null;
      }
      this.$store.commit('wsRequest', {
        method: 'readFile',
        data: this.$options._filePath,
        success: (data) => {
          this.oldData = data;
          this.data = data;
        },
        error: (err) => {
          this.error = err;
        }
      });
    },
    openPreventClose(){
      this.$store.commit('block/add', {
        type: 'triple',
        text: `Save changes to "${this.filename}"?`,
        pid: this.$parent.id,
        yesFn: () => {
          this.$options._isSaveAndClose = true;
          this.save();
        },
        noFn: () => {
          this.$options._isDonotSaveAndClose = true;
          this.close();
        }
      });
    },
    _isFirstCreateEmpty(){
       if(this.$options._filePath){
         return false;
       }
       if(!this.data && !this.oldData){
         return true;
       }
       return false;
    },
    handleWindowClose(e){
      if(this._isFirstCreateEmpty()){
        return;
      }
      if(!this.isSaveDisabled && !this.$options._isDonotSaveAndClose){
        this.openPreventClose();
        e.preventDefault();
      }
    },
    close(){
      this.$nextTick(() => {
        this.$parent.close();
      });
    },
    cannelBeforeCloseModal(){
      if(this.$options._isSaveAndClose) { // 取消.
        this.$options._isSaveAndClose = false;
      }
    },
    init(){
      const option = this.task.launchOption;
      const filePath = option.filePath;

      const dirAndBase = getDirAndBase(filePath);
      this.filename = dirAndBase.base;
      this.dir = dirAndBase.dir;
      this.chTitle();
    }
  },
  created(){
    const filePath = this.$options._filePath = this.task.launchOption.filePath;
    if(filePath){
      this.init();
      this.getData();
    } else {
      this.filename = 'Untitled';
      this.chTitle();
    }
    
  },
  mounted(){
    this.safeBind(this.$parent, 'close', (e) => {
      this.handleWindowClose(e);
    });
  }
}
</script>
