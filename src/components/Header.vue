<template>
  <header>
    <div class="logo">CMP云管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <keep-alive>
        
        
        <el-select v-model="SelectedRole" placeholder="请选择" @change="ChangeRole">
          <el-option
            v-for="item in SelectRole"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        </keep-alive>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="@/assets/avator.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            软通动力
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>回到首页</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 退出登录dialog -->
        <el-dialog
          title="提示"
          :visible.sync="isShow"
          width="30%">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="isShow = false">取 消</el-button>
            <el-button type="primary" @click="isShow = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </header>
</template>

<script>
import { LoginOut, GetNowRole, GetMenuByID, } from "@/servise";
import { removeToken } from "@/utils/cookie";
export default {
  data() {
    return {
      isShow: false,
      message: "",
      SelectRole:[],
      SelectedRole:null,
    };
  },
  methods: {
    gotoHome(path) {
      this.$router.push(path);
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        this.$confirm("是否退出登录", "提示", {
          confirmButtonText: "退出",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          LoginOut().then(res => {
            if(res.code === "000000"){

              this.$message({
                type: "success",
                message: "退出成功!"
              });
              removeToken();
              this.$router.push("/login");
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      }
    },
    //《获取当前登录人角色》
    getNowRole(){
      // const rLoading = this.openLoading();
      GetNowRole().then(res => {
        if(res.code === "000000"){
          this.SelectRole = res.data;
          this.SelectedRole = res.data[0].id;
          //获取当前角色后 => 获取角色菜单
          GetMenuByID(this.SelectedRole).then(res => {
            if(res.code === "000000"){
              this.$store.commit("MenuTree",res.data);
              // rLoading.close();
            }
          })
        }
      })
    },
    //《当角色改变时 => 改变菜单树》
    ChangeRole(val){
      // console.log(val);
      // GetMenuByID(val).then(res => {
      //   console.log(res);
      // })
    }
  },
  created() {
    this.getNowRole();
  },
};
</script>

<style scoped lang="scss">
header {
  // position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  font-size: 22px;
  color: #fff;
  background-color: #17B3A3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding:0 50px;
}
.logo {
  width: 250px;
  line-height: 70px;
  font-weight: bold;
  font-family: 微软雅黑;
}
.header-right {
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
  margin-right: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>