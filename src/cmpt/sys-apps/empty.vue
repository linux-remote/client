<template lang="jade">
.lr-window-body
</template>
<script>
export default {
  props: ['task'],
  data(){
    return {}
  },
  mounted(){
    this.getCmpt((err, Cmpt) => {
      new Cmpt({el: this.$el});
    })
  },
  methods: {
    handleClick(){
    },
    getCmpt(callback){

      var script = document.getElementById('lr-app-empty');
      
      if(!script){
        script = document.createElement('script');
        script.src = '/public/js/empty.js';
        script.id = 'lr-app-empty';
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
      // window.$.getScript('/public/js/empty.js',{cache: true}, function(){
      //   console.log('window.MyComponent', window.MyComponent)
      // })
    }
  }
}
</script>
