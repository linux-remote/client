<template lang="jade">
.lr-window-body
  
  .lr-hourglass(v-show='isRequest')
  .lr-rb-ctrl-bar
    button.btn(@click='clearAll', :disabled='isEmpty') Delete All
    //- div(style="color: red") {{(totalCount / maxLen) * 100}} %

    button.btn(@click='getData') Reload
  .lr-fs-folder-inner
    h2(v-text='error' style='color:red' v-if='error')
    h2(v-else-if='list.length === 0' style='color:gray') Empty
    .lr-fs-folder(v-else)
      table.table.lr-info-table.lr-table(style='width:100%;')
        tr
          th Name
          th Original Location
          th Date Deleted
          th Size
          th
        tr(v-for='(item,i) in list' , :key='item.id')
          td {{item.source.base}}
          td {{item.source.dir}}
          td {{item.source.delTime}}
          td {{item.size | wellSize}}
          td(style='display:flex')
            button(@click='restore(item)') Restore
            button(@click='del(item)') Delete
</template>

<script>
import lsParse from '../lib/ls-parse';
import recycleParse from './parse';
export default {
  data(){
    return {
      isRequest: false,
      list: [],
      maxLen: 100,
      totalCount: 0,
      error: null
    }
  },
  computed: {
    isEmpty(){
      return this.$store.state.sysApps.sysMap.sys_app_recycle_bin.isEmpty
    },
    recycleBinEvent(){
      return this.$store.state.recycleBinEvent
    },
    isError(){
      return !this.list && this.error
    }
  },
  watch: {
    recycleBinEvent(){
      this.getData();
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
    restore(item){
      this.request({
        url: '~/recycleBin/restore',
        data: {
          id: item.id,
          sourcePath: item.source.path
        },
        type: 'post',
        success(){

          this.removeItem(item);

          let address = item.source.dir;
          this.$store.commit('fsPublicEmit', {
            type: 'restore',
            address,
            // item: item.source
          });
        }
      })
    },
    removeItem(item){
      return this.getData();
      const i = this.list.findIndex(v => v === item);
      this.list.splice(i, 1);
    },
    del(item){

      if(!confirm('Are you sure to delete "' + item.source.name + '" thoroughly?')){
        return;
      }
      this.request({
        url: '~/recycleBin/' + item.id,
        type: 'delete',
        success(){
          this.removeItem(item);
        }
      })
    },
    clearAll(){
      if(!confirm('Are you sure to delete All?')){
        return;
      }
      this.request({
        url: '~/recycleBin',
        type: 'delete',
        stateKey: 'isRequest',
        success(){
          this.list = [];
          this.error = null;
        },
        error(xhr){
          this.error = xhr.responseText;
        }
      })
    },
    getData(){
      this.request({
        url: '~/recycleBin',
        stateKey: 'isRequest',
        success(stdout){
          const result = lsParse(stdout);
          this.totalCount = result.length;

          let parsedResult = recycleParse(result);
          this.list = parsedResult.list;

          this.error = null;
        },
        error(xhr){
          this.error = xhr.responseText;
        }
      })
    }
  },

  created(){
    this.getData();
  }
}
</script>
