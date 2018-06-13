<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  h2(v-html='error' style='color:red' v-if='!data')
  h2(v-else-if='data.length === 0' style='color:gray') Empty
  .lr-dustbin-wrap(v-else)
    .lr-fs-bar
      button(@click='clearAll') Clear All
      div(style='flex-grow:1')
      .lr-3-item.lr-3-reload(@click='getData')
    .lr-fs-folder
      table.lr-info-table.lr-table(style='width:100%;')
        tr
          th name
          th sourceDir
          th deleteTime
          th
        tr(v-for='item in data' , :class='{lrDustbinCovered: item.isCover}')
          td {{item.name}}
          td {{item.sourceDir}}
          td {{timeFormat(item.delTime)}}
          td
            span(v-if='item.isCover') Covered
            button(@click='recycle(item)', v-else) Recycle
            button(@click='del(item)') Clear
    //.lr-dustbin-item(v-for='item in data') {{item.name}}

</template>

<script>
import {timeFormat} from '__ROOT__/lib/util';
export default {
  //props: ['address'],
  data(){
    return {
      isRequest: false,
      data: null,
      error: null
    }
  },
  watch: {
    onFsDel(){
      this.getData();
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
  methods: {
    recycle(item){
      //let name = item.delTime;
      this.request({
        url: '~/recycle_bin/recycle',
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
        url: '~/recycle_bin/' + name,
        type: 'delete',
        success(){
          this.getData();
        }
      })
    },
    timeFormat,
    clearAll(){
      this.request({
        url: '~/recycle_bin',
        type: 'delete',
        stateKey: 'isRequest',
        success(){
          this.data = [];
        },
        error(xhr){
          this.data = null;
          this.error = xhr.responseText;
        }
      })
    },
    getData(){
      this.request({
        url: '~/recycle_bin',
        stateKey: 'isRequest',
        success(data){
          this.data = data;
        },
        error(xhr){
          this.data = null;
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
