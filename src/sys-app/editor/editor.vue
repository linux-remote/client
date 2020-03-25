<template lang="jade">
.lr-window_body
  button.lr-btn(@click="alert") alert
  h1 Hello

//- .lr-window_body
//-   .lr-hourglass(v-show='isRequest || isSaveing || isCreating')
//-   h2(v-text='error' style='color:red' v-if='error')
//-   .lr-editor-body(v-else @keydown='handleKeyDown')
//-     .lr-editor-bar
//-       button.lr-btn-sm.lr-editor-btn(@click='save', :disabled='isSaveDisabled') save
//-     textarea.lr_editor_textarea(v-model='data')
//-   .lr-modal(v-if='isShowModal')
//-     form(@submit.prevent="saveAsSubmit")
//-       .lr-modal-box
//-         .lr-modal-title {{LANG.saveAs}}
//-         .lr-modal-body
//-           .lr-modal-item
//-             | {{LANG.folder}}:
//-             input(required='required', v-model='dir')
//-           .lr-modal-item
//-             | {{LANG.fileName}}:
//-             input(required='required', v-model='filename')
//-         .lr-modal-footer
//-           button(type="submit") {{LANG.ok}}
//-           button(@click='hiddenModal') {{LANG.cancel}}
//-   .lr-modal(v-if='isShowBeforeCloseModal')
//-     .lr-modal-box
//-       .lr-modal-title {{taskWindow.app.name}}
//-       .lr-modal-body
//-         div Do you want to save changes to
//-         div {{taskWindow.filePath || 'Untitled'}}?
//-       .lr-modal-footer
//-         button(@click="saveAndClose") Save
//-         button(@click="donotSaveAndClose") Don't Save
//-         button(@click="cannelBeforeCloseModal") {{LANG.cancel}}
</template>

<script>

// import {pathJoin, getDirAndBase} from '../util';
// import safeBind from '../../../lib/mixins/safe-bind';
export default {
  props: {
    task: {
      type: Object
    },
    filePath: {
      type: String
    }
  },
  methods: {
    alert(){
      // console.log('$parent', this.$parent)
      // this.$parent.alert({
      //   status: 'warn',
      //   text: 'haha',
      //   title: 'hello'
      // })
      this.$store.commit('block/add', {
        type: 'alert',
        status: 'warn',
        text: 'haha',
        title: 'hello',
        pid: this.$parent.id
      })
    }
  },
  created(){
  }
}
</script>
