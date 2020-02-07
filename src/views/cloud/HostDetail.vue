<template>
    <div>
        <el-row :gutter="15">
            <el-col :xs="20" :sm="12" :md="10" :lg="7" :xl="11" class="getHeight">
                <div class="grid-content bg-purple-light host_msg">
                    <img src="@/assets/control/dark.png" alt="" style="margin:0 auto;display:block;margin-top:20px;" width="70px" height="70px">
                    <p class="title">{{HostData.name}}</p>
                    <div class="icons">
                        <i class="el-icon-setting trol" style="cursor: pointer;" title="重置密码" @click="isShow = true"></i>
                        <i class="el-icon-video-play trol" title="开机" style="cursor: pointer;" @click="OpenHost()"></i>
                        <i class="el-icon-video-pause trol" title="关机" style="cursor: pointer;" @click="CloseHost()"></i>
                        <i class="el-icon-refresh trol" title="重启" style="cursor: pointer;" @click="reStart()"></i>
                    </div>
                    <p class="description">主机描述</p>
                    <p class="description_msg">{{HostData.name}} 
                        <span class="_status" :style="{color:Color}">{{Status()}}</span>
                    </p>
                    <p class="description">实力配置</p>
                    <ul class="config">
                        <li>
                            <div>
                                <img src="@/assets/control/shili.png" alt="">
                                <p>实例：</p>
                            </div>
                            <p>2核4G<span style="color:#999999;">（共享计算型n1）</span></p>
                        </li>
                        <li>
                            <div>
                                <img src="@/assets/control/neiwang.png" alt="">
                                <p>内网IP：</p>
                            </div>
                            <p>{{HostData.privateIp}}</p>
                        </li>
                        <li>
                            <div>
                                <img src="@/assets/control/gongwang.png" alt="">
                                <p>公网IP：</p>
                            </div>
                            <p>120.76.126.93</p>
                        </li>
                        <li>
                            <div>
                                <img src="@/assets/control/cipan.png" alt="">
                                <p>磁盘：</p>
                            </div>
                            <p style="color:#439FE0">共一块磁盘</p>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <!-- Dialog修改密码框 -->
        <el-dialog title="修改密码" :visible.sync="isShow">
            <el-form :model="Create">
                <el-form-item label="账 号" :label-width="formLabelWidth">
                    <el-input v-model="Create.username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="密 码" :label-width="formLabelWidth">
                    <el-input v-model="Create.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="changePass">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { AccIDGetHost, CloseHost, OpenHost, ChangePass, Restart} from "@/servise"
    export default {
        name:"HostDetail",
        data() {
            return {
                HostData:null,
                isShow:false, //dialog修改密码状态框
                Create:{
                    username:null,
                    password:"",
                },
                formLabelWidth:"100px",
                Color:null,
            }
        },
        methods: {
            //开始判断状态
            Status(){
                if(this.HostData.status == "Stopping"){
                    this.Color = "goldenrod";
                    return "关机状态"
                }else if(this.HostData.status == "Running"){
                    this.Color = "green";
                    return "开机状态"
                }else{
                    return "主机错误"
                }
            },
            //获取当前主机信息
            getHostMsg(){
                const rLoading = this.openLoading();
                AccIDGetHost({
                    cloudType:this.HostData.cloudType,
                    instanceId:this.HostData.instanceId,
                    regionId:this.HostData.regionId
                }).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        localStorage.setItem("HostMsg",JSON.stringify(res.data));
                        this.HostData = JSON.parse(localStorage.getItem("HostMsg"))
                    }
                })
            },
            //开机
            OpenHost(){
                if(this.HostData.status === "Running"){
                    this.$message.warning("该主机目前为开机状态，无需重复开机")
                }else{
                    this.$confirm('请确认是否开启该主机', '操作', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const rLoading = this.openLoading();
                        OpenHost({
                            cloudType:this.HostData.cloudType,
                            instanceId:this.HostData.instanceId,
                            regionId:this.HostData.regionId
                        }).then(res => {
                            if(res.code === "000000"){
                                setTimeout(() => {
                                    this.getHostMsg();
                                    rLoading.close();
                                    this.$message({
                                        type: 'success',
                                        message: '开机成功!'
                                    });
                                }, 8000);
                            }else{
                                rLoading.close();
                                this.$message.error("开机失败")
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消启动'
                        });          
                    });
                }
                
            },
            //关机
            CloseHost(){
                if(this.HostData.status === "Stopping"){
                    this.$message.warning("该主机目前为关机状态，无需重复关机")
                }else{
                    this.$confirm('请确认是否关闭该主机', '操作', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const rLoading = this.openLoading();
                        CloseHost({
                            instanceId:this.HostData.instanceId,
                            cloudType:this.HostData.cloudType,
                            regionId:this.HostData.regionId
                        }).then(res => {
                            if(res.code === "000000"){
                                setTimeout(() => {
                                    this.getHostMsg();
                                    rLoading.close();
                                    this.$message.success("关机成功");
                                }, 8000);
                            }else{
                                rLoading.close();
                                this.$message.error("关机失败")
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消关机'
                        });          
                    });
                }
            },
            //重置密码
            changePass(){
                const rLoading = this.openLoading();
                ChangePass({
                    cloudType:this.HostData.cloudType,
                    instanceId:this.HostData.instanceId,
                    regionId:this.HostData.regionId,
                    password:this.Create.password
                }).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        this.$message.success("修改成功，请重新启动主机")
                        this.isShow = false;
                    }else{
                        rLoading.close();
                        this.$message.error("修改失败")
                    }
                })
            },
            //重启
            reStart(){
                if(this.HostData.status === "Stopping"){
                    this.$message.warning("该主机目前为关机状态，无法重新启动")
                }else{
                    this.$confirm('请确认是否重新启动该主机', '操作', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const rLoading = this.openLoading();
                        Restart({
                            cloudType:this.HostData.cloudType,
                            instanceId:this.HostData.instanceId,
                            regionId:this.HostData.regionId,
                        }).then(res => {
                            if(res.code === "000000"){
                                this.getHostMsg();
                                rLoading.close();
                                this.$message.success("重新启动成功")
                            }else{
                                rLoading.close();
                                this.$message.error("重新启动失败")
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消重启'
                        });          
                    });
                }
            }
        },
        created() {
            this.HostData = JSON.parse(localStorage.getItem("HostMsg")) || {};
            this.Create.username = this.HostData.name
        },
    }
