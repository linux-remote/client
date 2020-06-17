<template lang="jade">
.lr-window_body.lr-users_wrap
  h1 Hello World!
  .lr-btn(@click="add") add
</template>
<script>
import UserAdd from './useradd.vue';
export default {
  props: ['task'],
  components: {
    UserAdd
  },
  methods: {
    add(){
      this.$parent.openBlock({
        title: 'Useradd',
        cmpt: UserAdd,
        width: 340,
        height: 170,
        propsData: {
          ok(res){
            console.log(res.data);
            res.end(true)
          }
        }
      })
    }
  },
  mounted(){
  }
}
</script>
