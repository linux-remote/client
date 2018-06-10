<style>
.lr-fieldset-body{
  display: flex;
  justify-content: flex-start;
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
.lr-disk-left{
  width: 50px;
  margin-right: 10px;
  position: relative;
}
.lr-disk-type{
  font-size: 12px;
  text-align: center;
  color:#fff;
  position: absolute;
  top: 0;
  left: -10px;
  background-color: red;
  padding: 0 3px;

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
  color: #444;
}
.lr-disk-link{
  text-decoration: underline;
  color: blue;
  cursor: pointer;
  width: 100%;
}
.lr-disk-link:hover{
  color: green;
}
</style>
<template lang="jade">
.lr-fs-right
  fieldset(v-for='field in map', v-if='field.list.length')
    legend {{field.title}}
    .lr-fieldset-body
      .lr-disk-item(v-for='(v, i) in field.list', :key='i')
        .lr-disk-left
          .lr-disk-icon(:class='"lr-disk-" + v.type')
          .lr-disk-type {{v.fstype}} 
        .lr-disk-item-right
          .lr-disk-link(@click='go(v.target)') {{v.target}}
          .lr-disk-process-wrap
            .lr-disk-process(:style='{width: v.percent + "%"}')
            .lr-disk-i-process(:style='{width: v.ipercent + "%"}', :title='"inode 使用率 " + v.ipercent + "%"')
          .lr-disk-info
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
import {trimEnd0} from '__ROOT__/lib/util'
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
        },
        unknown: {
          title: 'unknown',
          list: []
        }
      }
    }
  },
  computed: {
    go(){
      return this.$parent.$refs.navBar.go
    },
    triggerContainSame(){
      return this.$parent.triggerContainSame
    }
  },
  watch: {
    triggerContainSame(){
      this.getData();
    }
  },
  methods: {
    getData(){
      this.request({
        url: '~/disk',
        success(data){
          let hdArr = [], memoryArr = [], cdArr = [], unknownArr = [];
          parseHeadBody(data, function(obj, i){

            obj.available = obj.size - obj.used;
            obj.percent = (obj.used / obj.size) * 100;
            obj.iavailable = obj.itotal - obj.iused;
            obj.ipercent = trimEnd0(((obj.iused / obj.itotal) * 100).toFixed(2));
            if(obj.source.indexOf('/dev/sr') === 0){
              obj.type = 'cd';
              cdArr.push(obj);
            }else {
              if(obj.fstype === 'tmpfs' || obj.fstype === 'devtmpfs'){
                obj.type = 'memory'
                memoryArr.push(obj);
              }else {
                if(obj.source.indexOf('/dev/sd') === 0 || obj.fstype === 'vboxsf'){
                  obj.type = 'hd';
                  hdArr.push(obj);
                }else {
                  obj.type = 'unknown';
                  unknownArr.push(obj);
                }

              }
            }
          });
          this.map.hd.list = hdArr;
          this.map.cd.list = cdArr;
          this.map.memory.list = memoryArr;
          this.map.unknown.list = unknownArr;
        } 
      })
    }
  },
  created(){
    this.getData()
  }
}
</script>
