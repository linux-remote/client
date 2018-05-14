<style>
.lr-error{
  position: absolute; 
  width: 100%; 
  margin: 0 auto; 
  top: 50px;
  z-index: $topZindex + 1;
  left: 0;
  right:0;
  box-shadow: 3px 3px 3px 3px #eee;
}
.lr-error-item{
  text-align: center;
  padding: 10px;
  color:red;
  margin-bottom: 5px;
}
.lr-error-title{
  background-color: red;
  width: 100%;
  color:#fff;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
<template lang="jade">
.lr-error(@mousedown='noopStop')
  .lr-error-title 
    b 错误

  .lr-error-item(v-for='v in message' v-html='v')

</template>

<script>
import store from '__ROOT__/store/error';
export default {
  data(){
    return store.state
  }
}
</script>
