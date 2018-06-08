<style>
.lr-fieldset-body{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
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
.lr-disk-memory{
  background-image: url('/public/img/memory-ram.png');
}
.lr-disk-item-right{
  width: 220px;
}
.lr-disk-process-wrap{
  height: 18px;
  background-color: #eee;
  border: 1px solid #ddd;
  width: 100%;
  position: relative;
}
.lr-disk-process{
  height: 100%;
  background-color: #00CED1;
}
.lr-disk-type{
  font-weight: bold;
  color:#333;
}
/* .lr-disk-i-process-wrap{
  width: 100%;
  margin-bottom: 5px;
  background-color: bisque;
  border: 1px solid #ddd;
  border-radius: 2px;
  height: 5px;
} */
.lr-disk-i-process{
  position: absolute;
  height: 3px;
  background-color: #006400;
  z-index: 2;
  top: 100%;
  left: 0;
}
.lr-disk-i-process:hover{
  background-color: #1E90FF
}
.lr-disk-info{
  font-size: 13px;
  color: #666;
}
.lr-disk-wrap{
  display: flex;
  height: 100%;
}

</style>
<template lang="jade">
.lr-disk-wrap
  .lr-fs-left
    .lr-fs-bookmark  此电脑
    .lr-fs-bookmark  /
    .lr-fs-bookmark Home

    hr
    .lr-fs-bookmark  /
  .lr-fs-right
    fieldset(v-for='field in map', v-if='field.list.length')
      legend {{field.title}}
      .lr-fieldset-body
        .lr-disk-item(v-for='(v, i) in field.list', :key='i')
          .lr-disk-icon(:class='"lr-disk-" + v.type')
          .lr-disk-item-right
            div {{v.target}}
            .lr-disk-process-wrap
              .lr-disk-process(:style='{width: v.percent + "%"}')
              .lr-disk-i-process(:style='{width: v.ipercent + "%"}', :title='"inode " + v.ipercent + "%"')
            .lr-disk-info  
              span.lr-disk-type {{v.fstype}} 
              | {{(v.size - v.used)  | wellSize('K')}} 可用 共 {{v.size | wellSize('K')}} 
</template>

<script>
///dev/sr0
function parseHeadBody({head, body}, ite){
  return body.map((line, j) => {
    const obj = {};
    line.forEach((v, i) => {
      obj[head[i]] = v;
    })
    ite(obj, j);
    return obj;
  })
}
export default {
  data(){
    return {
      isRequest: false,
      map: {
        hd: {
          title: 'hd',
          list: []
        },
        cd: {
          title: 'cd',
          list: []
        },
        memory: {
          title: 'memory',
          list: []
        }
      }
    }
  },


  methods: {
    getData(){
      this.request({
        url: '~/disk',
        success(data){
          let hdArr = [], memoryArr = [], cdArr = [];
          parseHeadBody(data, function(obj, i){

            obj.available = obj.size - obj.used;
            obj.percent = (obj.used / obj.size) * 100;
            obj.iavailable = obj.itotal - obj.iused;
            obj.ipercent = (obj.iused / obj.itotal) * 100;
            if(obj.source === '/dev/sr0'){
              obj.type = 'cd'
              cdArr.push(obj);
            }else {
              if(obj.fstype === 'tmpfs' || obj.fstype === 'devtmpfs'){
                obj.type = 'memory'
                memoryArr.push(obj);
              }else {
                obj.type = 'hd'
                hdArr.push(obj)
              }
            }
          });
          this.map.hd.list = hdArr;
          this.map.cd.list = cdArr;
          this.map.memory.list = memoryArr;
        } 
      })
    }
  },
  created(){
    this.getData()
  }
}
</script>
