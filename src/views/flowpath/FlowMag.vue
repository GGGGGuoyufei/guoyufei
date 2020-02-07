<template>
    <div>
        <!-- form表单控件 -->
        <el-row :gutter="20">
            <el-col :xs="12" :sm="7" :md="6" :lg="4" :xl="5">
                <div class="grid-content bg-purple">
                  <el-input v-model="Search.name" placeholder="请输入名称"></el-input>
                </div>
            </el-col>
            <el-col :xs="12" :sm="7" :md="6" :lg="4" :xl="5">
                <div class="grid-content bg-purple">
                <el-input v-model="Search.processKey" placeholder="请输入标识"></el-input>
                </div>
            </el-col>
            <el-col :xs="24" :sm="14" :md="8" :lg="8" :xl="5">
                <div class="grid-content bg-purple">
                  <el-date-picker
                    v-model="Search.timeAll"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                  </el-date-picker>
                </div>
            </el-col>
            <!-- <el-col :xs="5" :sm="4" :md="4" :lg="2" :xl="3">
              <div class="grid-content bg-purple-light">
                <el-button class="btns targets" @click="SearchFlow()">查询</el-button>
              </div>
            </el-col> -->
        </el-row>
        <el-row :gutter="10" style="margin-top:20px">
          <el-col :xs="5" :sm="4" :md="4" :lg="2" :xl="3">
            <div class="grid-content bg-purple-light">
              <el-button class="btns targets" @click="SearchFlow()">点击查询</el-button>
            </div>
          </el-col>
          <el-col :xs="5" :sm="4" :md="4" :lg="2" :xl="3">
            <div class="grid-content bg-purple-light">
              <el-button type="danger" class="btns" @click="delGroupFlow()">批量删除</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- Table展示区 -->
        <el-table
          class="model_list"
          align="center"
          ref="multipleTable"
          :data="flowList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          :header-cell-style="{background:'#F5F7FA'}"
           @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            prop="id"
            label="流程ID"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="name"
            label="模型名称"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="processKey"
            label="标识key"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="latest"
            label="最新版本号"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="xmlName"
            label="XML"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="开始时间"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="100">
            <template slot-scope="scope">
              <div class="control_btns">
                <button class="button_txt" style="margin-left:0" @click="HangUp(scope.$index, scope.row)">{{UpDown(scope.$index, scope.row)}}</button>
                <button class="button_txt" @click="delActProcess(scope.$index, scope.row)">删除</button>
                <button class="button_txt" @click="updateActProcess(scope.$index, scope.row)">编辑</button>
                <button class="button_txt" style="margin-left:0" @click="NodeMag(scope.$index, scope.row)">节点设置</button>
              </div>
              
              <!-- <button class="button_txt" @click="delUser(scope.$index, scope.row)">配置业务路由</button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 点击新增/编辑的dialog -->
        <el-dialog title="流程编辑" :visible.sync="isShow" :destroy-on-close="true">
          <el-form :model="Create" class="_dialog" :rules="rules" ref="Create"> 
             <el-form-item label="所属分类" :label-width="formLabelWidth" prop="categoryId">
              <el-select v-model="Create.categoryId" placeholder="请选择活动区域">
                <el-option v-for="(item,key) in category" :key="key" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="Create.description"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="isShow = false">取 消</el-button>
            <el-button type="primary" @click="updateSur('Create')">确 定</el-button>
          </div>
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
import { GetAllFlow,HangUp,Activate,DelFlow,UpdateFlow } from "@/servise"
    export default {
        name:"FlowMag",
        data() {
            return {
              //时间
              pickerOptions: {
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                  }
                }]
              },
              category:[
                {id:"0101",name:"服务申请工单"},
                {id:"0102",name:"客服工单"},
                {id:"0103",name:"主机登录审批"},
                {id:"0104",name:"主机指令审批"},
                {id:"0105",name:"主机申请工单"},
                {id:"0106",name:"主机变配工单"},
                {id:"0107",name:"主机指令脚本执行审批审批"},
                // "服务申请工单","客服工单","主机登录审批","主机指令审批","主机申请工单","主机变配工单","脚本执行审批"
              ],//分类
                //搜索
                Search:{
                  name:null,
                  processKey:null,
                  startTime:null,
                  endTime:null,
                  timeAll:null,
                },
                flowList:[],//全部模型Table展示
                Create:{
                  name:null,
                  processKey:null,
                  description:null,
                  latest:null,
                  categoryId:null,
                  startTime:null,
                  endTime:null,
                  timeAll:null,
                },
                isShow:false,//dialog状态
                formLabelWidth:"80px",
                //验证
                rules:{
                  name:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                  ],
                  processKey:[
                    { required: true, message: '请输入用户标识', trigger: 'blur' },
                  ],
                  latest:[
                    { required: true, message: '请输入版本号', trigger: 'blur' },
                  ],
                  categoryId:[
                    { required: true, message: '请选择分类', trigger: 'change' },
                  ],
                  timeAll:[
                    { required: true, message: '请选择起止时间', trigger: 'change' },
                  ]
                },
                //分页器
                pageSize: 10,
                page: 1,
                total: 0,
                btn:"挂起",//按钮字体
                temID:null,//暂存ID
                delGroup:null,
            }
        },
        methods: {
          //点击页码跳转对应页
          countChange(page) {
            getUsers({
              pageNumber: page,
              pageSize: this.pageSize
            }).then(res => {
              this.flowList = res.data.records;
            });
          },
          //挂起操作
          HangUp(index,scoped){
            if(scoped.status == 1){
              this.$confirm('确定进行 [ 挂起 ] 操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                const rLoading = this.openLoading();
                HangUp({
                  id:scoped.id
                }).then(res => {
                  if(res.code === "000000"){
                    rLoading.close();
                    this.$message({
                      type: 'success',
                      message: '挂起成功!'
                    });
                    this.StartGetAllFlow();
                  }else{
                    rLoading.close();
                    this.$message.error("挂起失败")
                  }
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });          
              });
            }
            if(scoped.status == 2){
              this.$confirm('确定进行 [ 激活 ] 操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                const rLoading = this.openLoading();
                Activate({
                  id:scoped.id
                }).then(res => {
                  if(res.code === "000000"){
                    rLoading.close();
                    this.$message({
                      type: 'success',
                      message: '激活成功!'
                    });
                    this.StartGetAllFlow();
                  }else{
                    rLoading.close();
                    this.$message.error("激活失败")
                  }
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });          
              });
            }
            
          },
          //判断挂起还是激活
          UpDown(index,scoped){
            if(scoped.status === 1){
              return "挂起"
            }else{
              return "激活"
            }
          },
          //删除流程
          delActProcess(index,scoped){
            const rLoading = this.openLoading();
            DelFlow({
              ids:scoped.id
            }).then(res => {
              if(res.code === "000000"){
                rLoading.close();
                this.$message({
                  message:"删除成功",
                  type:"success"
                })
                this.StartGetAllFlow();
              }else{
                rLoading.close();
                this.$message.error("删除失败")
              }
            })
          },
          //流程编辑
          updateActProcess(index,scoped){
            this.isShow = true;
            this.temID = scoped.id;
          },
          //确认编辑
          updateSur(Create){
            this.$refs[Create].validate((valid) => {
              if (valid) {
                const rLoading = this.openLoading();
                if(this.Create.description == ""){
                  this.Create.description == null
                }
                UpdateFlow(this.temID,{
                  categoryId:this.Create.categoryId,
                  description:this.Create.description,
                  name:this.Create.name,
                }).then(res => {
                  if(res.code === "000000"){
                    rLoading.close();
                    this.$message({
                      message:"修改成功",
                      type:"success"
                    })
                    this.isShow = false;
                    this.StartGetAllFlow();
                  }else{
                    rLoading.close();
                    this.$message({
                      message:"修改失败",
                      type:"error"
                    })
                  }
                })
                this.isShow = false;
              } else {
                return false;
              }
            });
          },
          //流程查询
          SearchFlow(){
            if(this.Search.timeAll == null){
              this.Search.startTime = null;
              this.Search.endTime = null;
            }else{
              this.Search.startTime = this.ChangeTime(this.Search.timeAll[0]);
              this.Search.endTime = this.ChangeTime(this.Search.timeAll[1]);
            }
            const rLoading = this.openLoading();
            GetAllFlow({
              name:this.Search.name,
              processKey:this.Search.processKey,
              startTime:this.Search.startTime,
              endTime:this.Search.startTime,
              pageNumber:1,
              pageSize:this.pageSize,
            }).then(res => {
              if(res.code === "000000"){
                rLoading.close();
                this.flowList = res.data.records;
              }else{
                rLoading.close();
                this.$message.error("查询失败")
              }
            })
          },
          handleSelectionChange(val){
            var delStr = "";
            val.map((v,i) => {
              delStr = delStr + v.id + ","
            })
            this.delGroup = delStr;
          },
          //批量删除
          delGroupFlow(){
            DelFlow({
              ids:this.delGroup
            }).then(res => {
              if(res.code === "000000"){
                this.$message({
                  message:"删除成功",
                  type:"success"
                })
                this.StartGetAllFlow();
              }else{
                this.$message.error("删除失败")
              }
            })
          },
          //节点操作
          NodeMag(index,scoped){
            this.$router.push(`/flowPath/Nodemag/${scoped.id}`);
          },
          //开始获取全部流程
          StartGetAllFlow(){
            const rLoading = this.openLoading();
            GetAllFlow({
              pageNumber:1,
              pageSize:this.pageSize,
              order:"asc"
            }).then(res => {
              if(res.code === "000000"){
                rLoading.close();
                this.flowList = res.data.records;
              }
            })
          }
        },
        beforeRouteEnter (to, from, next) {
          next(vm => {
            vm.StartGetAllFlow();
          })
        },
        created() {
          this.StartGetAllFlow();
        },
    }
</script>

<style lang="scss" scoped>
.home {
  box-sizing: border-box;
}
.el-col {
  border-radius: 4px;
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
.model_list{
  margin-top:20px;
}
.table_head{
  font-weight: bold;
}
.el-table td{
  text-align: center;
}
._dialog{
  width:90%;
}
// 分页器
.block {
  float: right;
  margin-top: 20px;
}
.control_btns{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.button_txt{
  border:none;
  background:none;
  outline:none;
  color:#17B3AC;
  text-align: center;
  cursor: pointer;
  word-wrap:break-word
}
// input框outline
/deep/ .el-input__inner:focus {
    border-color: #17B3A3;
}
</style>












<style>
  .el-table td, .el-table th{
    text-align: center !important;
  }
</style>