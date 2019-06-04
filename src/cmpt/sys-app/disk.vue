<template lang="jade">
.lr-fs-right
  ContextMenu(ref='ctx')
    .lr-ctx-item(@click='reload') {{LANG.ctx.Refresh}}
  .lr-hourglass(v-if='isRequest')
  fieldset(v-for='field in map', v-if='field.list.length')
    legend {{field.title}}
    .lr-fieldset-body
      .lr-disk-item(v-for='(v, i) in field.list', :key='i', :title='v.source')
        .lr-disk-left
          .lr-disk-icon(:class='"lr-disk-" + v.type')
          .lr-disk-type {{v.fstype}} 
        .lr-disk-item-right
          .lr-disk-link(@click='go(v.target)') {{v.target}}
          .lr-disk-process-wrap
            .lr-disk-process(:style='{width: v.percent + "%"}')
          .lr-disk-i-process-wrap(:title='"inode usage rate: " + v.ipercent + "%"')
            .lr-disk-i-process(:style='{width: v.ipercent + "%"}')
          .lr-disk-info
            | {{(v.size - v.used)  | wellSize('K')}} {{LANG.freeAndTotal}} {{v.size | wellSize('K')}} 
</template>

<script>
import ContextMenu from '__ROOT__/cmpt/global/contextmenu/index.vue';
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
  components: {
    ContextMenu
  },
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
    // go(){
    //   return this.$parent.$refs.navBar.go
    // },
    LANG(){
      return this.$store.getters['language/currLanguage'].sys_app_disk
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
    go(address){
      this.$store.commit('task/add', {
        appId: 'sys_app_fs',
        address
      })
    },
    reload(){
      this.getData();
      this.$refs.ctx.hidden();
    },
    getData(){
      this.request({
        url: '~/disk',
        stateKey: 'isRequest',
        success(data){
          let hdArr = [], memoryArr = [], cdArr = [], unknownArr = [];
          parseHeadBody(data, function(obj){
            obj.available = obj.size - obj.used;
            obj.percent = (obj.used / obj.size) * 100;
            obj.iavailable = obj.itotal - obj.iused;
            obj.ipercent = trimEnd0(((obj.iused / obj.itotal) * 100).toFixed(2));
            var source = obj.source;
            if(source.indexOf('/dev/sr') === 0){
              obj.type = 'cd';
              cdArr.push(obj);
            }else {
              if(obj.fstype === 'tmpfs' || obj.fstype === 'devtmpfs'){
                obj.type = 'memory'
                memoryArr.push(obj);
              }else {
                if(source.indexOf('/dev/sd') === 0 || 
                source.indexOf('/dev/vda') === 0 ||
                obj.fstype === 'vboxsf'){// vda RAID, http://www.webhostingtalk.com/showthread.php?t=1266066
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
