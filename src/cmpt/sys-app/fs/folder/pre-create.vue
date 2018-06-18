<template lang="jade">
.lr-name-wrap
  .lr-icon(:class='"lr_file_type_" + item.type')
  input(v-model='item.name', ref='input', :disabled='isRequest', @blur='handleblur', @keydown.13='handleEnter')
  div(style="width: 30px;height: 30px;", :class='{lr_loading:isRequest}')
</template>

<script>

export default {
  data(){
    return {
      isRequest: false
    }
  },
  computed: {
    item(){
      return this.$parent.preCreateItem
    }
  },
  methods: {
    handleblur(){
      if(!this.item.name){
        this.$parent.preCreateItem = null;
        return;
      }
      this.submit();
    },
    handleEnter(){
      this.$refs.input.blur();
    },
    submit(){

        var {name, type} = this.item;
        type = (type === 'Directory') ? 'Folder' : 'File';
        this.isRequest = true;
        this.request({
          type: 'POST',
          url: '~/fs' + this.$parent.address,
          data: {
            name,
            type: 'create' + type
          },
          success(data){
            this.$parent.preCreateItem = null;
            this.$parent.getData();
            console.log('success', data);
          }
        })

    }
  },
  mounted(){
    this.$refs.input.focus();
  }

}

</script>
