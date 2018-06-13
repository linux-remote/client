<template lang="jade">
.lr-window-body
  div(v-if='isGetMain') loading main file...
  .lr-error(v-else-if='error') {{getMainError}}
</template>

<script>

export default {
  props: ['app'],
  data(){
    return {
      isGetMain: true,
      error: null
    }
  },
  methods:{

   getScript(callback){
      const id = this.app.id + '_main';
      var script = document.getElementById(id);
      if(!script){
        script = document.createElement('script');
        script.src = this.app.main;
        script.id = id;
        document.body.appendChild(script);
        script.onload  = function(){
          callback(null, window.MyComponent);
        }
        script.onerror  = function(event){
          document.body.removeChild(script);
          callback(event);
        }
      }else {
        callback(null, window.MyComponent);
      }
    }
  },
  mounted(){
    this.getScript((err, Cmpt) => {
      if(err){
        return this.error = '加载 App main 文件失败!'
      }

      console.log('Cmpt', Cmpt)

      this.isGetMain = false;
      new Cmpt({el: this.$el});
    });
  }
}
</script>
