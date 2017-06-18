<template lang="jade">
.lr-window-body
    .lr-fs-bar
      .lr-3-item.glyphicon.glyphicon-arrow-left(@click='handleArrowLeftClick', :class='{lr_2_disabled:backStack.length === 0}')
      .lr-3-item.glyphicon.glyphicon-arrow-up(@click='handleArrowUpClick', :class='{lr_2_disabled:address === "/"}')
      .lr-3-item.glyphicon.glyphicon-arrow-right(@click='handleArrowRightClick', :class='{lr_2_disabled:goStack.length === 0}')
      input.lr-2-address(v-model='inputAddress' @keydown.13='handleGoClick')
      .lr-3-item.glyphicon.glyphicon-repeat(v-if='address===inputAddress' @click='getData')
      .lr-3-item.glyphicon.glyphicon-play(v-else @click='handleGoClick')
    .lr-fs-body(v-if='error')
      h2(v-html='data' style='color:red')
    .lr-fs-body(v-else)
      .lr-file(v-for='item in data', @click='handleItemClick(item)', :class='{lr_2_file_link: item.isSymbolicLink}')
        .lr-2-icon.glyphicon.glyphicon-file(v-if='!item.isDirectory')
        .lr-2-icon.glyphicon.glyphicon-folder-close(v-else-if='item.isDirectory')
        .lr-2-name {{item.name}}
</template>

<script>
import store from '__ROOT__/store-global';
export default {
  data(){
    const pData = this.$parent;
    // const address = pData.address || store.state.homedir;
    return {
      isRequest: false,
      inputAddress: null,
      // address: null,
      addressArr: ['/'],
      data: [],
      backStack: [],
      goStack: []
    }
  },
  watch: {
    address(v){
      this.inputAddress = v;
      this.getData();
    }
  },
  computed: {
    error(){
      return !Array.isArray(this.data);
    },
    address(){
      return '/' + this.addressArr.join('/');
    }
  },
  methods: {
    setAddress(path){
      const arr = path.split('/');
      const arr2 = [];
      arr.forEach(v => {
        if(v){
          arr2.push(v);
        }
      });
      this.addressArr = arr2;
      //this.address = '/' + arr2.join('/');
    },
    // setAddressByArr(){
    //   this.address = '/' + this.addressArr.join('/');
    // },
    handleArrowLeftClick(){
      if(!this.backStack.length) return;
      this.goStack.push(this.addressArr);
      const pop = this.backStack.pop();
      this.addressArr = pop;
    },
    handleArrowRightClick(){
      if(!this.goStack.length) return;
      const pop = this.goStack.pop();
      this.addressArr = pop;
    },
    handleGoClick(){
      //console.log('handleGoClick')
      this.setAddress(this.inputAddress);
    },
    handleArrowUpClick(){
      if(!this.address === '/') return;
      this.goStack = [];
      this.backStack.push(this.addressArr);
      const i = this.address.lastIndexOf('/');
      this.setAddress(this.address.substr(0, i));
    },
    handleItemClick(item){
      if(item.isDirectory){
        this.backStack.push(this.addressArr);
        this.setAddress(this.address + '/' + item.name);

        //this.address = this.address + '/' + item.name;
      }
    },
    getData(){
      this.request({
        url: '~/fs' + this.address,
        //poolKey: this.address,
        data: {dir: true},
        success(data){
          this.data = data;
        },
        error(xhr){
          this.data = `http ${xhr.status} 错误: <br>${xhr.responseText}`
        }
      })
    }
  },
  created(){
    const pData = this.$parent;
    const address = pData.address || store.state.homedir;
    this.setAddress(address);
  }
}
</script>
