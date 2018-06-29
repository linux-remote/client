<template lang="jade">
.lr-drop-menu-wrap
  .lr-drop-menu-btn(@click='show', :class='{lr_drop_menu_active:showDrop}')
    slot
  .lr-drop-menu(v-show='showDrop', @click='noopStop')
    slot(name='menu')
</template>

<script>

export default {

  data(){
    return {
      showDrop: false
    }
  },
  methods:{
    show(){
      if(this.showDrop) return;
      this.showDrop = true;
      setTimeout(()=>{
        document.addEventListener('click', () => {
          this.showDrop = false;
        }, {
          once: true
        });
      })
    }
  }
}
</script>
