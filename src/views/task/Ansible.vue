<template>
    <div>
        <!-- form表单操作 -->
        <el-row :gutter="10">
            <el-col :xs="10" :sm="7" :md="5" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                <el-input v-model="SearchIP" placeholder="请输入IP"></el-input>
                </div>
            </el-col>
            <el-col :xs="10" :sm="7" :md="5" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                    <el-select v-model="SearchType" placeholder="请选择服务器类型">
                        <el-option
                        v-for="item in TypesSearch"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :xs="6" :sm="5" :md="4" :lg="3" :xl="3">
                <div class="grid-content bg-purple-light">
                <el-button class="btns" @click="SearchAnsible()">Ansible查询</el-button>
                </div>
            </el-col>
            <el-col :xs="6" :sm="5" :md="4" :lg="3" :xl="3">
                <div class="grid-content bg-purple-light">
                <el-button type="primary btns" @click="NewBtn()">新增Ansible</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 展示区table -->
        <el-table
        class="user_list"
        :data="ansibleList"
        :header-cell-style="{background:'#F5F7FA'}"
        border
        style="width: 100%"
        >
        <el-table-column prop="ip" label="IP" width="200"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="250"></el-table-column>
        <el-table-column prop="password" label="密码" width="250"></el-table-column>
        <el-table-column prop="serverTypeName" label="创建方式" width="300"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="delAnsible(scope.$index, scope.row)">删除</el-button>
            <el-button type="warning" size="mini" @click="UpdateBtn(scope.$index,scope.row)">编辑</el-button>
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
        <!-- 新增Dialog -->
        <el-dialog title="账号新增" :visible.sync="isShow">
            <el-form :model="Create">
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="Create.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="Create.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="IP" :label-width="formLabelWidth">
                    <el-input v-model="Create.IP" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="端口" :label-width="formLabelWidth">
                    <el-input v-model="Create.port" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="Create.type" placeholder="请选择服务器类型">
                        <el-option
                        v-for="item in Types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="addAnsible()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getAllAnsible, addAnsible, delAnsible, aa} from "@/servise"
    export default {
        name:"Ansible",
        data() {
            return {
                SearchIP:null,//查询IP
                SearchType:null,//查询服务器类型
                isShow:false,//dialog状态
                ansibleList:[],//全部服务器数据
                //分页器数据
                pageSize: 10,
                page: 1,
                total: 0,
                formLabelWidth:"120px",
                //新增数据
                Create:{
                    username:null,
                    password:null,
                    type:null,
                    IP:null,
                    port:null,
                },
                TimerID:"",//暂存ID
                isChange:false,//判断点击的按钮是添加还是编辑
                Types:[
                    {value:"ALIBABACLOUD",label:"阿里云"},
                    {value:"TENCENTCLOUD",label:"腾讯云"},
                    {value:"AWS",label:"aws"},
                    {value:"VMWARE",label:"vmware"},
                    {value:"OTHER",label:"其他"},
                ],
                TypesSearch:[
                    {value:"",label:"全部类型"},
                    {value:"ALIBABACLOUD",label:"阿里云"},
                    {value:"TENCENTCLOUD",label:"腾讯云"},
                    {value:"AWS",label:"aws"},
                    {value:"VMWARE",label:"vmware"},
                    {value:"OTHER",label:"其他"},
                ]
            }
        },
        methods: {
            //开始获取全部ansible服务器
            StartGetAll(){
                const rLoading = this.openLoading();
                this.page = 1;
                getAllAnsible({
                    pageNumber:1,
                    pageSize:this.pageSize,
                }).then(res => {
                    console.log(res);
                    if(res.code === "000000"){
                        rLoading.close();
                        this.ansibleList = res.data.records;
                    }
                })
            },
            //点击新增按钮
            NewBtn(){
                this.isShow = true;
                this.isChange = false;
            },
            //点击编辑按钮
            UpdateBtn(index,scoped){
                this.TimerID = scoped.id;
                this.isShow = true;
                this.isChange = true;
                //编辑首先赋值
                this.Create.IP = scoped.ip;
                this.Create.password = scoped.password;
                this.Create.port = scoped.port;
                this.Create.type = scoped.serverType;
                this.Create.username = scoped.userName;
            },
            //新增ansible服务器
            addAnsible(){
                const rLoading = this.openLoading();
                if(!this.isChange){
                    addAnsible({
                        id:null,
                        ip:this.Create.IP,
                        password:this.Create.password,
                        port:this.Create.port,
                        serverType:this.Create.type,
                        userName:this.Create.username,
                    }).then(res => {
                        if(res.code === "000000"){
                            rLoading.close();
                            this.$message({
                                message:"添加成功",
                                type:"success"
                            })
                            this.isShow = false;
                            this.StartGetAll();
                            this.Clear();
                        }else{
                            rLoading.close();
                            this.$message.error("添加失败")
                        }
                    })
                }else{
                    addAnsible({
                        id:this.TimerID,
                        ip:this.Create.IP,
                        password:this.Create.password,
                        port:this.Create.port,
                        serverType:this.Create.type,
                        userName:this.Create.username,
                    }).then(res => {
                        console.log(res);
                        let _this = res.data;
                        let _err = res.mesg;
                        if(res.code === "000000"){
                            rLoading.close();
                            this.$message({
                                message:"修改成功",
                                type:"success"
                            })
                            this.isShow = false;
                            this.StartGetAll();
                            this.Clear();
                        }else{
                            rLoading.close();
                            this.$message.error("修改失败")
                        }
                    })
                }
            },
            //删除Ansible
            delAnsible(index,scoped){
                const rLoading = this.openLoading();
                delAnsible({id:scoped.id}).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        this.$message({
                            message:"删除成功",
                            type:"success"
                        })
                        this.StartGetAll();
                    }else{
                        rLoading.close();
                        this.$message.error("删除失败");
                    }
                })
            },
            // 搜索Ansible
            SearchAnsible(){
                const rLoading = this.openLoading();
                this.page = 1;
                getAllAnsible({
                    pageNumber:1,
                    pageSize:this.pageSize,
                    ip:this.SearchIP,
                    serverType:this.SearchType
                }).then(res => {
                    console.log(res);
                    if(res.code === "000000"){
                        rLoading.close();
                        this.$message({
                            message:"查询成功",
                            type:"success"
                        })
                        this.ansibleList = res.data.records;
                    }else{
                        rLoading.close();
                        this.$message.error("查询失败")
                    }
                })
            },
            //清空一切输入框
            Clear(){
                this.Create.IP = null;
                this.Create.password = null;
                this.Create.port = null;
                this.Create.type = null;
                this.Create.username = null;
            }
        },

        created() {
            this.StartGetAll();
        },
    }
</script>

<style lang="scss" scoped>
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
  margin-bottom:10px;
}
//按钮
.btns {
  width: 100%;
  // text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: hidden;
}
.add {
  background: #17b3a3;
  color: white;
  border: 1px solid #17b3a3;
}
.add:hover {
  background: #17b3a3;
}
.user_list{
    margin-top:20px;
}
.block{
    float: right;
    margin-top: 20px;
}
.menutree{
  margin-top:7px;
}
.treebox{
  display: flex;
  // justify-content: space-between;
  .el-form-item{
    width:50%;
  }
}
.hide{
  display: none;
}
</style>