<template lang="jade">
.lr-name-wrap
  .lr-icon(:class='"lr_file_type_" + item.type')
  input(v-model='item.name', ref='input', :disabled='isRequest', @blur='handleblur', @keydown.stop.13='handleEnter')
  div(style="width: 30px;height: 30px;", class='lr_loading' v-if='isRequest')
  //-.lr-pre-create-ctrl(style="color:red;", v-else) &#10006;
  //-div(style='color:red;font-size: 12px;') {{error}}
</template>

<script>
import {encodePath} from './util'
export default {
  props: ['p'],
  data(){
    return {
      isRequest: false,
      error: null
    }
  },
  computed: {
    item(){
      return this.p.preCreateItem
    }
  },
  methods: {
    handleblur(){
      if(!this.item.name){
        this.p.preCreateItem = null;
        return;
      }
      this.submit();
    },
    handleEnter(e){
      e.stopPropagation();
      this.$refs.input.blur();
    },
    submit(){

        var {name, type} = this.item;
        type = (this.item.type === 'Directory') ? 'Folder' : 'File';
        this.request({
          type: 'POST',
          stateKey: 'isRequest',
          url: '~/fs/' + encodePath(this.p.address),
          data: {
            name,
            type: 'create' + type
          },
          success(data){
            data.name = name;
            this.$store.commit('fsTrigger', {
              address: this.p.address,
              type: 'add',
              item: data
            })
          },
          complete(){
            this.p.preCreateItem = null;
          }
          // ,
          // error(xhr){
          //   this.error = xhr.responseText;
          // }
        })

    }
  },
  mounted(){
    this.$refs.input.focus();
  }

}

</script>
