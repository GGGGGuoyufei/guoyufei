<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import { removeToken } from "@/utils/cookie";
  export default {
    name:"App",
  }
  
</script>

<style lang="scss">
*{
  margin:0;
  padding:0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}
body{
  font-size: 14px;
}
.el-table--border th.gutter:last-of-type {
    display: block!important;
    width: 17px!important;
}
</style>
<style>
.el-icon-loading{
  color:white !important;
  font-size: 30px !important;
}
.el-loading-text{
  font-size: 20px !important;
  color:white !important;
}
</style>
