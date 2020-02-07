<template>
  <div class="login" id="login">
    <div class="content">
      <h1>CMP</h1>
      <h2>CMP智能虚拟安全网络管理平台</h2>
      <div class="form">
        <el-form class="demo-ruleForm" :model="ruleForm">
          <el-form-item
            prop="name"
            :rules="[{ required: true, message: '您输入的用户名有误，请重新输入！'},]"
          >
            <i><img src="@/assets/loginUser.png" alt /></i>
            <el-input type="text" v-model="ruleForm.name" autocomplete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item
            prop="checkPass"
            :rules="[{ required: true, message: '您输入的密码有误，请重新输入！'},]"
          >
            <i><img src="@/assets/loginPaw.png" alt /></i>
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              autocomplete="off"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.prevent="submitForm()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { Login } from "@/servise/index";
import { setToken } from "@/utils/cookie";
import axios from "axios"
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        checkPass: ""
      }
    };
  },
  methods: {
    submitForm() {
      let _this = this;
      Login({
        username: this.ruleForm.name,
        password: this.ruleForm.checkPass
      }).then(res => {
        if (res.code === "000000") {
          _this.ruleForm = {
            name: "",
            checkPass: ""
          };
          // localStorage.setItem("userData", JSON.stringify(res.result.userData));
          setToken(res.data.access_token);
          this.$router.push("/");
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: gainsboro;
  background-size: cover;
  padding-top: 170px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  .content {
    width: 590px;
    height: 457px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    margin: 0 auto;
    padding: 30px 0 40px 0;
    text-align: center;
    h1 {
      height: 70px;
      font-size: 50px;
      color: rgba(32, 42, 59, 1);
      line-height: 70px;
      // margin: 0 auto;
    }
    h2 {
      height: 33px;
      font-size: 24px;
      color: rgba(32, 42, 59, 1);
      line-height: 33px;
      white-space: nowrap;
      margin-top: 30px;
    }
    .form {
      width: 400px;
      margin: 40px auto 0;
      position: relative;
      i {
        position: absolute;
        z-index: 10;
        left: 15px;
        top: 10px;
        width: 18px;
        height: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
<style lang="scss">
#login {
  .el-input__inner {
    width: 400px;
    height: 48px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: #333333;
    padding-left: 48px;
  }
  .el-input__inner:hover {
    border: 1px solid #3678c8;
  }
  .el-form-item:nth-child(1) {
    margin-bottom: 30px;
  }
  .el-form-item:nth-child(2) {
    margin-bottom: 40px;
  }
  .el-button--primary {
    width: 400px;
    height: 48px;
    background: #6095d6;
    border-radius: 2px;
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
    line-height: 25px;
  }
  .el-button--primary:hover {
    background: #3678c8;
  }
  .el-form-item__error {
    left: 48px;
    color:#BA2727;
  }
  .el-form-item.is-error .el-input__inner{
    border-color:#BA2727;
  }
}
</style>