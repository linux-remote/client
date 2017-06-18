<template lang="jade">
.lr-window-body
    .lr-fs-bar
      .lr-3-item.glyphicon.glyphicon-arrow-left
      .lr-3-item.glyphicon.glyphicon-arrow-up
      .lr-3-item.glyphicon.glyphicon-arrow-right
      input.lr-2-address(v-model='address')
      .lr-3-item.glyphicon.glyphicon-play
    .lr-fs-body
      .lr-file(v-for='item in data', :class='{lr_2_file_link: item.isSymbolicLink}')
        .lr-2-icon.glyphicon.glyphicon-file(v-if='!item.isDirectory')
        .lr-2-icon.glyphicon.glyphicon-folder-close(v-else-if='item.isDirectory')
        .lr-2-name {{item.name}}
</template>

<script>
import store from '__ROOT__/store-global';
export default {
  data(){
    console.log(store.state)
    const pData = this.$parent;
    const address = pData.address || store.state.homedir;
    return {
      isRequest: false,
      address,
      data: []
    }
  },
  methods: {
    getData(){
      this.request({
        url: '~/fs' + this.address,
        data: {dir: true},
        success(data){
          this.data = data;
        }
      })
    }
  },
  created(){
    this.getData();
  }
}
</script>
