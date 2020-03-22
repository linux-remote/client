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
        //- hr
        //- .lr-ctx-item(@click='sendToDesktop', v-if='item.type === "Directory" || item.type === "RegularFile"') {{LANG.sendToDesktop}}
        template(v-if='item.type === "RegularFile"')
          hr
          .lr-ctx-item(@click='download')
            | {{LANG.download}}
        
    .lr-name-wrap
      .lr-icon(:class='["lr_file_type_" + item.type, {["lr_fs_open_type_" + item.openType]: item.type === "RegularFile"}]', :style='iconStyle')
        .lr-icon.lr-error-icon(v-if='item.linkTargetError', v-open-icon="'nuvola/lockoverlay.png'")
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
  td(v-if='!item.device_type') {{item.size | wellSize}}
  td(v-else)
    span.lr_is_device_type {{item.device_type}}
</template>
<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
import ItemName from './item-name.vue';
import { getNewUnSuffixName } from './util';
import {encodePath, basename} from '__ROOT__/cmpt/sys-app/util';

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

      
      if(this.item.isBeSelected !== isBeSelected){ // Vue 会判定 NaN.
        this.item.isBeSelected = isBeSelected;
      }
    },

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
      const newName = getNewUnSuffixName(this.p.list, itemName + '-SymLink');
      this.request({
        type: 'post',
        url: '~/fs/' + this.p.address,
        data: {
          type: 'createSymbolicLink',
          srcName: itemName,
          newName
        },
        success(stdout){
          // this.p.shouldActiveNewItems([newName]);
          // console.log('stdout', stdout)
          this.p.publicEmit({
            type: 'add',
            address: this.p.address,
            data: this.p.createBaseItem(stdout)
          });
          this.$nextTick(() => {
            const item = this.p.$options._sync.get(newName);
            this.p.selectAndFocusItem(item);
          })
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
      this.$refs.ctx.hidden();
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
      window.open(this.request.wrapUrl('~/fs/' + encodePath(address) + queryStr));
    },

    download(){
      var url = this.p.getItemPath(this.item.name);
      this.windowOpen(url, '?download=true');
    },
    handleRename() {
      this.$refs.name.startRename();
      this.$refs.ctx.hidden();
    },
    // sendToDesktop(){
    //   this.$refs.ctx.hidden();
    //   // folder
    //   const data = {
    //     id: this.getRealAddress()
    //   }
    //   const item = this.item;
    //   if(item.type === 'Directory'){
    //     data.type = 'folder';
    //   } else {
    //     data.type = 'file';
    //     const isImage = item.openType === 'image';

    //     if(isImage) {
    //       if(item.openApp) {
    //         data.openWidth = ''
    //       }else {
    //         this.$store.commit('openWith', {
    //           filePath: address
    //         });
    //       }
    //     }
    //     data.openType = this.item.openType;
    //   }
    //   this.$store.commit('desktop/addIcon', data);
    // }
  }
}


</script>
