import {getNewName} from '../util';
import {encodePath} from '__ROOT__/sys-app/util';
export default  {
  data() {
    return {
      cutMap: Object.create(null)
    }
  },
  computed: {
    fsClipBoard() {
      return this.$store.state.fsClipBoard;
    }
  },
  methods: {
    cut() {
      
      const selectedArr = Object.keys(this.selectedMap);
      if(!selectedArr.length){
        return;
      }
      _clearCutMap(this.cutMap);
      selectedArr.forEach(name => {
        this.$set(this.cutMap, name, true);
      });
      
      this.$store.commit('fsClipBoard/setCut', {
        address: this.address,
        files: selectedArr,
        cutMap: this.cutMap
      });
    },
    copy() {
      const selectedArr = Object.keys(this.selectedMap);
      if(!selectedArr.length){
        return;
      }
      this.$store.commit('fsClipBoard/setCopy', {
        address: this.address,
        files: selectedArr
      })
    },

    paste(){
      const clip = this.fsClipBoard;
      if(clip.cutMap){
        console.log('cut');
      }
      
      const {type, files, address} = this.fsClipBoard;
      if(!files.length || !address){
        return;
      }

      if(address === this.address){
        if(type === 'copy'){
          if(files.length === 1){
            const newFileName = getNewName(this.list, files[0]);
            this.request({
              url: '~/fs/' + encodePath(address),
              type: 'post',
              data: {
                type: 'copy',
                isCopyOneOnSameDir: true,
                srcFile: files[0],
                destFile: newFileName
              },
              success(){
                this.shouldActiveNewItems([newFileName]);
                this.publicEmit({
                  type: 'copy_in',
                  address: this.address,
                  files: [newFileName]
                });
              }
            })
          } else {
            this.$store.commit('error/show', 
              `Can't copy many files on same dir.`);
          }

        } else if(type === 'cut') {
            this.$store.commit('error/show', 
              `Cut and paste is same file.`);
        }
      } else {

        this.request({
          url: '~/fs/' + encodePath(this.address),
          type: 'post',
          data: {
            type,
            srcDir: address,
            files: files
          },
          success(){
            this.shouldActiveNewItems(files);
            this.publicEmit({
              type: type + '_in',
              address: this.address,
              files: files
            });


            if(type === 'cut'){
              this.$nextTick(() => {
                this.publicEmit({
                  type: type + '_out',
                  address,
                  files: files
                });
              });

              this.$store.commit('fsClipBoard/clear');

            }
          }
        });
      }
      return;

    },

    // _cutAndCopy(type){
    //   const selectedArr = Object.keys(this.selectedMap);
  
    //   if(!selectedArr.length){
    //     return;
    //   }

    //   const files = [], filename$s = [];
    //   selectedArr.forEach(name => {
    //     files.push(this.selectedMap[name]);
    //     filename$s.push(name);
    //     if(type === 'cut'){
    //       this.$set(this.cutMap, name, true);
    //     }
    //   });

    //   this.$store.commit('fsClipBoard/set', {
    //     type,
    //     address: this.address,
    //     files,
    //     filename$s
    //   });
    // },
  }

}

function _clearCutMap(map){
  if(map){
    for(let i in map){
      window.Vue.delete(map, i);
    }
  }
}