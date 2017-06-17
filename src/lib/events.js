const store = require('__ROOT/store-global');
const $ = window.$;
$(document).on('click', function(){
  store.commit('eventDocumentClick')
})
