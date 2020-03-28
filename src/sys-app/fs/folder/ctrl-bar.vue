<template lang="jade">
.lr-fs-ctrl-bar
  .lr-fs-ctrl-bar_mask(v-if='disabled')
  .lr-btn_3(@click="$parent.go(homedir)", :class="{lr_bookmark_active: address === homedir}")
    .lr-icon(v-open-icon="'tango/user-home.png'")
  .lr-fs-home-margin
  .lr-btn_3(@click='addItem("directory")')
    .lr-icon(v-open-icon="'tango/folder-new-5.png'")
  .lr-btn_3(@click='addItem("file")')
    .lr-icon(v-open-icon="'tango/document-new-4.png'")
  
  button.lr-btn_3.lr-fs-upload-btn(@click='handleUploadBtnClick')
    span.iconfont.icon-upload
    span {{$parent.LANG.upload}}

  label.lr-label-input.lr-check-box.lr-fs-show-hidden
    input(type="checkbox", :checked="isShowHidden",  @change="handleCheckBoxChange")
    .lr-box_in
    span Show hidden
  //- button(@click="errDev") errDev
  //- .lr-fs-home-mark(@click="$parent.go(homedir)", v-open-icon="'tango/user-home.png'", :class="{lr_bookmark_active: address === homedir}")
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
    isShowHidden(){
      return this.$parent.info.showHidden
    },
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
    handleCheckBoxChange(e){
      let checked = e.target.checked;
      const info = this.$parent.info;
      info.showHidden = checked;
      // if(checked === false){
      //   this.$parent.hiddenHidden();
      //   let arr = [];
      //   this.$parent.list.forEach(v => {
      //     if(v.name[0] !== '.'){
      //       arr.push(v);
      //     }
      //   });
      //   info.list = arr;
      //   return;
      // }
      this.$parent.getData();
    },
    addItem(type){
      this.$parent.openCreateModal(type);
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
