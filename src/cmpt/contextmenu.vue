<template lang="jade">
.lr-contextmenu(v-show='data.length !== 0',  @click= 'handleClick', :style='{top:top + "px", left: left + "px"}')
  .lr-2-item(v-for='item in data',  @click='item.handleClick') {{item.name}}
</template>

<script>
import store from '__ROOT__/store/contextmenu';
export default {
  data(){
    return store.state;
  },
  methods:{
    handleClick(){
      store.commit('close');
    }
  }
}
</script>
