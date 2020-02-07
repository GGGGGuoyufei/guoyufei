<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="12" :sm="7" :md="5" :lg="4" :xl="5">
        <div class="grid-content bg-purple">
          <el-input v-model="Search.name" placeholder="请输入名称"></el-input>
        </div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-button class="btns _targets" @click="SearchApply()">查询</el-button>
        </div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-button type="primary" class="btns targets" @click="addApply()">新增申请</el-button>
        </div>
      </el-col>
      <!-- <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="3">
        <div class="grid-content bg-purple-light">
          <el-button type="danger" class="btns" @click="DelGroup()">批量删除</el-button>
        </div>
      </el-col> -->
    </el-row>
    <!-- Table展示区 -->
    <el-table
      align="center"
      ref="multipleTable"
      :data="applyList"
      tooltip-effect="dark"
      style="width: 100%"
      border
      :header-cell-style="{background:'#F5F7FA'}"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="名称" align="center" width="200"></el-table-column>
      <el-table-column prop="categoryId" label="类型ID" align="center" width="200"></el-table-column>
      <el-table-column prop="content" label="内容" align="center" ></el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope" >
          <el-button type="danger" size="mini" @click="delApply(scope.$index, scope.row)">删除</el-button>
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
    <!-- 右侧 -->
    <Drawer
            title="选择流程"
            v-model="isShow"
            width="720"
            :mask-closable="true"
            :styles="styles"
            :draggable="true"
        >
            <Form :model="formData">
                <el-row :gutter="10">
                  <el-col :xs="8" :sm="6" :md="6" :lg="6" :xl="1">
                    <div class="grid-content bg-purple">
                        <el-input v-model="formData.name" placeholder="请输入流程名"></el-input>
                    </div>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="6" :lg="6" :xl="1">
                    <div class="grid-content bg-purple">
                        <el-input v-model="formData.name" placeholder="审批人"></el-input>
                    </div>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="3" :lg="3" :xl="1">
                    <div class="grid-content bg-purple">
                        <el-button type="primary" class="btns">搜索</el-button>
                    </div>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="4" :lg="5" :xl="1">
                    <div class="grid-content bg-purple">
                        <el-switch
                          v-model="formData.url"
                          active-text="最新"
                          inactive-text="全部">
                        </el-switch>
                    </div>
                  </el-col>
                </el-row>
            </Form>
            <el-row :gutter="20" class="lists">
              <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="list_box" v-for="(item,key) in flowList" :key="key">
                <div class="grid-content bg-purple" @click="pushAdd(item.id)">
                    <div class="tasks">
                      <p>1、请假分支演示{{key+1}}、{{item.name}}</p>
                      <p class="des">{{item.description}}</p>
                      <p class="version">版本：v.{{item.version}} 所属分类：请假申请</p>
                    </div>
                </div>
              </el-col>
              <!-- <el-col :xs="12" :sm="12" :md="11" :lg="11" :xl="11" class="list_box">
                <div class="grid-content bg-purple">
                    <div class="tasks">
                      <p>1、请假分支演示</p>
                      <p class="des">请假</p>
                      <p class="version">版本：v.2所属分类：请假申请</p>
                    </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="12" :md="11" :lg="11" :xl="11" class="list_box">
                <div class="grid-content bg-purple">
                    <div class="tasks">
                      <p>1、请假分支演示</p>
                      <p class="des">请假</p>
                      <p class="version">版本：v.2所属分类：请假申请</p>
                    </div>
                </div>
              </el-col> -->
            </el-row>
        </Drawer>
  </div>
</template>

