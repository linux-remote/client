<style>
.lr-quick-bar{
  border-right: 1px solid #d1d1d1;
  min-width: 200px;
  max-width: 300px;
  display: flex;

}
.lr-quick-bar-item{
  width: 40px;
  margin-right: 10px;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-right: 1px solid #888;
}
.lr-quick-bar-item:hover{
  background-color: #000;
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
    handleDragenter(e){
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
    handleDrop(e){
      var data = this.$store.state.dragTransferData;
      this.list.push({
        id: data.id,
        type: data.type
      })
      this.save();
    },
    save(){
      this.request({
        url: '~/quickBar',
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
      url: '~/quickBar',
      success(result){
        this.list = JSON.parse(result);
      }
    })
  }
}
</script>
