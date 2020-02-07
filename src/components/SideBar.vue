<template>
    <el-aside width="230px">
      <keep-alive>
      
      <el-menu
      background-color="#263238"  
      text-color="#8A979E"
      active-text-color="#20a0ff"
      :router="true"
      >
        <!-- 动态权限菜单 -->
        <template v-for="(item,key) in this.$store.state.MenuList" >
          <template v-if="item.children.length != 0">
            <el-submenu :index="item.href" :key="key">
              <template slot="title">
                <i :class="item.icon"></i>{{item.name}}
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(val,inx) in item.children" :key="inx" :index="val.href">
                  <i :class="val.icon"></i>{{val.name}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.href" :key="key">
              <i :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </template>
        </template>


        <!-- 权限管理SlideBar -->
        <!-- <template>
          <el-submenu index="/common" default-active="1">
            <template slot="title">
              <i class="el-icon-set-up"></i>权限管理
            </template>
            <el-menu-item-group>
              <el-menu-item index="/common/home"><i class="el-icon-s-custom"></i>用户管理</el-menu-item>
              <el-menu-item index="/common/order"><i class="el-icon-copy-document"></i>组织管理</el-menu-item>
              <el-menu-item index="/common/profile"><i class="el-icon-user-solid"></i>角色管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
        <el-submenu index="/system">
          <template slot="title">
            <i class="el-icon-setting"></i>系统设置
          </template>
          <el-menu-item-group>
            <el-menu-item index="/system/menu"><i class="el-icon-s-fold"></i>菜单管理</el-menu-item>
            <el-menu-item index="/system/resource"><i class="el-icon-collection"></i>资源管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="/cloud/home">
          <i class="el-icon-cloudy"></i>
          <span slot="title">云账号管理</span>
        </el-menu-item>
        <el-submenu index="/flowPath">
          <template slot="title">
            <i class="el-icon-time"></i>流程管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/flowPath/myApply"><i class="el-icon-upload2"></i>我的申请</el-menu-item>
            <el-menu-item index="/flowPath/flowMag"><i class="el-icon-c-scale-to-original"></i>流程管理</el-menu-item>
            <el-menu-item index="/flowPath/modelMag"><i class="el-icon-document-copy"></i>模型管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/workOffice">
          <template slot="title">
            <i class="el-icon-user"></i>个人办公
          </template>
          <el-menu-item-group>
            <el-menu-item index="/workOffice/runTask"><i class="el-icon-timer"></i>我的待办</el-menu-item>
            <el-menu-item index="/workOffice/endTask"><i class="el-icon-circle-check"></i>已办任务</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/control">
          <template slot="title">
            <i class="el-icon-video-camera"></i>监控管理
          </template>
          <el-menu-item-group>
            <el-menu-item index="/control/cont"><i class="el-icon-heavy-rain"></i>阿里云</el-menu-item>
            <el-menu-item index="/control/tencent"><i class="el-icon-lightning"></i>腾讯云</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/task">
          <template slot="title">
            <i class="el-icon-document"></i>作业平台
          </template>
          <el-menu-item-group>
            <el-menu-item index="/task/shell"><i class="el-icon-data-line"></i>命令执行</el-menu-item>
            <el-menu-item index="/task/scriptExecution"><i class="el-icon-data-analysis"></i>脚本执行</el-menu-item>
            <el-menu-item index="/task/file"><i class="el-icon-collection"></i>文件分发</el-menu-item>
            <el-menu-item index="/task/scriptStore"><i class="el-icon-connection"></i>脚本库管理</el-menu-item>
            <el-menu-item index="/task/ansible"><i class="el-icon-connection"></i>Ansible管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
      </el-menu>
      </keep-alive>

    </el-aside>
</template>

<script>
import { GetNowRole,} from "@/servise"
export default {
  name: "SideBar",
  data() {
    return {
      MenuList:[],
    }
  },
  methods: {
    goto(path) {
      this.$router.push(path);
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.el-aside {
  color: #333;
  background:#263238;
  position: absolute;
  left:0;
  top:50px;
  bottom:0;
}
.el-submenu{
  width:230px;
}
.is-active{
    background:#263238 !important;
}
.el-menu-item{
  width:230px;
}
.el-menu-item-group__title{
  margin:0 ;
  padding:0 !important;
}
</style>
<style>
  .el-menu-item-group__title{
  margin:0 ;
  padding:0 !important;
}
</style>