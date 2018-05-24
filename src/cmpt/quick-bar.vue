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
  .lr-quick-bar-item(v-for="v in list",
                    :key="v.id",
                    draggable="true",
                    :style="{backgroundImage: `url(${v.iconUrl})`}")

</template>

<script>


export default {
  data(){
    return {
      list: localStorage.quick_bar_list ? JSON.parse(localStorage.quick_bar_list) : [],
      _isCanDrop: true
    }
  },

  methods: {
    handleDragenter(e){
      var id = this.$store.state.currDragingId;
      console.log('handleDragenter-id', id)
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
      var id = this.$store.state.currDragingId;
      this.list.push({
            id,
            iconUrl: '/public/img/tango-style/user-trash.png'
      })
      localStorage.quick_bar_list = JSON.stringify(this.list);
      this.$store.commit('onDragEnd');
    }
  },
  mounted(){
    // window.dragula([this.$el]);
  }
}
</script>
