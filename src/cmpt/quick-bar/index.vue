<style>
.lr-quick-bar{
  border-right: 1px solid #d1d1d1;
  min-width: 100px;
  max-width: 300px;
  display: flex;
}

</style>
<template lang="jade">
.lr-quick-bar(@dragenter='handleDragenter',
              @dragover='handleDragover',
              @drop='handleDrop')
  Item(v-for="v in list",
      :item="v",
      :key="v.id")

</template>

<script>
import Item from './item.vue';

export default {
  components: {
    Item
  },
  data(){
    return {
      list: [],
      _isCanDrop: true
    }
  },
  methods: {
    handleDragenter(){
      var data = this.$store.state.dragTransferData;
      var id = data.id;
      const isHave = this.list.find(function(v){
        return v.id === id;
      })
      this.$data._isCanDrop = isHave === undefined;
      
    },
    handleDragover(e){
      if(this.$data._isCanDrop){
        e.preventDefault();
      }
    },
    handleDrop(){
      var data = this.$store.state.dragTransferData;
      this.list.push({
        id: data.id,
        type: data.type
      })
      this.save();
    },
    save(){
      this.request({
        url: '~/quick_bar',
        type: 'post',
        data: {
          data: JSON.stringify(this.list)
        },
        success(){
          console.log('save quickBar ok');
        }
      })
    },
  },
  created(){
    this.request({
      url: '~/quick_bar',
      success(result){
        this.list = JSON.parse(result);
      }
    })
  }
}
</script>
