<template lang="jade">
.lr-fs-ctrl-bar
  .lr-fs-ctrl-bar-mask(v-if='disabled')

  
  .lr-icon(@click='addItem("Directory")', v-open-icon="'tango/folder-new-5.png'")
  .lr-icon(@click='addItem("RegularFile")', v-open-icon="'tango/document-new-4.png'")
   
  button.lr-btn-sm.lr-fs-upload-btn(@click='handleUploadBtnClick')
    span.iconfont.icon-upload
    span {{$parent.LANG.upload}}

  label.lr-label-input.lr-check-box.lr-fs-show-hidden
    input(type="checkbox", :checked="!isDisableShowHidden || isShowHomeHidden",:disabled="!isDisableShowHidden", @change="handleCheckBoxChange")
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
    isShowHomeHidden(){
      return this.$store.state.isShowHomeHidden
    },
    homedir(){
      return this.$store.state.homedir
    },
    address(){
      return this.$parent.address
    },
    isDisableShowHidden(){
      return this.address === this.homedir;
    }
  },
  methods: {
    changeModel(model){
      this.$parent.model = model;
    },
    handleCheckBoxChange(e){
      let checked = e.target.checked;
      console.log('checked', checked)
      this.$store.commit('set', {
        isShowHomeHidden: e.target.checked
      });
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
