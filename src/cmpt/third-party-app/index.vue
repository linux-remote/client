<template lang="jade">
.lr-window-body
  div(v-if='isRequest') loading main file...
  h2(v-else-if='error', style='color:red') Error: {{error}}
</template>

<script>
//import {wrap} from './util';

const map = Object.create(null);

export default {
  props: ['task'],
  data(){
    return {
      isRequest: false,
      error: null
    }
  },
  methods:{
    // getMain(callback){
    //   const id = this.app.id + '_main';
    //   var script = document.getElementById(id);
    //   if(!script){
    //     script = document.createElement('script');
    //     script.src = this.app.main;
    //     script.id = id;
    //     document.body.appendChild(script);
    //     script.onload  = function(){
    //       callback(null, window.MyComponent);
    //     }
    //     script.onerror  = function(event){
    //       document.body.removeChild(script);
    //       callback(event);
    //     }
    //   }else {
    //     callback(null, window.MyComponent);
    //   }
    // },
    getMain(){
      
      const task = this.task;
      const appId = task.appId;

      if(!map[appId]){
        map[appId] = true;

        this.request({
          url: task.APP.main,
          stateKey: 'isRequest',
          contentType: 'text/plain',
          success(code){
            const fn = new Function('return ' + code);
            const Cmpt = fn();
            if(typeof Cmpt !== 'function'){
              this.error = 'App Main must return a Vue constructor!';
              delete(map[appId]);
            }else{
              map[appId] = Cmpt;
              this.getMain();
            }
          },
          error(){
            this.error = 'loading App Main fail!';
            delete(map[appId]);
          }
        })
        
      }else{
        if(map[appId] === true){
          return;
        }else{
          new map[appId]({el: this.$el});
        }
      } 

    }
  },
  mounted(){
    this.getMain();
  }
}
</script>
