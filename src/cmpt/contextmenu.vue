<template lang="jade">
.lr-contextmenu(v-if='data.length !== 0', @click.stop= 'handleClick', :style='{top:top + "px", left: left + "px"}')
  .lr-2-item(v-for='item in data' @click='item.handleClick') {{item.name}}
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
      return false;
    }
  }
  // computed:{
  //   data(){
  //     return store.state.data;
  //   },
  //   top(){
  //     return store.state.top
  //   },
  //   left(){
  //     return store.state.left
  //   }
  // },
  // watch:{
  //   data(v){
  //     if(v.length){
  //       store.state.$el.appendChild(this.$el);
  //     }
  //   }
  // }
  // created(){
  //
  //   //this.$mount(store.state.$el)
  // }
}
</script>
