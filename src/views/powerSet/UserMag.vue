<template>
  <div class="home">
    <!-- form表单操作 -->
    <el-row :gutter="10">
      <el-col :xs="12" :sm="5" :md="4" :lg="4" :xl="5">
        <div class="grid-content bg-purple">
          <el-input v-model="Form.name" placeholder="用户名"></el-input>
        </div>
      </el-col>
      <el-col :xs="12" :sm="5" :md="4" :lg="4" :xl="5">
        <div class="grid-content bg-purple">
          <el-input v-model="Form.username" placeholder="账号"></el-input>
        </div>
      </el-col>
      <el-col :xs="12" :sm="5" :md="4" :lg="4" :xl="5">
        <div class="grid-content bg-purple">
          <el-input v-model="Form.mobile" placeholder="手机号"></el-input>
        </div>
      </el-col>
      <el-col :xs="5" :sm="3" :md="2" :lg="2" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-button class="btns" @click="searchUser()">查询</el-button>
        </div>
      </el-col>
      <el-col :xs="5" :sm="3" :md="2" :lg="2" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-button type="primary" class="btns" @click="addNew()">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 展示区table -->
    <el-table
      class="user_list"
      :data="userList"
      :header-cell-style="{background:'#F5F7FA'}"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="username" label="账号" width="180"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delUser(scope.$index, scope.row)">删除</el-button>
          <el-button type="warning" size="mini" @click="UpdateUser(scope.$index,scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="page"
        :total="total"
        @current-change="countChange(page)"
      ></el-pagination>
    </div>
    <!-- 新增的弹框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog" :destroy-on-close="true">
      <el-form :model="Create" class="create_user" :rules="rules" ref="Create">
        <!-- 姓名 -->
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name"
          :rules="[{ required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]">
          <el-input v-model="Create.name" ></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model.number="Create.mobile" ></el-input>
        </el-form-item>
        <!-- 账号 -->
        <el-form-item label="账号" :label-width="formLabelWidth" prop="username"
        :rules="[{ required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }]">
          <el-input v-model="Create.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password"
        :rules="[{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '至少8个字符', trigger: 'blur' }]">
          <el-input v-model="Create.password" ></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" class="checks">
          <el-input type="textarea" v-model="Create.description"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="Create.role" placeholder="请选择角色">
            <el-option v-for="(item,key) in allRole" :key="key" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织" :label-width="formLabelWidth" prop="group">
          <el-cascader
            v-model="Create.group"
            :options="allGroup"
            :show-all-levels="false"
            :props="{ checkStrictly: true,value:'id',label:'name' }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  DelUser,
  UpdateUser,
  getRoleAll,
  getGroupAll,
  AddUser,
  SearchUser
} from "@/servise";
export default {
  data() {
    return {
      Form: {
        name:null,
        username: null,
        mobile: null,
      },
      rules:{
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '电话不能为空',trigger: 'blur'},
          { type: "number", message: '必须为数字'},
          {validator:function(rule,value,callback){
            if(/^1[34578]\d{9}$/.test(value) == false){
                callback(new Error("请输入正确的手机号"));
            }else{
                callback();
            }
          }, trigger: 'blur'}
        ],
        group:[
          {required: true, message: '请选择分类', trigger: 'change'}
        ],
        role:[
          { required: true, message: '请选择您的角色', trigger: 'change' }
        ]
      },
      userList: [],
      //分页器
      pageSize: 10,
      page: 1,
      total: 0,
      //新增用户
      Create: {
        username: null,
        password: null,
        name: null,
        mobile: null,
        group: [],
        role: "",
        description: null
      },
      addDialog: false,
      updateDialog:false,
      formLabelWidth: "100px",
      allRole: null, //全部角色
      allGroup: null, //全部组织
      updateID:null,//修改暂存ID
    };
  },
  methods: {
    //开始获取用户
    StartGetUsers() {
      const rLoading = this.openLoading();
      this.page = 1;
      getUsers({
        current: 1,
        size: 10
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.userList = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    //开始获取全部角色
    getRole() {
      getRoleAll().then(res => {
        if(res.code === "000000"){
          this.allRole = res.data;
        }else{
          this.$message.error("获取角色失败");
        }
      });
    },
    //开始获取全部组织
    getGroup() {
      getGroupAll().then(res => {
        if(res.code === "000000"){
          this.allGroup = this.getTreeData(res.data);
        }else{
          this.$message.error("获取组织失败");
        }
      });
    },
    //点击页码跳转对应页
    countChange(page) {
      const rLoading = this.openLoading();
      getUsers({
        current: page,
        size: this.pageSize
      }).then(res => {
        if(res.code === "000000"){
          this.userList = res.data.records;
          rLoading.close();
        }else{
          rLoading.close();
          this.$message({
            message:"转入下一页失败",
            type:"error"
          })
        }
      });
    },
    //添加用户
    addUser() {
      let roleArray = [];
      let groupArray = [];
      groupArray.push(this.Create.group[this.Create.group.length-1]);
      roleArray.push(this.Create.role)
      if(this.Create.description == ""){
        this.Create.description = null;
      }
      if(this.Create.role == ""){
        roleArray = null;
      }
      var sendMesg = {
        name:this.Create.name,
        mobile:this.Create.mobile,
        username:this.Create.username,
        password:this.Create.password,
        description:this.Create.description,
        roleIds:roleArray,
        groupIds:groupArray
      }
      //首先判断用户操作的是添加还是修改
      if(!this.updateDialog){
        this.$refs.Create.validate((valid) => {
          console.log(valid);
          //然后判断填充的添加信息是否完整
          if(valid){
            const rLoading = this.openLoading();
            AddUser(sendMesg).then(res => {
              if (res.code === "000000") {
                this.addDialog = false;
                this.emptyAll();//皆空
                this.StartGetUsers();
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.emptyAll();//皆空
                rLoading.close();
              } else {
                rLoading.close();
                this.$message({
                  message:"添加失败",
                  type:"error"
                });
              }
            });
          }else{
            this.$message({
              message:"请填充完整信息",
              type:"warning"
            });
          }
        })
      }else{
        this.$refs.Create.validate((valid) => {
          //判断填充的修改信息是否完整
          if(valid){
            const rLoading = this.openLoading();
            UpdateUser(this.updateID,sendMesg).then(res => {
              if (res.code === "000000") {
                rLoading.close();
                this.updateDialog = false;
                this.addDialog = false;
                this.StartGetUsers();
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.emptyAll();//皆空
              } else {
                rLoading.close();
                this.$message.error("修改失败");
                this.updateDialog = false
              }
            });
          }else{
            this.$message({
              message:"请填充完整信息",
              type:"warning"
            });
          }
        })
      }
    },
    //删除用户
    delUser(index, row) {
      const rLoading = this.openLoading();
      DelUser(row.id).then(res => {
        if (res.code === "000000") {
          rLoading.close();
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.StartGetUsers();
        }else{
          rLoading.close();
          this.$message({
            message: "删除失败",
            type: "error"
          });
        }
      });
    },
    //搜索用户
    searchUser(){
      const rLoading = this.openLoading();
      SearchUser({
        name:this.Form.name,
        username:this.Form.username,
        mobile:this.Form.mobile,
        current:1,
        size:10,
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          if(res.data.records.length == 0){
            this.userList = res.data.records;
            this.$message("没有找到该用户");
          }else{
            this.userList = res.data.records;
          }
        }else{
          rLoading.close();
          this.$message.error("查询失败");
        }
      })
    },
    //添加用户前开启dialog
    addNew(){
      this.updateDialog = false;
      this.addDialog = true;
      if(this.updateDialog == false){
        this.emptyAll();
      }
    },
    //修改用户前开启dialog
    UpdateUser(index, row) {
      this.updateID = row.id;
      this.updateDialog = true;
      this.addDialog = true;
      this.Create.username = row.username;
      this.Create.password = row.password;
      this.Create.name = row.name;
      this.Create.mobile = Number(row.mobile);
      this.Create.description = row.description;
      // this.Create.role = row.id
    },
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data){
      for(var i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    //皆空
    emptyAll(){
      this.Create.username = null;
      this.Create.password = null;
      this.Create.name = null;
      this.Create.mobile = null;
      this.Create.group = [];
      this.Create.role = "";
      this.Create.description = null;
    }
  },
  created() {
    this.StartGetUsers();
    this.getRole();
    this.getGroup();
  }
};
</script>

<style lang="scss" scoped>
.home {
  height: auto;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
//按钮样式
.btns {
  width: 100%;
  display: flex;
  justify-content: center;
}
.add {
  background: #17b3a3;
  color: white;
  border: 1px solid #17b3a3;
}
.add:hover {
  background: #17b3a3;
}
.user_list {
  margin-top: 20px;
}
.block {
  float: right;
  margin-top: 20px;
}
//dialog框
.create_user {
  width: 100%;
}
.checks {
  width: 100%;
}
</style>