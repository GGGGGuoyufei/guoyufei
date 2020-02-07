<template>
  <div>
    <!-- form表单控件 -->
    <el-row :gutter="10">
      <el-col :xs="12" :sm="7" :md="5" :lg="4" :xl="5">
        <div class="grid-content bg-purple">
          <el-input v-model="Search.name" placeholder="请输入名称"></el-input>
        </div>
      </el-col>
      <el-col :xs="12" :sm="7" :md="5" :lg="4" :xl="5">
        <div class="grid-content bg-purple">
          <el-input v-model="Search.tag" placeholder="请输入标识"></el-input>
        </div>
      </el-col>
      <el-col :xs="12" :sm="7" :md="5" :lg="4" :xl="5">
        <div class="grid-content bg-purple">
          <el-input v-model="Search.description" placeholder="请输入描述内容"></el-input>
        </div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-button class="btns _targets" @click="SearchModel()">查询</el-button>
        </div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-button type="primary" class="btns targets" @click="isShow = true;">新增</el-button>
        </div>
      </el-col>
      <!-- <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-button type="danger" class="btns" @click="DelGroup()">批量删除</el-button>
        </div>
      </el-col> -->
    </el-row>
    <!-- 提示区域 -->
    <div class="tips">
      <i class="el-icon-warning"></i>
      <span>已选择 <span>{{CheckLength}}</span> 项</span>
      <button @click="clearCheck()">清空</button>
    </div>
    <!-- Table展示区 -->
    <el-table
      class="model_list"
      align="center"
      ref="multipleTable"
      :data="modelList"
      tooltip-effect="dark"
      style="width: 100%"
      border
      :header-cell-style="{background:'#F5F7FA'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55"></el-table-column>
      <el-table-column prop="name" label="名称" align="center" width="120"></el-table-column>
      <el-table-column prop="modelKey" label="标识" align="center" width="120"></el-table-column>
      <el-table-column prop="description" label="描述" align="center" width="180"></el-table-column>
      <el-table-column prop="version" label="版本" align="center" width="120"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <button class="button_txt" style="margin-left:0" target="design" @click="goDesign(scope.$index, scope.row)">在线设计</button>
          <button class="button_txt" @click="Deploy(scope.$index, scope.row)">部署</button>
          <!-- <a href class="button_txt">导出</a> -->
          <button class="button_txt" @click="DelModel(scope.$index, scope.row)">删除</button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击新增/编辑的dialog -->
    <el-dialog title="新增模型" :visible.sync="isShow">
      <el-form :model="Create" status-icon class="_dialog" :rules="rules" ref="Create">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="Create.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识" :label-width="formLabelWidth" prop="modelKey">
          <el-input v-model="Create.modelKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="Create.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="_buttons">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="Suring('Create')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
  </div>
</template>

<script>
import { GetAllModel,AddModel,DeployModel,DelModel } from "@/servise";
export default {
  name: "ModelMag",
  data() {
    return {
      //搜索
      Search: {
        name: null,
        modelKey: null,
        description:null
      },
      modelList: [], //全部模型Table展示
      Create: {
        name: null,
        modelKey: null,
        description: null
      },
      isShow: false, //dialog状态
      changeType: false, //判断电机的按钮为编辑还是添加
      formLabelWidth: "80px",
      //验证
      rules: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        modelKey: [{ required: true, message: "请输入用户标识", trigger: "blur" }]
      },
      //分页器
      pageSize: 10,
      page: 1,
      total: 0,
      CheckLength:0,//当前选中几项
      groupDel:[],//批量删除
      DesignUrl:"",
    };
  },
  methods: {
    goDesign(index,scoped){
      this.$router.push(`/design/${scoped.id}`)
    },
    //点击页码跳转对应页
    countChange(page) {
      const rLoading = this.openLoading();
      GetAllModel({
        pageNumber:page,
        pageSize:this.pageSize
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.modelList = res.data.records;
        }else{
          rLoading.close();
          this.$message({
            message:"转入下一页失败",
            type:"error"
          })
        }
      })
    },
    //添加空白模型
    Suring(Create) {
      //表单验证
      this.$refs[Create].validate((valid) => {
        if (valid) {
          const rLoading = this.openLoading();
          AddModel({
            name:this.Create.name,
            modelKey:this.Create.modelKey,
            description:this.Create.description
          }).then(res => {
            if(res.code === "000000"){
              rLoading.close();
              this.isShow = false;
              this.$message({
                message:"新增模型成功",
                type:"success"
              })
              this.StartGetAllModel();//页面刷新
              this.InputEmpty();//输入框为空
            }else{
              rLoading.close();
              this.$message.error("新增模型失败");
            }
          })
        } else {
          this.$message({
            message:"请填写完整信息",
            type:"warning"
          })
        }
      });
    },
    //部署模型
    Deploy(index,scoped){
      const rLoading = this.openLoading();
      DeployModel({
        id:scoped.id
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.$message({
            message:"部署成功",
            type:"success"
          })
        }else{
          rLoading.close();
          this.$message.error("部署失败");
        }
      })
    },
    //删除模型
    DelModel(index,scoped){
      const rLoading = this.openLoading();
      DelModel(scoped.id).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.$message({
            message:"删除模型成功",
            type:"success"
          })
          this.StartGetAllModel();
        }else{
          rLoading.close();
          this.$message.error("删除模型失败")
        }
      })
    },
    //批量删除
    DelGroup(){

    },
    //模型查询
    SearchModel(){
      const rLoading = this.openLoading();
      GetAllModel({
        pageNumber:1,
        pageSize:this.pageSize,
        order:"asc",
        name:this.Search.name,
        modelKey:this.Search.modelKey,
        description:this.Search.description
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.modelList = res.data.records;
        }else{
          rLoading.close();
          this.$message.error("查询失败")
        }
      })
    },
    //勾选全选按钮回调
    handleSelectionChange(val){
      this.CheckLength = val.length;
    },
    //清空选择
    clearCheck(){
      this.$refs.multipleTable.clearSelection();// 删除后清空之前选择的数据
    },
    //开始获取全部模型
    StartGetAllModel(){
      const rLoading = this.openLoading();
      GetAllModel({
        pageNumber:1,
        pageSize:this.pageSize,
        order:"asc"
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.modelList = res.data.records;
        }
      })
    },
    // 成功时输入框为空
    InputEmpty(){
      this.Create.name = null;
      this.Create.modelKey = null;
      this.Create.description = null;
    }
  },
  created() {
    this.StartGetAllModel();
  },
};
</script>

