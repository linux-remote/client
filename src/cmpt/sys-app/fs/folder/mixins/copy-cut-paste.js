import {getNewName} from '../util';
import {encodePath} from '__ROOT__/cmpt/sys-app/util';
export default  {
  methods: {
    copy() {
      this._cutAndCopy('copy');
    },
    cut() {
      this._cutAndCopy('cut');
    },

    paste(){
      const {type, files, address} = this.fsClipBoard;
      if(!files.length || !address){
        return;
      }
      let _files = [];
      files.forEach(v => {
        _files.push(v.name);
      });
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
                srcFile: _files[0],
                destFile: newFileName
              },
              success(){
                this.$options._shouldFocusItemName = newFileName;
                this.$store.commit('fsPublicEmit', {
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
            files: _files
          },
          success(){
            this.shouldActiveNewItems(_files);
            this.$store.commit('fsPublicEmit', {
              type: type + '_in',
              address: this.address,
              files: _files
            });


            if(type === 'cut'){
              this.$nextTick(() => {
                this.$store.commit('fsPublicEmit', {
                  type: type + '_out',
                  address,
                  files: _files
                });
              });

              this.$store.commit('fsClipBoard/clear');

            }
          }
        });
      }
      return;

    },

    _cutAndCopy(type){
      if(!this.$options._selectedItems.size){
        return;
      }
      const files = [];
      this.$options._selectedItems.forEach(v => {
        files.push(v);
      });
      this.$store.commit('fsClipBoard/set', {
        type,
        address: this.address,
        files
      });
    },
  }

}