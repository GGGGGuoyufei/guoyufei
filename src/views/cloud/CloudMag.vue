<template>
    <div>
        <!-- form表单操作 -->
        <el-row :gutter="10">
            <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                <el-input v-model="SearchName" placeholder="名称"></el-input>
                </div>
            </el-col>
            <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="grid-content bg-purple-light">
                <el-button class="btns" @click="SearchCloud()">账号查询</el-button>
                </div>
            </el-col>
            <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="grid-content bg-purple-light">
                <el-button type="primary" class="btns" @click="isShow = true,isChange = false">新增账号</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 展示区table -->
        <el-table
        class="user_list"
        :data="cloudList"
        :header-cell-style="{background:'#F5F7FA'}"
        border
        style="width: 100%"
        >
        <el-table-column prop="type" label="创建方式" width="180"></el-table-column>
        <el-table-column prop="accessKeyId" label="账号" width="180"></el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="180"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="delCloud(scope.$index, scope.row)">删除</el-button>
            <el-button type="warning" size="mini" @click="updateCloud(scope.$index,scope.row)">编辑</el-button>
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
        <el-dialog title="账号新增" :visible.sync="isShow" @close="Clear()" :destroy-on-close="true">
            <el-form :model="Create" :rules="rules" ref="Create">
                <el-form-item :label="Create.type=='VMWARE'?'用户':'AccessKeyId'" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="Create.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="Create.type=='VMWARE'?'密码':'AccessKeySecret'" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="Create.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="IP" :label-width="formLabelWidth" v-if="Create.type == 'VMWARE'" prop="IP">
                    <el-input v-model="Create.IP" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="Create.type" placeholder="请选择类型">
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
                <el-button type="primary" @click="addCloud()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {GetAllCloud,AddCloud,DelCloud,UpdateCloud, } from "@/servise"
    export default {
        name:"CloudMag",
        data() {
            return {
                rules:{
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    IP:[
                        { required: true, message: '请输入IP', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
                    ]
                },
                SearchName:null,//查询内容
                isShow:false,//dialog状态
                cloudList:[],//全部账号数据
                //分页器数据
                pageSize: 10,
                page: 1,
                total: 0,
                formLabelWidth:"140px",
                //新增数据
                Create:{
                    username:null,
                    password:null,
                    type:null,
                    IP:null
                },
                TimerID:"",//暂存ID
                isChange:false,//判断点击的按钮是添加还是编辑
                Types:[
                    {value:"ALIBABACLOUD",label:"阿里云"},
                    {value:"TENCENTCLOUD",label:"腾讯云"},
                    {value:"AWS",label:"aws"},
                    {value:"VMWARE",label:"vmware"},
                ]
            }
        },
        methods: {
            //新增账号
            addCloud(){
                var CreateCloud = {
                    accessKeyId:this.Create.username,
                    accessKeySecret: this.Create.password,
                    type: this.Create.type,
                    url:this.Create.IP,
                }
                this.$refs.Create.validate((valid) => {
                    if(valid){
                        if(this.Create.type != null){
                            const rLoading = this.openLoading();
                            if(!this.isChange){
                                AddCloud(CreateCloud).then(res => {
                                    if(res.code === "000000"){
                                        rLoading.close();
                                        this.StartGetCloud();
                                        this.isShow = false;
                                        this.Create.username="";
                                        this.Create.password="";
                                        this.Create.type="";
                                        this.$message({
                                            message:"新增账号成功",
                                            type:"success"
                                        })
                                    }else{
                                        rLoading.close();
                                        this.$message.error("新增账号失败")
                                    }
                                })
                            }else{
                                UpdateCloud(this.TimerID,{
                                    accessKeyId:this.Create.username,
                                    accessKeySecret: this.Create.password,
                                    type: this.Create.type
                                }).then(res => {
                                    if(res.code === "000000"){
                                        rLoading.close();
                                        this.$message({
                                            message:"修改成功",
                                            type:"success"
                                        })
                                        this.Create.username="";
                                        this.Create.password="";
                                        this.Create.type="";
                                        this.StartGetCloud();
                                        this.isChange = false;
                                        this.isShow = false;
                                    }else{
                                        rLoading.close();
                                        this.$message.error("修改失败")
                                    }
                                })
                            }
                        }else{
                            this.$message({
                                message:"请选择服务器类型",
                                type:"warning"
                            })
                        }
                    }else{
                        this.$message({
                            message:"请填写完整信息",
                            type:"warning"
                        })
                    }
                })
                
            },
            //查询账号
            SearchCloud(){
                const rLoading = this.openLoading();
                GetAllCloud({
                    current:1,
                    size:10,
                    type: "ALIBABACLOUD",
                    accessKeyId:this.SearchName
                }).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        if(res.data.records.length == 0){
                            this.cloudList = res.data.records;
                            this.$message("没有找到该用户");
                        }else{
                            this.cloudList = res.data.records;
                        }
                    }else{
                        rLoading.close();
                        this.$message.error("查询失败")
                    }
                })
            },
            //点击分页
            countChange(page){
                const rLoading = this.openLoading();
                GetAllCloud({
                    current: page,
                    size: this.pageSize
                }).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        this.cloudList = res.data.records;
                    }else{
                        rLoading.close();
                        this.$message({
                            message:"转入下一页失败",
                            type:"error"
                        })
                    }
                });
            },
            //删除账号
            delCloud(index,row){
                const rLoading = this.openLoading();
                DelCloud(row.id).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        this.StartGetCloud();
                        this.$message({
                            message:"账号删除成功",
                            type:"success"
                        })
                    }else{
                        rLoading.close();
                        this.$message.error("删除失败")
                    }
                })
            },
            //编辑账号
            updateCloud(index,row){
                this.isChange = true;
                this.isShow = true;
                this.TimerID = row.id;
                this.Create.username = row.accessKeyId;
                this.Create.IP = row.url;
                this.Create.type = row.type;
                if(row.type == "vmware"){
                    this.Create.type = "VMWARE";
                }
            },
            //开始获取全部账号
            StartGetCloud(){
                this.page = 1;
                const rLoading = this.openLoading();
                GetAllCloud({
                    current:1,
                    size:this.pageSize
                }).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        this.total = res.data.total;
                        this.cloudList = res.data.records;
                        this.cloudList.forEach((v,i) => {
                            v.createdTime = this.ChangeTime(v.createdTime);
                            if(v.type == "ALIBABACLOUD"){
                                v.type = "阿里云";
                            }else if(v.type == "TENCENTCLOUD"){
                                v.type = "腾讯云";
                            }else if(v.type == "AWS"){
                                v.type = "aws";
                            }else if(v.type == "VMWARE"){
                                v.type = "vmware";
                            }
                        })
                    }
                })
            },
            Clear(){
                this.Create.username = null;
                this.Create.IP = null;
                this.Create.type = null;
            }
        },
        created() {
            this.StartGetCloud();
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