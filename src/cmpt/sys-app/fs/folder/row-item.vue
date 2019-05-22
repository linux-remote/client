<template lang="jade">
tr(@dblclick='open',
   @mousedown.stop='',
   v-on="$listeners")
  td
    ContextMenu(ref='ctx')
      .lr-ctx-item(@click="handleCut")
        | {{LANG.cut}}
      .lr-ctx-item(@click="handleCopy")
        | {{LANG.copy}}
      hr
      .lr-ctx-item(@click='handleDel')
        | {{LANG.remove}}

      //-.lr-ctx-item(@click='open', v-if='item.type === "RegularFile"')
        .lr-icon
        | 使用打开

      //-.lr-ctx-item(@click='copy')
        .lr-icon
        | 复制
      template(v-if="selectedLen === 1")
        .lr-ctx-item(@click='handleRename')
          | {{LANG.rename}}
        .lr-ctx-item(@click='createSymbolicLink')
          | {{LANG.createSymbolicLink}}
        hr
        .lr-ctx-item(@click='sendToDesktop') {{LANG.sendToDesktop}}
        hr
        .lr-ctx-item(@click='download', v-if='item.type === "RegularFile"')
          | {{LANG.download}}
        
    .lr-name-wrap
      .lr-icon(:class='["lr_file_type_" + item.type, {["lr_fs_open_type_" + item.openType]: item.type === "RegularFile"}]', :style='iconStyle')
        .lr-icon.lr-error-icon(v-if='item.linkTargetError')
      ItemName(:item='item', :p='p', ref="name")
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
import { getNewName } from './util';
import {encodePath, basename} from '__ROOT__/cmpt/sys-app/util';
let count = 0;
export default {
  beSelectable : true,
  components: {
    ContextMenu,
    ItemName
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
    },
    selectedLen: {
      type: Number
    }
  },
  computed: {
    LANG(){
      return this.p.LANG.ctx
    },

    iconStyle(){
      const app = this.item.openApp;
      return app ? 
      'background-image: url(' + app.iconUrl + ')'
      : undefined
    }
  },
  methods: {
    onBeSelecting(isBeSelected){
      count = count + 1;
      console.log(count);
      if(this.item.isBeSelected !== isBeSelected){ // Vue 会判定 NaN.
        this.item.isBeSelected = isBeSelected;
      }
    },

    // send2Desktop(){
    //   this.$store.commit('deskTopTrigger', {
    //     type: 'add',
    //     item: this.item
    //   })
    // },
    getRealAddress(){
      let address, item = this.item;
      const symLink = item.symbolicLink;
      if(symLink){
        if(symLink[0] === '/'){
          address = item.symbolicLink;
        } else {
          address = this.p.getItemPath(symLink);
        }
        
      }else{
        address = this.p.getItemPath(item.name);
      }
      return address;
    },
    createSymbolicLink(){
      let itemName = this.item.name;
      if(this.item.symbolicLink){
        itemName = basename(this.item.symbolicLink);
      }
      const newName = getNewName(this.p.list, {
        basename: itemName + ' - SymLink',
        suffix: ''
      });
      this.request({
        type: 'post',
        url: '~/fs/' + this.p.address,
        data: {
          type: 'createSymbolicLink',
          srcName: this.item.symbolicLink,
          newName
        },
        success(data){
          data.name = name;
          this.$store.commit('fsPublicEmit', {
            address: this.p.address,
            type: 'add',
            item: data
          });
        }
      });
      this.$refs.ctx.hidden();
    },
    handleCut(){
      this.p.cut();
      this.$refs.ctx.hidden();
    },
    handleCopy(){
      this.p.copy();
      this.$refs.ctx.hidden();
    },
    handleDel(){
      this.$emit('del');
    },
    open(){
      const item = this.item;
      const address = this.getRealAddress();

      if(item.type === 'Directory'){
        this.p.go(address);
      }else if(item.type === 'RegularFile'){
        if(item.openType === 'image'){
          return this.windowOpen(address);
        }
        if(item.openApp){
          this.$store.commit('task/add', {
            appId: item.openAppId,
            filePath: address
          });
        }else{
          this.$store.commit('openWith', {
            filePath: address
          });
        }

      }
    },

    windowOpen(address, queryStr = ''){
      window.open(this.request.wrapUrl('~/fs/' + encodePath(address) + queryStr, this.$route.params.username));
    },

    download(){
      var url = this.p.getItemPath(this.item.name);
      this.windowOpen(url, '?download=true');
    },
    handleRename() {
      this.$refs.name.startRename();
      console.log('handleRename');
    },
    sendToDesktop(){
      this.$refs.ctx.hidden();
    }
  }
}


</script>
