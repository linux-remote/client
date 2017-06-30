<template lang="jade">
.lr-page.lr-ca-download-wrap
  .lr-ca-download
    h1(style='text-align:center') Your CA certificate is
      span(style="color: red")  Self-Signed
    p Please Enter your config's：
    h3(style="color:green") sslSelfSigned.CACertFirstDownloadKey
    .lr-ca-input-wrap
      input(v-model='key' style="height:28px; width: 300px;disabled:block;flex-grow:1" placeholder='Default is: abc')
      button(style="margin-left: 10px;" v-bind:disabled="isClick" @click="download") Download CA certificate
    br
    br
    div(style='font-size:14px')
      p This page only appear when you <b>first</b> created it. Please save the CA certificate.
      //- p This page only appear on The First , Please save the CA certificate.这个页面只会在<b>第一次创建时出现</b>, 请保存好CA证书。
      p You can also download it in other ways. The server path for this file is:
      p(style="color:violet"){{CACertPath}}
      br
      p After <b>import</b> it into the browser, You may need to restart your browser to see the effect.
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