<script>
import { GetAllApply,GetActive,DelApply } from "@/servise";
  export default {
    name:"MyApply",
    data() {
      return {
        //查询
        Search:{
          name:null,
        },
        applyList:[],//开始获取全部申请
        //分页器
        pageSize: 10,
        page: 1,
        total: 0,
        ///-----------
        isShow: false,
        styles: {
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: '53px',
            position: 'static'
        },
        flowList:[],//开始获取全部激活流程
        formData: {
            name: '',
            url: '',
            owner: '',
            type: '',
            approver: '',
            date: '',
            desc: ''
        },
        delStr:null,//批量删除
        ///-----------
      }
    },
    methods: {
      //点击页码跳转对应页
      countChange(page) {
        const rLoading = this.openLoading();
        GetAllApply({
          pageNumber:page,
          pageSize:this.pageSize
        }).then(res => {
          if(res.code === "000000"){
            rLoading.close();
            this.applyList = res.data.records;
          }else{
            rLoading.close();
            this.$message({
              message:"转入下一页失败",
              type:"error"
            })
          }
        })
      },
      //新增申请
      addApply(){
        this.StartGetAllFlow();
      },
      //跳转添加输入页面
      pushAdd(id){
        // /workOffice/addApply/:id
        this.isShow = false;
        this.$router.push(`/workOffice/addApply/${id}`)

      },
      //删除申请
      delApply(index,scoped){
        const rLoading = this.openLoading();
        DelApply({
          ids:scoped.id,
        }).then(res => {
          if(res.code === "000000"){
            rLoading.close();
            this.$message({
              message:"删除成功",
              type:"success"
            })
            this.StartGetAllApply();
          }else{
            rLoading.close();
            this.$message.error("删除失败")
          }
        })
      },
      handleSelectionChange(val){
        var delStr = "";
        val.map((v,i) => {
          delStr = delStr + v.id + ",";
        })
        this.delStr = delStr;
      },
      //批量删除
      DelGroup(){
        if(this.delStr == null){
          this.$message({
            message:"请勾选需要删除的申请",
            type:"warning"
          })
        }else{
          DelApply({
            ids:this.delStr,
          }).then(res => {
            if(res.code === "000000"){
              this.$message({
                message:"删除成功",
                type:"success"
              })
              this.StartGetAllApply();
            }else{
              this.$message.error("删除失败")
            }
          })
        }
      },
      //查询申请
      SearchApply(){
        const rLoading = this.openLoading();
        GetAllApply({
          pageNumber:1,
          pageSize:this.pageSize,
          name:this.Search.name,
        }).then(res => {
          if(res.code === "000000"){
            rLoading.close();
            this.$message({
              message:"查询成功",
              type:"success"
            })
            this.applyList = res.data.records;
          }else{
            rLoading.close();
            this.$message.error("查询失败")
          }
        })
      },
      //开始获取全部申请
      StartGetAllApply(){
        const rLoading = this.openLoading();
        GetAllApply({
          pageNumber:1,
          pageSize:this.pageSize
        }).then(res => {
          if(res.code === "000000"){
            rLoading.close();
            this.applyList = res.data.records;
          }
        })
      },
      //开始获取全部流程
      StartGetAllFlow(){
        const rLoading = this.openLoading();
        GetActive().then(res => {
          if(res.code === "000000"){
            rLoading.close();
            this.isShow = true
            this.flowList = res.data;
          }
        })
      },
    },
    created() {
      this.StartGetAllApply();
      // this.StartGetAllFlow();
    },
  }
</script>

<style lang="scss" scoped>
//栅格
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  line-height: 36px;
  // background: red;
}
//按钮
.btns {
  width: 100%;
  display: flex;
  justify-content: center;
}
//按钮事件样式
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
.el-table{
  margin-top:20px;
}
// 分页器
.block {
  float: right;
  margin-top: 20px;
}
//tasklist
.tasks{
  border:1px solid gainsboro;
  border-radius: 5px;
  padding:15px;
  box-sizing: border-box;
  transition: all 0.5s;
}
.lists{
  margin-top:20px;
}
.version{
  color:#8C8C8C;
  font-size: 12px;
}
.des{
  padding:0 20px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tasks:hover{
  transform: scale(1.01);
  box-shadow: 0 0 10px 5px #aaa;
}
//list
.list_box{
  margin-top:15px;
}
</style>