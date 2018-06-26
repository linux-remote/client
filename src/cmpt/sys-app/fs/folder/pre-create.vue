<template lang="jade">
.lr-name-wrap
  .lr-icon(:class='"lr_file_type_" + item.type')
  input(v-model='item.name', ref='input', :disabled='isRequest', @blur='handleblur', @keydown.13='handleEnter')
  div(style="width: 30px;height: 30px;", :class='{lr_loading:isRequest}')
</template>

<script>
import {encodePath} from './util'
export default {
  props: ['p'],
  data(){
    return {
      isRequest: false
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
    handleEnter(){
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
            this.p.preCreateItem = null;
            data.name = name;
            this.$store.commit('fsTrigger', {
              address: this.p.address,
              type: 'add',
              item: data
            })
          }
        })

    }
  },
  mounted(){
    this.$refs.input.focus();
  }

}

</script>
