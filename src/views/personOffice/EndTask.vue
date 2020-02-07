<template>
    <div>
        <el-row :gutter="20">
            <el-col :xs="12" :sm="7" :md="6" :lg="4" :xl="5">
                <div class="grid-content bg-purple">
                  <el-input v-model="SearchName" placeholder="请输入查询名称"></el-input>
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
            <el-table-column prop="taskId" label="实例ID" width="200"></el-table-column>
            <el-table-column prop="name" label="任务名称" width="200"></el-table-column>
            <el-table-column prop="processName" label="流程名称" width="200"></el-table-column>
            <el-table-column prop="applyUser" label="发起人" width="200"></el-table-column>
            <el-table-column prop="applyTime" label="流程开始时间" width="200"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="150">
            <template slot-scope="scope">
              <button class="button_txt" @click="lookPic(scope.$index, scope.row)">查看流程图</button>
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
    </div>
</template>

<script>
import { GetFulFuillProcess } from "@/servise"
    export default {
        name:"EndTask",
        data() {
            return {
                SearchName:null,//搜索内容
                taskList:[],//开始获取代办列表
                 //分页器
                pageSize: 10,
                page: 1,
                total: 0,
            }
        },
        methods: {
            //点击页码跳转对应页
            countChange(page) {
              const rLoading = this.openLoading();
              GetFulFuillProcess({
                page:page,
                pageSize:this.pageSize
              }).then(res => {
                if(res.code === "000000"){
                  rLoading.close();
                  this.modelList = res.data.records;
                }else{
                  rLoading.close();
                  this.$message({
                    message:"转入下一页失败",
                    type:"warning"
                  })
                }
              })
            },
            //查询
            Search(){

            },
            //处理
            Handle(index,scoped){
                this.$router.push("/workOffice/handle")
            },
            //查看流程图
            lookPic(index,scoped){
              this.$router.push(`/workOffice/pathPig/${scoped.processInstanceId}`)
            },
            //开始获取全部已办
            StartGetAllFill(){
              const rLoading = this.openLoading();
              GetFulFuillProcess({
                page:1,
                pageSize:this.pageSize,
              }).then(res => {
                if(res.code === "000000"){
                  rLoading.close();
                  this.taskList = res.data.records;
                }
              })
            }
        },
        created() {
          this.StartGetAllFill();
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
  // margin-left:20px;
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
