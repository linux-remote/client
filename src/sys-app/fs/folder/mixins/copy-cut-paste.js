import {getNewName} from '../util';
import {encodePath} from '__ROOT__/sys-app/util';
export default  {
  methods: {
    copy() {
      this._cutAndCopy('copy');
    },
    cut() {
      this._cutAndCopy('cut');
    },

    paste(){
      const {type, files, address, filenames} = this.fsClipBoard;
      if(!files.length || !address){
        return;
      }
      let _files = [];
      let fileIndex = 0, fileLen = filenames.length;
      for(; fileIndex < fileLen; fileIndex ++){
        let v = files[fileIndex];
        let filename = filenames[fileIndex];
        if(v.name !== filename){
          return this.$store.commit('error/show', `Paste error: ${filename} has renamed`); // win 10是 : 只认名字.
        }
        _files.push(filename);

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
                srcFile: _files[0],
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
            files: _files
          },
          success(){
            this.shouldActiveNewItems(_files);
            this.publicEmit({
              type: type + '_in',
              address: this.address,
              files: _files
            });


            if(type === 'cut'){
              this.$nextTick(() => {
                this.publicEmit({
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
      const files = [], filenames = [];
      this.$options._selectedItems.forEach(v => {
        files.push(v);
        filenames.push(v.name);
      });
      this.$store.commit('fsClipBoard/set', {
        type,
        address: this.address,
        files,
        filenames
      });
    },
  }

}