<template lang="jade">
.lr-fs-ctrl-bar
  .lr-fs-ctrl-bar-mask(v-if='disabled')

  
  .lr-icon.lr-fs-new-folder(@click='addItem("Directory")')
  .lr-icon.lr-fs-new-file(@click='addItem("RegularFile")')
   
  button.btn.btn-primary.btn-xs(@click='handleUploadBtnClick')
    span.glyph.glyph-upload
    span {{$parent.LANG.upload}}
  //- button(@click="errDev") errDev

</template>
<script>
  // div(style='flex-grow: 1')
  // .lr-icon.lr-fs-icon-model
  // .lr-icon.lr-fs-list-model
  // button(:class='{lr_file_model_on: $parent.model === "icon"}', @click='changeModel("icon")') 图标格式
  // button(:class='{lr_file_model_on: $parent.model === "list"}', @click='changeModel("list")') 列表格式

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    changeModel(model){
      this.$parent.model = model;
    },
    addItem(type){
      if(this.$parent.preCreateItem){
        return;
      }
      this.$parent.preCreateItem = {
        name: '',
        type,
        size: 10
      }
      this.$parent.selectAndFocusItem(this.$parent.preCreateItem);
    },
    handleUploadBtnClick(){
      this.$store.commit('upload/start', this.$parent.address);
    },
    // errDev() {
      
    // this.$store.commit('error/show', `Error: ${Date.now()}`);
    // }
  }
}
</script>
