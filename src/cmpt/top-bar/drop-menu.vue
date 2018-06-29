<template lang="jade">
.lr-drop-menu-wrap
  .lr-drop-menu-btn(@click.stop='show', :class='{lr_drop_menu_active:showDrop}')
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
      if(!this.showDrop){
        document.addEventListener('click', this.handleDocClick, {
          once: true
        });
      }
      this.showDrop = !this.showDrop;
    },
    handleDocClick(){
      this.showDrop = false;
    },
    hidden(){
      this.showDrop = false;
      document.removeEventListener('click', this.handleDocClick, {
        once: true
      });
    }
  }
}
</script>
