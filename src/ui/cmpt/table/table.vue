<template lang="jade">
.lr-table
  .lr-table-head
    .lr-table-h(v-for="(v, index) in thead", :style="{width: v.width + 'px'}")
      .lr-table-h-inner(@click="sortBy(v)") {{v.name}}
        .lr-table-sort(v-if="v.sortKey === currSortKey", :class="{lr__def: sortDef}")
      Resizeable(direction="r", 
                @resizeStart="handleThReszieStart(v, $event)",
                @resizing="handleThResizing(v, $event)",
                @resized="handleThResized(index, $event)",
                :minWidth="v.minWidth",
                :maxWidth="v.maxWidth")
  .lr-table_body(ref="tbody")
    slot(:cols="widths")
</template>
<script>
import Resizeable from '../../unit/resizable.vue';

export default {
  components: {
    Resizeable
  },
  props: {
    thead: Array
  },
  data(){
    const widths = Object.create(null);
    this.thead.forEach((v, i) => {
      widths[i] = v.width;
    })
    return {
      currSortKey: null,
      widths,
    }
  },
  methods: {
    sortBy(th){
      if(!th.sortKey){
        return;
      }
      let isDesc;
      if(this.currSortKey === th.sortKey){
        isDesc = true;
      } else {
        this.currSortKey = th.sortKey;
        isDesc = false;
      }
      this.$emit('sortBy', {
        key: th.sortKey,
        isDesc
      });
    },
    handleThReszieStart(th, virtual){
      virtual.width = th.width;
    },
    handleThResizing(th, virtual){
      th.width = virtual.width;
    },
    handleThResized(index, virtual){
      this.widths[index] = virtual.width;
    },
    // handleScroll(e){
    //   if(this.$options._tmp_scroll_top !== e.target.scrollTop){
    //     this.$options._tmp_scroll_top = e.target.scrollTop;
    //     this.$refs.head.style.top = e.target.scrollTop + 'px';
    //   }
    // }
  },
  mounted(){
    // this.$options._tmp_scroll_top = this.$el.scrollTop;
  }
}
</script>