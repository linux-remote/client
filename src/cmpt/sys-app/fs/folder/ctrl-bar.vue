<template lang="jade">
.lr-fs-ctrl-bar
  .lr-fs-ctrl-bar-mask(v-if='disabled')

  
  .lr-icon(@click='addItem("Directory")', v-open-icon="'tango/folder-new-5.png'")
  .lr-icon(@click='addItem("RegularFile")', v-open-icon="'tango/document-new-4.png'")
   
  button.lr-btn-sm.lr-fs-upload-btn(@click='handleUploadBtnClick')
    span.iconfont.icon-upload
    span {{$parent.LANG.upload}}
  //- button(@click="errDev") errDev
  .lr-fs-home-mark(@click="$parent.go(homedir)", :class="{lr_bookmark_active: address === homedir}")
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
  computed: {
    homedir(){
      return this.$store.state.homedir
    },
    address(){
      return this.$parent.address
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
