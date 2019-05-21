import lsParse from '../../../lib/ls-parse';
import {initIconAttr} from '../util';

export default  {
  computed: {
    publicEvent(){
      return this.$store.state.fsPublicEvent
    }
  },
  watch: {
    publicEvent(e){
      if(e.address === this.address){
        let methodKey = 'on_public_' + e.type;
        if(this[methodKey]){
          this[methodKey](e);
        } else {
          console.warn('un handle fs event: ' + methodKey);
        }
      }
    }
  },
  methods: {
    on_public_add(){

      // if(e.item){
      //   let item = lsParse(e.item);
      //   this.wrapItem(e.item);
      //   this.reSortByItem(e.item, true);
      // } else {
      //   this.getData();
      // }
      this.getData();
    },
    on_public_rename({newName, oldName}){
      // type, address, oldName, newName
      let item = this.list.find(v => v.name === oldName);
      if(item){
        item.name = newName;
        if(!item.isFolder){
          initIconAttr(item);
        }
        // this.reSortByItem(item);
      }
    },
    // on_public_update(e){
    //   if(e.item.focus === undefined){
    //     this.wrapItem(e.item);
    //   }
    //   var thisItem = this.list.find((v) => v.name === e.item.name);
    //   if(thisItem){
    //     Object.assign(thisItem, e.item)
    //   }
    // },
    on_public_del(){
      this.getData();
    },
    on_public_cut_in(){
      this.getData();
    },
    on_public_cut_out(){
      this.getData();
    },
    on_public_copy_in(){
      this.getData();
    },
    // on_public_copy_out(){
    //   this.getData();
    // },
    on_public_restore(){
      this.getData();
    },
    on_public_getList(e) {
      if(this.shouldSelectItemNames){
        this.clearSelected();
      }
      const data = lsParse(e.data);
      const result = this.getFormatedListAndDir(data);
      this.dir = result.dir;
      this.error = null;
      this.list = result.list;
      // this.sort(result.list);
      // this.concat(result.list);
      if(this.shouldSelectItemNames){
        this.shouldSelectItemNames = null;
      }
    }
  }

}