<template lang="jade">
tr(@dblclick='open',
    @click='$parent.itemFocus(item)',
  :class='{lr_file_hidden: item.name[0] === ".", lr_file_focus: item.focus}')
  td
    a(style='display:none', ref='a', download='true')
    ContextMenu
      .lr-ctx-item(@click='winOpen')
        .lr-icon
        | 使用浏览器打开
      .lr-ctx-item(@click='del')
        .lr-icon(:style="{backgroundImage: 'url(' + recycleIcon + ')'}")
        | 移动到回收站
      .lr-ctx-item(@click='download', v-if='item.type === "RegularFile"')
        .lr-icon
        | 下载
    .lr-name-wrap
      .lr-icon(:class='["lr_file_type_" + item.type, {["lr_fs_open_type_" + item.openType]: item.type !== "Directory"}]', :style='iconStyle')
        .lr-icon.lr-error-icon(v-if='item.linkTargetError')
      ItemName(:item='item', :p='$parent')
  td
    span(:class='{lr_per_is_on: item.is_owner}') {{item.owner}}
  td
    span(:class='{lr_per_is_on: item.is_group}') {{item.group}}
  td
    .lr-per-wrap
      .lr-per-relation-wrap
        .lr-per-relation(v-for='(v, k) in item.rwxs',
                        :class='{lr_per_is: item["is_" + k]}')
          .lr-per-item(v-for='(v2, k2) in v', :class='{lr_per_item_on: v2 }') {{k2}}
        .lr-per-sticky(v-if='item.isSticky')
      .lr-per-ACL(v-if='item.isMask') ACL
  td {{item.mtime}}
  td(v-if='item.size') {{item.size | wellSize}}
  td(v-else) 
    span.lr_is_device_type {{item.device_type}}
</template>
<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
import ItemName from './item-name.vue';

export default {
  components: {
    ContextMenu,
    ItemName
  },

  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    recycleIcon(){
      return this.$store.state.app.sysMap.sys_app_recycle_bin.iconUrl
    },
    iconStyle(){
      const app = this.item.openApp
      return app ? 
      'background-image: url(' + app.iconUrl + ')'
      : undefined
    }
  },
  methods: {
    getPath(name){
      let address = this.$parent.address;
      const a = address === '/' ? address : address + '/';
      return a + name;
    },
    getRealAddress(){
      let address, item = this.item;
      if(item.isSymbolicLink){
        address = item.linkPath;
      }else{
        address = this.$parent.address + '/' + item.name
      }
      return address;
    },

    del(){
      this.request({
        type: 'delete',
        url: '~/fs' + this.getPath(this.item.name),
        success(){
          this.$store.commit('onFsDel');
          this.$parent.list.splice(this.index, 1);
        }
      })
    },
    open(){
      const item = this.item;
      const address = this.getRealAddress();

      if(item.type === 'Directory'){
        this.$parent.go(address);
      }else if(item.type === 'RegularFile'){
        if(item.openType === 'image'){
          return this.winOpen(address);
        }
        if(item.openApp){
          this.$store.commit('task/add', {
            appId: item.openAppId,
            title: item.name,
            width: 500,
            height:500,
            address
          });
        }

      }
    },

    winOpen(address){
      address = typeof address === 'string' ? address : this.getRealAddress();
      window.open(this.request.wrapUrl('~/fs' + address, this.$route.params.username));
    },
    download(){
      const self = this;
      const url = this.getPath(this.item.name) + '?download=true';
      this.winOpen(url);
    }
  }
}
</script>
