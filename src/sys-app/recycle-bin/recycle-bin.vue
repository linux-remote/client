<template lang="jade">
.lr-window_body.lr-rb-wrap
  
  .lr-hourglass(v-show='isRequest || isDeling')
  .lr-rb-ctrl-bar
    button.lr-btn_nf.lr-rb_btn_empty(@click='openEmptyConfirm', :disabled='list.length === 0', style="margin-right: 10px") Empty Recycle Bin
    //- div(style="color: red") {{(totalCount / maxLen) * 100}} %

    button.lr-btn_nf(@click='getData', :disabled="isRequest") Reload
  
  h2(style='color:red' v-if='info.error') {{info.error.message}}
  h2(v-else-if='list.length === 0' style='color:gray') Empty
  .lr-rb-folder_body(v-else)
    Table(:thead='thead')
      template(v-slot="tbody")
        Contextmenuable.lr-table-tr(v-for='(item,i) in list', 
                    :class="{lr_rb_err: item.isError}", 
                    :key='item.id', 
                    tabindex="-1")
          .lr-rb_item_name(:style="{width: tbody.cols[0] + 'px'}")
            .lr-icon(v-open-icon="item.icon")
            span {{item.source.base}}
          div(:style="{width: tbody.cols[1] + 'px'}") {{item.source.dir}}
          div(:style="{width: tbody.cols[2] + 'px'}") {{item.delTime}}
          div(:style="{width: tbody.cols[3] + 'px'}") {{item.size | wellSize}}
          template(v-slot:contextmenu="ctx")
            template(v-if="item.source.dir")
              .lr-ctx-item(@click="handleResotreClick(ctx, item)") Restore
              .lr-hr
            .lr-ctx-item(@click="handleDeleteClick(ctx, item)") Delete

</template>

