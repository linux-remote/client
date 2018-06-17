<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')

  .lr-fs-folder-inner
    .lr-fs-ctrl-bar(style='justify-content: space-between;')
      button(@click='clearAll') Delete All

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
        tr(v-for='item in data' , :class='{lrDustbinCovered: item.isCover}')
          td {{item.name}}
          td {{item.sourceDir}}
          td {{item.delTime | timeFormat}}
          td
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
    onFsDel(){
      return this.$store.state.onFsDel
    },
    isError(){
      return !this.data && this.error
    }
  },
  watch: {
    onFsDel(){
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
    recycle(item){
      this.request({
        url: '~/recycleBin/recycle',
        data: item,
        type: 'post',
        success(){
          //this.$store.commit('onDustbinRecycle')
          this.getData();
        }
      })
    },
    del(item){
      let name = item.delTime;
      this.request({
        url: '~/recycleBin/' + name,
        type: 'delete',
        success(){
          this.getData();
        }
      })
    },
    clearAll(){
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
          this.data = data;
          this.error = null;
        },
        error(xhr){
          this.error = xhr.responseText;
        }
      })
    }
  },

  created(){
    this.getData()
  }
}
</script>
