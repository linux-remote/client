<template lang="jade">
.lr-page
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
</template>
<script>
import store from '../store-global';
export default {
  data(){
    return {
      isRequest: false,
      key:'',
      isClick: false
    }
  },
  computed: {
    CACertPath(){
      return store.state.CACertPath
    }
  },
  methods:{
    download(){
      this.request({
        url: '/verifyDownloadCACert',
        type: 'post',
        data: {
          key: this.key
        },
        success(url){
          this.request.download(url);
          this.isClick = true;
          const loop = ()=>{
            setTimeout(() => {
              this.apiGet('/getDownloadCACertStatus', data =>{
                if(data === 0){
                  loop();
                }else{
                  store.commit('set', {CADownloadedCount: data});
                }
              })
            }, 1000)
          }
          loop();
        }
      })
    }
  }
}
</script>