<style lang="scss" scoped>
.home {
  box-sizing: border-box;
}
.el-col {
  border-radius: 4px;
}
// .bg-purple-dark {
//   // background: #99a9bf;
// }
// .bg-purple {
//   // background: #d3dce6;
// }
// .bg-purple-light {
//   // background: #e5e9f2;
// }
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
.targets:hover {
  background-color: #e8f7f6;
  border-color: #b9e8e3;
  color: #17b3a3;
}
.targets:focus {
  background-color: #e8f7f6;
  border-color: #b9e8e3;
  color: #17b3a3;
}
.el-button--primary {
  color: #fff;
  background-color: #17b3a3;
  border-color: #17b3a3;
}
.el-button--primary:hover {
  color: #fff;
  background-color: #45c2b5;
  border-color: #45c2b5;
}
.el-button--primary:focus {
  color: #fff;
  background-color: #45c2b5;
  border-color: #45c2b5;
}
.model_list {
  margin-top: 20px;
}
.table_head {
  font-weight: bold;
}
.el-table td {
  text-align: center;
}
._dialog {
  width: 90%;
}
// 分页器
.block {
  float: right;
  margin-top: 20px;
}
.button_txt {
  border: none;
  background: none;
  outline: none;
  color: #17b3ac;
  margin-left: 20px;
  text-align: center;
  cursor: pointer;
  word-wrap: break-word;
}
._buttons{
  text-align: right;
}
.tips{
  width:100%;
  height:30px;
  background:#E8F7F6;
  border-radius: 5px;
  border:1px solid #BFEAE6;
  margin-top:20px;
  padding-left: 20px;
  box-sizing: border-box;
  line-height: 30px;
  i{
    color:#17B3A3;
  }
  >span{
    color:#333;
    margin-left:15px;
    >span{
      margin:0 2px;
      color:#17B3A3;
    }
  }
  button{
    border:none;
    background: none;
    color:#17B3A3;
    margin-left: 15px;
    outline: none;
    cursor: pointer;
  }
}
// 复选框
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #17B3A3;
  border-color: #17B3A3;
}
/deep/ .is-indeterminate .el-checkbox__inner{
  background-color: #17B3A3 !important;
  border-color: #17B3A3 !important;
}
/deep/ .is-focus .el-checkbox__inner{
  border-color: #17B3A3 !important;
}
/deep/ .el-checkbox__inner:hover{
  border-color: #17B3A3 !important;
}
//按钮样式
._targets:hover{
  background-color: #E8F7F6;
  border-color: #B9E8E3;
  color:#17B3A3;
}
._targets:focus{
  background-color: #E8F7F6;
  border-color: #B9E8E3;
  color:#17B3A3;
}
/deep/ .el-input__inner:focus {
    border-color: #17B3A3;
}
</style>



<style>
.el-table td,
.el-table th {
  text-align: center !important;
}
th .cell {
  font-weight: bold !important;
  color: #333;
}
/* .checkbox__inner {
  background-color: #17B3A3 !important;
  border-color: #17B3A3 !important;
} */
/* .el-checkbox__inner{
  background-color: #17B3A3 !important;
  border-color: #17B3A3 !important;
} */
</style>