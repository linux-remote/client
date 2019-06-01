<template lang="jade">
.lr-window-body.lr-rb-wrap
  
  .lr-hourglass(v-show='isRequest || isDeling')
  .lr-rb-ctrl-bar
    button.btn(@click='clearAll', :disabled='isEmpty') Delete All
    //- div(style="color: red") {{(totalCount / maxLen) * 100}} %

    button.btn(@click='getData') Reload
  
  h2(v-text='error' style='color:red' v-if='error')
  h2(v-else-if='list.length === 0' style='color:gray') Empty
  .lr-fs-folder-inner(v-else)
    table.lr-fs-table.lr_file_model_list
      tr
        th Name
        th Original Location
        th Date Deleted
        th Size
      RowItem(v-for='(item,i) in list' , :item='item', :key='item.id')
    div(style="height: 10px")  
</template>

<script>
import lsParse from '../lib/ls-parse';
import recycleParse from './parse';
import RowItem from './row-item.vue';
export default {
  components: {
    RowItem
  },
  data(){
    return {
      isRequest: false,
      isDeling: false,
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
          this.$store.commit('fs/publicEmit', {
            type: 'restore',
            address,
            // item: item.source
          });
        }
      })
    },
    removeItem(){
      return this.getData();
      // const i = this.list.findIndex(v => v === item);
      // this.list.splice(i, 1);
    },
    del(item){

      if(!confirm('Are you sure you want to permanently delete "' + item.source.name + '" ?')){
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
        stateKey: 'isDeling',
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
