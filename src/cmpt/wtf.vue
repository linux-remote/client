<style module>
.warp{
  display: flex;
  align-items: center;
  text-align:center;
  justify-content: center;}
.box{
  width:600px;
}
</style>
<template lang="jade">
#app.linux-remote-app
  .dw-h100( :class="$style.warp" v-if='!CADownloadedCount')
    div(:class="$style.box")
      h3 你的CA证书是自生成的。
      h5 请输入你config文件里设置的：
      h4.text-info sslSelfSigned.CACertFirstDownloadKey
      input.form-control(v-model='key')
      button.btn.btn-default.btn-lg(style="margin-top:5px" v-bind:disabled="isClick" v-on:click="download")
        span.glyphicon.glyphicon-download-alt
        |下载CA证书
      hr
      p 这个页面只会在<b>第一次创建时出现</b>, 请保存好CA证书。
      p 你还可以用其它方法下载。该文件的服务器路径为：
      h4.bg-danger(style="font-size:1.3em;padding:5px"){{CACertPath}}
      p <b>导入到浏览器</b>后，你可能要重启浏览器，才能看到效果。
  router-view(v-else)
</template>
<script>
export default {
  data(){
    return {
      isRequest: false,
      CADownloadedCount: -1,
      CACertPath: '',
      key:'',
      isClick: false,
      loginedList: []
    }
  },
  methods:{
    download(){
      this.isClick = true;
      window.open(window.SERVER_CONFIG.API_ROOT + '/downloadCACert/' + this.key);
      //const self = this;
      const loop = ()=>{
        setTimeout(() => {
          this.getData(function(data){
            if(!data.CADownloadedCount){
              loop();
            }
          })
        }, 1000)
      }
      loop();
    },
    getData(callback){
      this.request({
        url: '/touch',
        success(data){
          console.log('data', data)
          Object.assign(this.$data, data);
          if(callback) callback(data);
        }
      })
    }
  },

  created(){
    this.getData();
  }
}
</script>