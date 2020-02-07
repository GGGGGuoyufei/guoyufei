<template>
    <div class="host">
        <el-row :gutter="15" type="flex" style="flex-wrap: wrap">
            <el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="11" class="getHeight">
                <div class="grid-content bg-purple-light host_msg">
                    <img src="@/assets/control/dark.png" alt="" style="margin:0 auto;display:block;margin-top:20px;" width="70px" height="70px">
                    <p class="title">A_CentOS6.5_HN1</p>
                    <div class="icons">
                        <i class="el-icon-setting"></i>
                        <i class="el-icon-video-play"></i>
                        <i class="el-icon-video-pause"></i>
                    </div>
                    <p class="description">主机描述</p>
                    <p class="description_msg">A_CentOS6.5_HN1</p>
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
                            <p>172.18.11.166</p>
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
            <el-col :xs="24" :sm="16" :md="16" :lg="13" :xl="11" class="getHeight">
                <div class="grid-content bg-purple main_box">
                    <el-row :gutter="10" class="list_main">
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
                            <div class="grid-content bg-purple main_msg">
                                <p><i class="el-icon-monitor"></i></p>
                                <div>
                                    <p>主机信息</p>
                                    <p>实例ID：i-94xz46ek4</p>
                                    <p>创建时间：2016-08-22 11:20</p>
                                    <p>到期时间：2020-01-23 00:00</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
                            <div class="grid-content bg-purple main_msg">
                                <p><i class="el-icon-lightning"></i></p>
                                <div>
                                    <p>主机Agent</p>
                                    <p>Agent状态：<span style="color:#46C017">运行中</span></p>
                                    <p>当前版本：3.8 最新：3.8</p>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" class="list_main">
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
                            <div class="grid-content bg-purple main_msg">
                                <p><i class="el-icon-odometer"></i></p>
                                <div>
                                    <p>网络信息</p>
                                    <p>所属网络：专有网络@华南 1</p>
                                    <p>安全组规则：共1条规则</p>
                                    <p style="color:#439EDF;cursor: pointer">查看所属网络 查看本机规则</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
                            <div class="grid-content bg-purple main_msg">
                                <p><i class="el-icon-data-analysis"></i></p>
                                <div>
                                    <p>监控信息</p>
                                    <p>监控项：19个</p>
                                    <p>告警消息：0笔</p>
                                    <p style="color:#439EDF;cursor: pointer" @click="Monitor()">查看监控概览</p>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" class="list_main">
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
                            <div class="grid-content bg-purple main_msg">
                                <p><i class="el-icon-document-add"></i></p>
                                <div>
                                    <p>体检结果</p>
                                    <p>体检结果：<span style="color:red">2</span>项严重问题，<span style="color:#F6B54C">2</span>项一般问题</p>
                                    <p>体检时间： 2019-12-31 00:00</p>
                                    <p style="color:#439EDF;cursor: pointer">查看体检报告</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
                            <div class="grid-content bg-purple main_msg">
                                <p><i class="el-icon-data-line"></i></p>
                                <div>
                                    <p>成本分析</p>
                                    <p>成本评估：269.7元/月</p>
                                    <p>优化建议：<span style="color:#F6B54C">2</span> 条建议，可节省<span style="color:#46C017">69.98元/月</span></p>
                                    <p style="color:#439EDF;cursor: pointer">查看成本分析</p>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" class="list_main">
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
                            <div class="grid-content bg-purple main_msg">
                                <p><i class="el-icon-s-promotion"></i></p>
                                <div>
                                    <p>运维策略</p>
                                    <p>关联策略：演示策略</p>
                                    <p>关联子策略：默认策略</p>
                                    <p style="color:#439EDF;cursor: pointer">查看运维策略</p>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="24">
                            <div class="grid-content bg-purple main_msg">
                                <p><i class="el-icon-money"></i></p>
                                <div>
                                    <p>快照策略</p>
                                    <p>关联策略：默认快照策略</p>
                                    <p>最新备份：2019-12-30 03:00</p>
                                    <p style="color:#439EDF;cursor: pointer">查看最新快照策略 手动创建快照策略</p>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="1" class="getHeight">
                <div class="grid-content bg-purple-light host_msg">
                    <p>主机标签</p>
                    <ul class="tages">
                        <li>
                            <i class="el-icon-price-tag"></i>
                            <p>Web</p>
                        </li>
                        <li>
                            <i class="el-icon-price-tag"></i>
                            <p>Web</p>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from "axios"
    export default {
        name:"HostMessage",
        data() {
            return {
                screenWidth: '',
                screenHeight: ''
            }
        },
        methods: {
            Monitor(){
                // this.$router.push(`/control/monitor/${}`)
                this.$router.push(`/control/monitor/001`)
            }
        },
        created() {
            console.log(this.$route);
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
.main_box{
    padding:0 10px;
    box-sizing: border-box;
    margin-bottom:10px;
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
.list_main{
    border-bottom: 1px dashed #E6E6E6;
}
.main_msg{
    display: flex;
    padding:8px 0;
    border:none;
    >p{
        font-size: 25px;
        color:#51B1F6;
        margin-top:5px;
        >i{
            border-radius: 50%;
            border:1.5px solid #51B1F6;
            padding:4px;
        }
    }
    >div{
        margin-left:10px;
    }
    >div p{
        color:#999999;
        font-size: 12px;
        margin-top:8px;
    }
    >div p:first-of-type{
        color:#333;
        font-size: 16px;
    }
}
.tages{
    display: flex;
    padding:10px;
    // justify-content: space-around;
    flex-wrap: wrap;
    box-sizing: border-box;
    li{
        display: flex;
        width:80px;
        margin-right:15px;
        i{
            width:25%;
            background:pink;
            display: flex;
            color:#FD7C6E;
            justify-content: center;
            align-items: center;
        }
        p{
            padding-left:5px;
            box-sizing: border-box;
            box-shadow: 1px 1px 2px rgba(0,0,0,.1);
            flex:1;
        }
    }
}
</style>
