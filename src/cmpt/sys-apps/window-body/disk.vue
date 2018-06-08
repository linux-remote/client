<style>
.lr-disk-wrap{
  display: flex;
  justify-content: space-between;
  margin-top: 200px;
}
.lr-disk-item{

  flex-shrink: 0;
  margin-right: 20px;
  display: flex;
}
.lr-disk-icon{
  width: 50px;
  height: 50px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 10px;
}
.lr-disk-cd{
  background-image: url('/public/img/drive-optical-6.png');
}
.lr-disk-hd{
  background-image: url('/public/img/drive-harddisk-9.png');
}
.lr-disk-item-right{
  width: 220px;
}
.lr-disk-process-wrap{
  height: 18px;
  background-color: #eee;
  border: 1px solid #ddd;
  width: 100%;
  margin-bottom: 5px;
}
.lr-disk-process{
  height: 100%;
  background-color: green;
}
.lr-disk-info{
  font-size: 13px;
  color: #666;
}
</style>
<template lang="jade">
.lr-window-body
  .lr-disk-wrap
    .lr-disk-item(v-for='(v, i) in list', :key='i')
      .lr-disk-icon(:class='"lr-disk-" + v.type')
      .lr-disk-item-right
        div {{v.target}}
        .lr-disk-process-wrap
          .lr-disk-process(:style='{width: v.percent + "%"}')
          .lr-disk-info  {{(v.size - v.used)  | wellSize('K')}} 可用 共 {{v.size | wellSize('K')}} 
</template>

<script>
///dev/sr0
function parseHeadBody({head, body}, ite){
  return body.map(line => {
    const obj = {};
    line.forEach((v, i) => {
      obj[head[i]] = v;
    })
    ite(obj);
    return obj;
  })
}
export default {
  data(){
    return {
      isRequest: false,
      list: []
    }
  },


  methods: {
    getData(){
      this.request({
        url: '~/disk',
        success(data){
          this.list = parseHeadBody(data, function(obj){
            if(obj.source === '/dev/sr0'){
              obj.type = 'cd'
            }else {
              obj.type = 'hd'
            }
            obj.percent = (obj.used / obj.size) * 100;
          })
        } 
      })
    }
  },
  created(){
    this.getData()
  }
}
</script>