<script>
import {Table} from '../../ui/index';
import folderMap , { getOrInit , syncFolderMap} from '../lib/folder-map';
import lsParse from '../lib/ls-parse';
import recycleParse from './parse';
import RowItem from './row-item.vue';
import Contextmenuable from '../../ui/desktop-cmpt/global/contextmenuable.vue';
import parseList from '../fs/folder/fs-list-parse';
import { sortByStrKey } from '../util';
import SafeBind from '../../lib/mixins/safe-bind';
export default {
  mixins: [SafeBind],
  props: ['task'],

  components: {
    RowItem,
    Contextmenuable,
    Table
  },
  data(){
    return {
      thead: [
        {

          width: 190,
          name: 'Name'
        },
        {
   
          width: 160,
          name: 'Original Location'
        },
        {

          width: 140,
          name: 'Date Deleted'
        },
        {

          width: 70,
          name: 'Size'
        },
      ],
      isRequest: false,
      isDeling: false,
      list: [],
      info: getOrInit(window.APP.RECYCLE_BIN_PATH),
      maxLen: 100,
      totalCount: 0,
      isShowPreDelModal: false,
      preDelMsg: '',
      error: null
    }
  },
  computed: {
    recycleBinEvent(){
      return this.$store.state.recycleBinEvent;
    },
    isError(){
      return !this.list && this.error;
    }
  },
  watch: {
    recycleBinEvent(){
      this.getData();
    },
    'info.map' : function(){
      this.genList();
    },
    list(newVal, oldVal){
      var isEmpty;
      if(!newVal.length){
        isEmpty = true;
      } else {
        if(!oldVal){
          isEmpty = false;
        } else {
          return;
        }
      }
      this.$store.commit('sysApps/changeRecycleBinIcon', isEmpty);
    }
  },

  methods: {
    handleResotreClick(ctx, item){
      if(this.isRequest){
        return;
      }
      this.isRequest = true;
      this.$store.commit('wsRequest', {
        method: 'recycleBinResotre',
        data: {
          id: item.id,
          sourcePath: item.source.path
        },
        success: (len) => {
          const infoMap = this.info.map;
          const sourceInfo = folderMap[item.source.dir];
          if(sourceInfo){
            const sourceItem = infoMap[item.id];
            sourceItem.name = item.source.base;
            this.$set(sourceInfo.map, sourceItem.name, sourceItem);
          }
          this.$delete(infoMap, item.id);
          this.$delete(infoMap, item.id + '.lnk');
          this.$store.commit('recycleBinChange', len);

          this.$nextTick(() => {
            this.$parent.focusenter();
          });
        },
        error: (err) => {
          this.alert(err);
        },
        complete: () => {
          this.isRequest = false;
        }
      })
      ctx.close();
    },
    handleDeleteClick(ctx, item){
      if(item.isError){
        this.delItem(item);
      } else {
        this.openDelItemConfirm(item);
      }
      ctx.close();
    },
    genList(){
      let parsedResult = recycleParse(this.info.map);
      sortByStrKey(parsedResult, 'delTime', true);
      this.list = parsedResult;
    },

    openDelItemConfirm(item){
      this.$store.commit('block/add', {
        type: 'confirm',
        text: 'Are you sure you want to permanently delete "' + item.source.base + '" ?',
        title: 'Empty Recycle Bin',
        pid: this.$parent.id,
        okFn: () => {
          this.delItem(item);
        }
      });
    },
    delItem(item){
      const filenames = [item.id]
      if(!item.isError){
        filenames.push(item.id + '.lnk');
      }
      if(this.isDeling){
        return;
      }
      this.isDeling = true;
      this.$store.commit('wsRequest', {
        method: 'recycleBinDel',
        data: {
          filenames
        },
        success: (len) => {
          filenames.forEach(name => {
            this.$delete(this.info.map, name);
          });
          this.$store.commit('recycleBinChange', len);
          this.$nextTick(() => {
            this.$parent.focusenter();
          });
        },
        error: (err) => {
          this.alert(err);
        },
        complete: () => {
          this.isDeling = false;
        }
      })
    },
    openEmptyConfirm(){
      this.$store.commit('block/add', {
        type: 'confirm',
        text: 'Are you sure to permanently delete All ?',
        title: 'Empty Recycle Bin',
        pid: this.$parent.id,
        okFn: () => {
          this.empty();
        }
      });
    },
    empty(){
      if(this.isDeling){
        return;
      }
      this.isDeling = true;
      this.$store.commit('wsRequest', {
        method: 'emptyRecycleBin',
        success: (len) => {
          this.$store.commit('recycleBinChange', len);
          this.emptySuccessed();
        },
        error: (err) => {
          this.alert(err);
        },
        complete: () => {
          this.isDeling = false;
        }
      })
    },
    emptySuccessed(){
      this.info.map = Object.create(null);
      this.list = [];
    },
    alert(error){
      this.$store.commit('block/add', {
        type: 'alert',
        status: 'error',
        text: error.message,
        pid: this.$parent.id
      })
    },
    getData(){
      const info = this.info;
      if(info.isRequest){
        return;
      }
      info.isRequest = true;
      let cwd = window.APP.RECYCLE_BIN_PATH;
      let data = {
        cwd,
        all: false
      };
      this.$store.commit('wsRequest', {
        method: 'ls',
        data,
        success: (stdout) => {
          info.error = null;
          const result = lsParse(stdout);
          this.totalCount = result.length;
          const data = parseList(result);
          this.info.map = syncFolderMap(data.list, this.info.map);
        },
        complete: () => {
          info.isRequest = false;
        },
        error: (err) => {
          info.error = err;
        }
      });
    },
    handleDelFiles(ids){
      let filenames = [];
      ids.forEach(fileId => {
        filenames.push(fileId);
        filenames.push(fileId + '.lnk');
      });
      const info = this.info;
      if(info.isRequest){
        return;
      }
      info.isRequest = true;
      // console.log('filenames', filenames)
      this.$store.commit('wsRequest', {
        method: 'ls',
        data: {
          cwd: window.APP.RECYCLE_BIN_PATH,
          filenames
        },
        success: (stdout) => {
          info.error = null;
          let data = lsParse(stdout, true);
          data = parseList(data);
          const map = this.info.map;
          data.list.forEach(item => {
            this.$set(map, item.name, item);
          })
        },
        error: (err) => {
          info.error = err;
        },
        complete: () => {
          info.isRequest = false;
        }
      });
    }
    // ,
    // getData(){
    //   const info = this.info;
    //   if(info.isRequest){
    //     return;
    //   }
    //   info.isRequest = true;
    //   this.$store.commit('wsRequest', {
    //     method: 'getRecycleBin',
    //     success: (stdout) => {
    //       this.error = null;
    //       const result = lsParse(stdout);
    //       this.totalCount = result.length;
    //       let parsedResult = recycleParse(result);
    //       this.list = parsedResult.list;
    //     },
    //     error: (error) => {
    //       this.error = error;
    //     },
    //   });
    // }
  },

  created(){
    this.getData();
  },
  mounted(){
    this.safeBind(this.$root, 'delFiles', ({ids}) => {
      this.handleDelFiles(ids);
    })
    this.safeBind(this.$root, 'emptyRecycleBined', () => {
      this.emptySuccessed();
    })
  }
}
</script>
