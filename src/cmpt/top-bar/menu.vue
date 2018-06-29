<template lang="jade">
DropMenu(ref='drop')
  .lr-icon.lr-menu
  div(slot='menu')

    Cascade.lr-ctx-item 
      span(style='color:#666') {{LANG.loginPage.langTitle}}: 
      span {{language.list[currLangIndex].name}}
      span >
      div(slot='menu')
        .lr-ctx-item(v-for='(v, i) in language.list',
                    :value='i',
                    :key='v.id', class='lr_lang_item', 
                    :class='{lr_lang_active: currLangIndex === i}',
                    @click='changeLANG(i)')  {{v.name}}
    hr
    .lr-ctx-item
      a(href='https://github.com/linux-remote/linux-remote/blob/master/README.md#donate', target='_blank') {{LANG.global.donate}}

</template>

<script>

import DropMenu from './drop-menu.vue';
import Cascade from '__ROOT__/cmpt/global/cascade.vue';
export default {
  components:{
    DropMenu,
    Cascade
  },
  data(){
    return {
      currLangIndex: this.$store.state.language.currIndex
    }
  },
  computed: {
    language(){
      return this.$store.state.language;
    },
    LANG(){
      return this.$store.getters['language/currLanguage'];
    }
  },
  methods: {
    changeLANG(index){
      this.currLangIndex = index;
      this.$store.commit('language/set', this.currLangIndex);
      this.$refs.drop.showDrop = false;
      //location.reload(false);
    }
  }

}
</script>
