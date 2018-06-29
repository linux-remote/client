<template lang="jade">
.lr-quick-bar(@dragenter='handleDragenter',
              @dragover='handleDragover',
              @drop='handleDrop')
  Item(v-for="(v,i) in list",
      :item="v",
      :index='i',
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
      _isCanDrop: true
    }
  },
  computed: {
    list(){
      return this.$store.state.quickBarItems
    },
    LANG(){
      return this.$store.getters['language/currLanguage'].global
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
        id: data.id
      })
      this.save();
    },
    save(){
      this.request({
        url: '~/desktop/quickBar',
        type: 'post',
        data: {
          data: JSON.stringify(this.list)
        },
        success(){
          console.log('save quickBar ok');
        }
      })
    }
  }
}
</script>
