<template>
    <div>
        <el-row :gutter="10">
            <!-- 选择服务器类型,默认：阿里巴巴 -->
            <el-col :xs="10" :sm="10" :md="5" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                <el-select v-model="SelectType" placeholder="默认服务器：阿里云" @change="ChangeType()">
                    <el-option
                    v-for="item in Types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                </div>
            </el-col>
        </el-row>   
        <!-- 展示区table -->
        <el-table
        class="user_list"
        :data="List"
        :header-cell-style="{background:'#F5F7FA'}"
        border
        style="width: 100%"
        >
            <el-table-column label="名称" width="200" prop="name">
                <template slot-scope="scope" >
                    <div style="display:flex;align-items:center;cursor: pointer" @click="ToHostDetail(scope.$index,scope.row)">
                        <img src="@/assets/control/web.png" alt="" width="30px" height="30px">
                        <span style="margin-left:10px">{{scope.row.name}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="IP1" label="公网IP" width="220"></el-table-column>
            <el-table-column prop="privateIp" label="内网IP" width="220"></el-table-column>
            <el-table-column label="接入方式" width="200" prop="name">
                <template slot-scope="scope" >
                    <div style="display:flex;align-items:center;cursor: pointer" @click="isShow = true">
                        <img src="@/assets/control/disk.png" alt="" width="20px" height="20px">
                        <el-link type="primary" style="margin-left:10px" :underline="false">{{scope.row.name}}</el-link>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="expiredTime" label="过期时间"></el-table-column>
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
        <!-- 点击桌面 -->
        <el-dialog :visible.sync="isShow" title="访问主机">
            <el-row :gutter="10">
                <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="4">
                    <div class="grid-content bg-purple alog">
                        <img src="@/assets/control/dark.png" alt="" style="margin:0 auto;display:block;" width="70px" height="70px">
                        <p style="text-align:center;margin:15px 0;">A_CentOS6.5_HN1</p>
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="主机IP：">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="端口：">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-form>
                        
                    </div>
                </el-col>
                <el-col :xs="10" :sm="14" :md="14" :lg="14" :xl="4">
                    <div class="grid-content bg-purple alog" style="border:none">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="用户名：">
                                <el-select v-model="SelectType" placeholder="默认服务器：阿里云" @change="ChangeType()">
                                    <el-option
                                    v-for="item in Types"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="用户名：">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码：">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row> 
            <el-form style="display:flex;justify-content: flex-end">
                <el-form-item>
                    <el-button>取消</el-button>
                    <el-button type="primary">确定</el-button>
                </el-form-item>
            </el-form>  
        </el-dialog>
    </div>
</template>

<script>
    import { AccTypeGetHost, } from "@/servise"
    export default {
        name:"CloudHost",
        data() {
            return {
                //全部服务器类型
                Types:[
                    {value:"ALIBABACLOUD",label:"阿里云"},
                    {value:"TENCENTCLOUD",label:"腾讯云"},
                    {value:"AWS",label:"aws"},
                    {value:"VMWARE",label:"vmware"},
                ],
                //当前选择的服务器类型
                SelectType:"ALIBABACLOUD",            
                //分页器数据
                pageSize: 10,
                page: 1,
                total: 0,
                HostList:[],//开始获取全部主机数据Table
                List:[],//分页用的数据
                isShow:false,//打开桌面的Dialog框状态
                form:{
                    name:"",
                }
            }
        },
        methods: {
            //开始获取全部主机信息
            StartGetHost(){
                const rLoading = this.openLoading();
                AccTypeGetHost({
                    cloudType:this.SelectType
                }).then(res => {
                    console.log(res);
                    if(res.code === "000000"){
                        this.HostList = res.data;
                        this.total = res.data.length;
                        this.countChange();
                        rLoading.close();
                    }else{
                        rLoading.close();
                        this.$message.error("获取主机信息失败")
                    }
                })
            },
            //当服务器类型改变时
            ChangeType(){
                this.StartGetHost();
            },
            countChange(page){
                this.List = this.HostList.slice((this.page - 1)*this.pageSize,this.page * this.pageSize);
            },
            ToHostDetail(index,scoped){
                // this.$store.commit("SaveHostID",scoped);
                localStorage.setItem("HostMsg",JSON.stringify(scoped));
                this.$router.push(`/cloud/hostdetail`)
            }
        },
        created() {
            this.StartGetHost();
        },
    }
</script>

<style lang="scss" scoped>
.el-col {
  border-radius: 4px;
}
// .bg-purple-dark {
//   background: #99a9bf;
// }
// .bg-purple {
//   background: #d3dce6;
// }
// .bg-purple-light {
//   background: #e5e9f2;
// }
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  
}
.block{
    float: right;
    margin-top: 20px;
}
.user_list{
    margin-top:20px;
}
.alog{
    padding:15px;
    box-sizing: border-box;
    border-right: 1px dashed gainsboro;
}
</style>
