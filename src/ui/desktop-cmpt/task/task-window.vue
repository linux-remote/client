<template lang="jade">
Window(:title="task.app.name",
       :icon="task.app.iconUrl",
       v-bind="task.app.window",
       :close="handleClose", ref="window")
  slot
</template>

<script>
import Window from '../window/window.vue';
export default {
  props: {
    task: {
      type: Object
    }
  },
  components: {
    Window
  },
  data(){
    return {
    }
  },
  computed:{

  },
  methods:{
    handleClose(e){
      this.$emit('close', e);
      if(e.preventDefaulted){
        return;
      }
      this.$store.commit('task/remove', this.task.id);
    }
  },
  mounted(){
    this.task.window = this.$refs.window;
  }

}
</script>
