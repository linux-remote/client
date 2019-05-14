
<template lang="jade">
.lr-fs-left
  .lr-fs-bookmark(@click='go("")', :class='{lr_bookmark_active: address === ""}')
    .lr-icon(:style="{backgroundImage: `url(${computerIcon})`}")
    |  此电脑
  .lr-fs-bookmark(@click='go("/")', :class='{lr_bookmark_active: address === "/"}')
    .lr-icon(:style="{backgroundImage: `url(/public/img/tango-style/folder.png)`}") /
    | 根目录
  .lr-fs-bookmark(@click='go(homedir)', :class='{lr_bookmark_active: address === homedir}')
    .lr-icon(:style="{backgroundImage: `url(/public/img/tango-style/user-home.png)`}")
    | Home

  .lr-fs-favorites
    .lr-fs-favorites-inner
      .lr-fs-bookmark(v-for='v in [1,2,3,4,5,6,7,8,9]')
        | 收藏

  //- .lr-fs-bookmark  /
</template>

<script>
export default {
  computed: {
    computerIcon(){
      return this.$store.state.sysApps.sysMap.sys_app_disk.iconUrl
    },
    go(){
      return this.$parent.$refs.navBar.go
    },
    address(){
      return this.$parent.address
    },
    homedir(){
      return this.$store.state.homedir
    }
  },
  methods: {
  },
  created(){

  }
}
</script>
