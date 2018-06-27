<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')

  .lr-fs-folder-inner
    .lr-fs-ctrl-bar(style='justify-content: space-between;')
      button(@click='clearAll', :disabled='isEmpty') Delete All

      .lr-fs-nav-item.lr-fs-nav-reload(@click='getData', style='background-color: #666')
    h2(v-html='error' style='color:red' v-if='error')
    h2(v-else-if='data.length === 0' style='color:gray') Empty
    .lr-fs-folder(v-else)
      table.lr-info-table.lr-table(style='width:100%;')
        tr
          th name
          th sourceDir
          th deleteTime
          th
        tr(v-for='(item,i) in data' , :key='item.id', 
        :class='{lrRecycleBinCovered: item.isCover, lrRecycleBinError: item.isError}')
          td {{item.isError ? item.id : item.source.name}}
          td {{item.sourceDir}}
          td {{item.delTime}}
          td(style='display:flex')
            div(v-if='!item.isError')
              span(v-if='item.isCover') Covered
              button(@click='recycle(item)', v-else) Restore
            button(@click='del(item)') Delete
</template>

<script>
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
      return this.$store.state.app.sysMap.sys_app_recycle_bin.isEmpty
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
      this.$store.commit('app/changeRecycleBinIcon', isEmpty);
    }
  },

  methods: {
    recycle(item, i){
      this.request({
        url: '~/recycleBin/recycle',
        data: item,
        type: 'post',
        success(){

          this.removeItem(item);

          let address = item.sourceDir
          delete(item.delTime);
          delete(item.isCover);
          delete(item.sourceDir);
          item.source.name = item.name;
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
      let name = item.delTime;
      if(!item.isError && !confirm('Are you sure to delete "' + item.source.name + '" ?')){
        return;
      }
      this.request({
        url: '~/recycleBin/' + name,
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
        success(data){
          this.data = this.parseData(data);
          this.error = null;
        },
        error(xhr){
          this.error = xhr.responseText;
        }
      })
    },
    parseData(data){
      data.forEach(v => {
        v.isError = false;
        if(v.name && v.source){
          v.source.name = v.name;
        } else {
          v.isError = true;
        }
        delete(v.name);
      })
      return data;
    }
  },

  created(){
    this.getData()
  }
}
</script>
