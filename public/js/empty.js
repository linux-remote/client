window.MyComponent = window.Vue.extend({
  template: '<h1>Hello World!</h1>',
  mounted(){
    console.log('request', this.request)
  }
})