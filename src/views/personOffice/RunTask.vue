<template>
    <div>
        <el-row :gutter="20">
            <el-col :xs="12" :sm="7" :md="6" :lg="4" :xl="5">
                <div class="grid-content bg-purple">
                  <el-input v-model="SearchName" placeholder="请输入名称"></el-input>
                </div>
            </el-col>
            <el-col :xs="5" :sm="4" :md="4" :lg="2" :xl="3">
                <div class="grid-content bg-purple-light">
                  <el-button class="btns targets" @click="Search()">查询</el-button>
                </div>
            </el-col>
        </el-row> 
        <el-table
        class="run_table"
        :data="taskList"
        border
        style="width: 100%"
        :header-cell-style="{background:'#F5F7FA'}">
            <el-table-column prop="processInstanceId" label="业务KEY" width="180"></el-table-column>
            <el-table-column prop="taskId" label="实例ID" width="180"></el-table-column>
            <el-table-column prop="name" label="流程名称" width="180"></el-table-column>
            <el-table-column prop="applyTime" label="流程开始时间" width="200"></el-table-column>
            <el-table-column prop="processName" label="任务名称"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="Handle(scope.$index, scope.row)">处理</el-button>
              <el-button type="primary" size="mini" @click="lookPic(scope.$index, scope.row)">查看流程图</el-button>
              <!-- <button class="button_txt" style="margin-left:0" @click="Handle(scope.$index, scope.row)">处理</button> -->
              <!-- <button class="button_txt" @click="lookPic(scope.$index, scope.row)">查看流程图</button> -->
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
        <!-- 处理 -->
        <el-dialog title="正在处理" :visible.sync="isShow" :destroy-on-close="true">
          <el-form :rules="rules" ref="Create" :model="Create">
            <el-form-item label="意见" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" v-model="Create.opinion" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="下级审批" v-if="Showing" prop="next">
              <el-select v-model="Create.next" placeholder="请选择">
                <el-option
                  v-for="item in nextList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <el-button type="success" @click="approve()">通过</el-button>
              <el-button type="danger" @click="reject()">驳回</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { GetMyTask,Approve,OffNext,NextUser,Reject } from "@/servise";
    export default {
        name:"RunTask",
        data() {
            return {
                rules:{
                  next: [
                    { required: true, message: '请选择下级审批人', trigger: 'blur' },
                  ],
                },
                SearchName:null,//搜索内容
                taskList:[],//开始获取代办列表
                //分页器
                pageSize: 10,
                page: 1,
                total: 0,
                isShow:false,//处理框状态
                formLabelWidth:"80px",
                Create:{
                  opinion:null,//意见内容
                  next:null,//下一级
                },
                TemID:null,
                ProcessID:null,
                SendArray:[],//获取下一级点
                nextList:[],//再获下一级
                Showing:null,//判断是否下级/状态
            }
        },
        methods: {
            //点击页码跳转对应页
            countChange(page) {
              // GetAllModel({
              //   pageNumber:page,
              //   pageSize:this.pageSize
              // }).then(res => {
              //   this.modelList = res.data.records;
              // })
            },
            //查询
            Search(){

            },
            //处理
            Handle(index,scoped){
              console.log(scoped)
              this.isShow = true;
              this.TemID = scoped.taskId;
              this.ProcessID = scoped.processInstanceId;
                // this.$router.push("/workOffice/handle")
                //判断是否右下一级
                OffNext({
                  taskId:scoped.taskId
                }).then(res => {
                  if(res.code === "000000" && res.data.haveNextNode === true){
                    this.Showing = true;
                    this.SendArray = res.data.roleIds;
                    var strSend = "";
                    this.SendArray.map((v,i) => {
                      strSend = strSend + "," + v;
                    })
                    NextUser({
                      roleIds:strSend
                    }).then(response => {
                      if(response.code === "000000"){
                        this.nextList = response.data;
                        // this.isShow = true;
                      }
                    })
                  }else if(res.code === "000000" && res.data.haveNextNode === false){
                    this.Showing = false;
                  }
                })
            },
            //通过
            approve(){
              this.$refs.Create.validate((valid) => {

                if(valid){
                  const rLoading = this.openLoading();
                  Approve({
                    taskId:this.TemID,
                    opinion:this.Create.opinion,
                    userId:this.Create.next,
                    result:2
                  }).then(res => {
                    if(res.code === "000000"){
                      rLoading.close();
                      this.$message({
                        message:"通过成功",
                        type:"success"
                      })
                      this.StartGetAllTask();
                      this.isShow = false;
                    }else{
                      rLoading.close();
                      this.$message.error("通过失败")
                    }
                  })
                }else{
                  this.$message({
                    message:"请输入完整信息",
                    type:"warning"
                  })
                }
              })
              
            },
            //驳回
            reject(){
              const rLoading = this.openLoading();
              Reject({
                taskId:this.TemID,
                procInstId:this.ProcessID,
                comment:this.Create.opinion
              }).then(res => {
                if(res.code === "000000"){
                  rLoading.close();
                  this.$message({
                    message:"驳回成功",
                    type:"success"
                  })
                  this.isShow = false;
                }else{
                  rLoading.close();
                  this.$message.error("驳回失败")
                }
              })
            },
            //查看流程图
            lookPic(index,scoped){
              this.$router.push(`/workOffice/pathPig/${scoped.processInstanceId}`)
            },
            //开始获取全部代办
            StartGetAllTask(){
              const rLoading = this.openLoading();
              GetMyTask({
                page:1,
                pageSize:this.pageSize
              }).then(res => {
                if(res.code === "000000"){
                  rLoading.close();
                  this.taskList = res.data.records;
                }
              })
            },
        },
        created() {
          this.StartGetAllTask();
        },
    }
</script>

<style lang="scss" scoped>
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.btns {
  width: 100%;
  display: flex;
  justify-content: center;
}
.targets:hover{
  background-color: #E8F7F6;
  border-color: #B9E8E3;
  color:#17B3A3;
}
.targets:focus{
  background-color: #E8F7F6;
  border-color: #B9E8E3;
  color:#17B3A3;
}
/deep/ .el-input__inner:focus {
    border-color: #17B3A3;
}
.run_table{
    margin-top:20px;
}
.button_txt{
  border:none;
  background:none;
  outline:none;
  color:#17B3AC;
  margin-left:20px;
  text-align: center;
  cursor: pointer;
  word-wrap:break-word
}
// 分页器
.block {
  float: right;
  margin-top: 20px;
}
</style>
