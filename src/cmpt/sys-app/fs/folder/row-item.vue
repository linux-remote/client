<template lang="jade">
tr(@dblclick='open',
  @click='p.itemFocus($data, $event)',
  @mousedown.stop='',
  :class='{lr_file_hidden: item.isHidden, lr_file_focus: focus, lr_file_former: focus === 0, lr_file_be_selected: beSelected}')
  td
    ContextMenu(ref='ctx')
      .lr-ctx-item(@click='handleDel')
        | {{LANG.remove}}
      //-.lr-ctx-item(@click='open', v-if='item.type === "RegularFile"')
        .lr-icon
        | 使用打开
      .lr-ctx-item(@click='download', v-if='item.type === "RegularFile"')
        | {{LANG.download}}
      //-.lr-ctx-item(@click='copy')
        .lr-icon
        | 复制
      hr
      .lr-ctx-item(@click='createSymbolicLink')
        | {{LANG.createSymbolicLink}}
        
    .lr-name-wrap
      .lr-icon(:class='["lr_file_type_" + item.type, {["lr_fs_open_type_" + item.openType]: item.type !== "Directory"}]', :style='iconStyle')
        .lr-icon.lr-error-icon(v-if='item.linkTargetError')
      ItemName(:item='item', :p='p')
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
import {encodePath} from './util';
export default {
  beSelectable : true,
  components: {
    ContextMenu,
    ItemName
  },
  data(){
    return {
      beSelected: false,
      focus: false
    }
  },
  props: {
    item: {
      type: Object
    },
    p: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    LANG(){
      return this.p.LANG.ctx
    },

    iconStyle(){
      const app = this.item.openApp
      return app ? 
      'background-image: url(' + app.iconUrl + ')'
      : undefined
    }
  },
  methods: {
    // copy(){

    // },
    // send2Desktop(){
    //   this.$store.commit('deskTopTrigger', {
    //     type: 'add',
    //     item: this.item
    //   })
    // },
    getRealAddress(){
      let address, item = this.item;
      if(item.isSymbolicLink){
        address = item.linkPath;
      }else{
        address = this.p.getItemPath(item.name)
      }
      return address;
    },
    createSymbolicLink(){
      this.$refs.ctx.hidden();
      this.p.createSysLinkName = this.item.name;
    },
    handleDel(){
      if(this.p.selectedArr.length){
        this.p.selectedArr.forEach(item => {
          console.log('item', item)
          item.del();
        })
      }else{
        this.del();
      }
    },
    del(){

      this.request({
        type: 'delete',
        url: '~/fs/' + encodePath(this.p.getItemPath(this.item.name)),
        success(){
          this.$store.commit('recycleBinTrigger');
          this.$store.commit('fsTrigger', {
            address: this.p.address,
            type: 'del',
            item: this.item
          });
        }
      })
    },
    open(){
      const item = this.item;
      const address = this.getRealAddress();

      if(item.type === 'Directory'){
        this.p.go(address);
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
            dir: this.p.address,
            address: '~/fs/' + encodePath(address)
          });
        }else{
          this.$store.commit('openWith', {
            item,
            address: '~/fs/' + encodePath(address)
          });
        }

      }
    },

    winOpen(address, queryStr = ''){
      window.open(this.request.wrapUrl('~/fs/' + encodePath(address) + queryStr, this.$route.params.username));
    },

    download(){
      var url = this.p.getItemPath(this.item.name);
      this.winOpen(url, '?download=true');
    }
  }
}
</script>
