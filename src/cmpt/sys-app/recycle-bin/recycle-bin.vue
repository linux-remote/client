<template lang="jade">
.lr-window-body
  
  .lr-hourglass(v-show='isRequest')
  .lr-rb-ctrl-bar
    button.btn(@click='clearAll', :disabled='isEmpty') Delete All
    button.btn(@click='getData') Reload
  .lr-fs-folder-inner
    h2(v-text='error' style='color:red' v-if='error')
    h2(v-else-if='data.length === 0' style='color:gray') Empty
    .lr-fs-folder(v-else)
      table.table.lr-info-table.lr-table(style='width:100%;')
        tr
          th name
          th sourceDir
          th deleteTime
          th
        tr(v-for='(item,i) in data' , :key='item.id', 
        :class='{lrRecycleBinError: item.isError}')
          td {{item.isError ? item.id : item.source.name}}
          td {{item.sourceDir}}
          td {{item.delTime}}
          td(style='display:flex')
            div(v-if='!item.isError')
              button(@click='recycle(item)') Restore
            button(@click='del(item)') Delete
</template>

<script>
import lsParse from '../lib/ls-parse';
import recycleParse from './parse';
export default {
  data(){
    return {
      isRequest: false,
      data: [],
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
      return !this.data && this.error
    }
  },
  watch: {
    recycleBinEvent(){
      this.getData();
    },
    data(newVal, oldVal){
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
    recycle(item){
      this.request({
        url: '~/recycleBin/recycle',
        data: {
          id: item.id,
          sourceDir: item.sourceDir,
          name: item.source.name
        },
        type: 'post',
        success(){

          this.removeItem(item);

          let address = item.sourceDir;
          this.$store.commit('fsTrigger', {
            type: 'add',
            address,
            item: item.source
          });
        }
      })
    },
    removeItem(item){
      const i = this.data.findIndex(v => v === item);
      this.data.splice(i, 1);
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
          this.data = [];
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
          this.data = this.parseData(result);
          this.error = null;
        },
        error(xhr){
          this.error = xhr.responseText;
        }
      })
    },
    parseData(result){
      const data = recycleParse(result);
      const arr = [];
      data.forEach(v => {
        //  && v.id !== '..' // 后端已过滤
        if(v.id !== '.'){
          arr.push(v);
          v.isError = false;
          if(v.name && v.source){
            v.source.name = v.name;
          } else {
            v.isError = true;
          }
          delete(v.name);
        }
      })
      return arr;
    }
  },

  created(){
    this.getData();
  }
}
</script>