</script>

<style lang="scss" scoped>
.getHeight{
    margin-bottom:15px;
}
.getHeight>.grid-content{
    min-height: 50px;
}
  .grid-content {
    // border-radius: 4px;
    min-height: 36px;
    height: 100%;
    border:1px solid #DBDBDB;
  }
.title{
    font-size: 20px;
    text-align: center;
    margin-top: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    
}  
.icons{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    margin-top:10px;
    i{
        padding:5px 10px;
        border:1px solid #CCCCCC;
        color:#CCCCCC;
        border-right:none;
    }
    i:last-of-type{
        border-right:1px solid #CCCCCC;
        border-radius: 0 5px 5px 0;
    }
    i:first-of-type{
        border-radius: 5px 0 0 5px;
    }
}
.description{
    font-size: 16px;
}
.host_msg{
    padding:15px;
    box-sizing: border-box;
}
.description_msg{
    font-size: 12px;
    color:#999999;
    text-indent: 24px;
    padding:10px 0; 
}
.config>li{
    display: flex;
    color:#333;
    margin-top:10px;
    margin-left: 10px;
    >div{
        display: flex;
        width:80px;
        img{
            width:20px;
            height:18px;
        }
        p{
            font-size: 12px;
            margin-left:10px;
        }
    }
    >p{
        font-size: 12px;
    }
}
.trol:hover{
    transform: scale(1.05);
    box-shadow: 0 0 1px 1px #aaa;
}
._status{
    font-size: 15px;
    margin-left:10px;
    // color:goldenrod;
    // color:green;
}
</style>