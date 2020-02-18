<template lang="jade">
.lr-table(@scroll="handleScroll")
  div
    .lr-table-head(ref="head")
      .lr-table-h(v-for="v in thead", :style="{width: v.width + 'px'}")
        .lr-table-h-inner(@click="sortBy(v.name)") {{v.name}}
          .lr-table-sort(v-if="v.name === currSortKey", :class="{lr__def: sortDef}")
        Resizeable(direction="r", :proxy="v", :minWidth="v.minWidth", :maxWidth="v.maxWidth")

      //- .lr-table-h
    div(ref="table")
      .lr-table-tr(v-for="(v,i) in tbody",  @mousedown="handleTrMousedown(v)", :class="{lr__focus: v === focusItem}")
        .lr-table-td(:style="{width: thead[0].width + 'px'}") {{v.name}}
        .lr-table-td(:style="{width: thead[1].width + 'px'}") {{v.size}}
      //- table
      //-   thead
      //-     tr
      //-       th(v-for="v in thead", :style="{minWidth: v.width + 'px', width: v.width + 'px'}")
      //-   tbody
      //-     tr(v-for="v in tbody", @click="handleTrClick(v)", :class="{lr__focus: v === focusItem}")
      //-       td {{v.name}}
      //-       td {{v.size}}
</template>
<script>
import Resizeable from '../../unit/resizable.vue';

export default {
  components: {
    Resizeable
  },
  data(){
    let tbody = [];
    for(let i = 0; i < 100; i++){
      tbody.push({
        name: 'hello' + i,
        size: i + '2kb'
      })
    }
    return {
      focusItem: null,
      currSortKey: 'name',
      sortDef: true,
      thead: [{
        name: 'name',
        minWidth: 0,
        width: 300
      },
      {
        name: 'size',
        minWidth: 0,
        width: 200
      }],
      tbody
    }
  },
  methods: {
    sortBy(key){
      if(this.currSortKey === key){
        this.sortDef = !this.sortDef;
      }
    },
    handleTrMousedown(v){
      this.focusItem = v;
    },
    handleScroll(e){
      if(this.$options._scrollTop !== e.target.scrollTop){
        this.$options._scrollTop = e.target.scrollTop;
        this.$refs.head.style.top = e.target.scrollTop + 'px';
        // console.log('scrollY')
      }
    },
    // eqWidth(){
    //   console.log(this.$refs.table.clientWidth)
    //   // this.$refs.head.style.width = this.$refs.table.clientWidth + 'px';
    // }
  },
  mounted(){
    this.$options._scrollTop = this.$el.scrollTop;
  }
}
</script>