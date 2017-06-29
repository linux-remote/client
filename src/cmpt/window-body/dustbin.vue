<template lang="jade">
.lr-window-body
  .lr-hourglass(v-show='isRequest')
  h2(v-html='error' style='color:red' v-if='!data')
  .lr-dustbin-wrap
    .lr-fs-bar
      button(@click='clearAll') Clear All
      button(@click='getData') Reload
    .lr-fs-body
      table.lr-table(style='width:100%;')
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
            button(@click='del(item)') Delete
    //.lr-dustbin-item(v-for='item in data') {{item.name}}

</template>

<script>
import store from '__ROOT__/store-global';
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
  computed: {
    isError(){
      return !this.data && this.error
    }
  },
  methods: {
    recycle(item){
      //let name = item.delTime;
      this.request({
        url: '~/dustbin/recycle',
        data: item,
        type: 'post',
        success(){
          this.getData();
        }
      })
    },
    del(item){
      let name = item.delTime;
      this.request({
        url: '~/dustbin/' + name,
        type: 'delete',
        success(){
          this.getData();
        }
      })
    },
    timeFormat,
    clearAll(){
      this.request({
        url: '~/dustbin',
        type: 'delete',
        success(data){
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
        url: '~/dustbin',
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
