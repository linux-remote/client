const DOC_TITLE = document.title;

export default {
  methods: {
    logout(){
      this.request({
        url: '/logout',
        type: 'post',
        data: {
          username: this.$route.params.username
        },
        success(){
          this.afterLogout();
        }
      })
    },
    afterLogout(){
      
      let route = '/';
      const storeData = {
        deskInited: false,
        isLogin: false,
        tasks: []
      };
      if(this.$store.state.sessError){
        route += ('?user=' + this.$route.params.username);
        storeData.sessError = false;
      }

      document.title = DOC_TITLE;
    
      this.$store.commit('set', storeData);
      this.$store.commit('clearDesktop');

      this.$router.push(route);
    }
  }
};