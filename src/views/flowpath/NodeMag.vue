<template>
    <div class="node">
        <p class="node_title">流程节点设置</p>
        <div class="node_left">
            <div class="tip_1">
                <i class="el-icon-warning"></i>
                <span>当前选择编辑：</span>
                <span style="cursor: pointer">{{peloyed()}}</span>
            </div>
            <ul class="node_list">
                <li v-for="(item,key) in StartNode" :key="key" @click="changeKey(key,item.id)" :class="key == NowIndex?'_now':''">
                    <p>{{item.title[0]}}</p><p>{{item.title}}</p>
                </li>
            </ul>
        </div>
        <div class="node_right">
            <div class="tip_2">
                <i class="el-icon-warning"></i>
                <span>温馨提示：若流程运行至未分配审批人员的审批节点时，流程将自动中断取消</span>
            </div> 
             <!-- 节点内容 -->
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="节点名称">
                    <span style="font-weight:bold">{{NodeName}}</span>
                </el-form-item>
                <el-form-item label="节点类型">
                    <el-select v-model="form.region" :placeholder="NodeType()" disabled>
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审批人员" v-show="NowIndex != 0 && NowIndex != StartNode.length-1">
                    <el-checkbox-group v-model="SelectGroup">
                        <el-checkbox label="role" name="type" >
                            <i class="el-icon-s-custom"></i>根据角色选择
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="选择角色" v-show="RoleShow && NowIndex != 0 && NowIndex != StartNode.length-1">
                    <el-select v-model="Node.role" multiple placeholder="请选择">
                        <el-option
                        v-for="item in AllRole"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="Save()" :disabled="NowIndex == 0 || NowIndex == StartNode.length-1">保存并提交</el-button>
                    <el-button @click="closeGo()">关闭</el-button>
                </el-form-item>
            </el-form>
        </div> 
    </div>
</template>

<script>
import { GetNode,GetAllRole,NodeSave,GetDataByID } from "@/servise";
    export default {
        name:"NodeMag",
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                StartID:null,//进入页面拿到ID
                StartNode:[],//开始获取该ID下的节点
                NowIndex:0,
                NodeName:"",//节点名称
                AllRole:[],//全部角色
                //节点设置
                SelectGroup:[],
                Node:{
                    role:[],
                    nodeId:null,
                },
                RoleShow:false,//角色选择框隐藏/显示
            }
        },
        methods: {
            closeGo(){
                this.$router.push("/flowPath/flowMag")
            },
            //
            changeKey(key,id){
                //开始为空
                this.Node.role = [];
                this.RoleShow = false;
                this.SelectGroup = [];
                //
                this.NodeName = this.StartNode[key].title
                this.NowIndex = key;
                this.Node.nodeId = id;
                if(this.StartNode[key].roleIdList != null && this.StartNode[key].roleIdList.length != 0){
                    this.Node.role = this.StartNode[key].roleIdList
                    this.RoleShow = true;
                    this.SelectGroup = ["role"]
                }
            },
            //节点类型的PlaceHolder
            NodeType(){
                if(this.NowIndex == 0){
                    return "开始节点"
                }else if(this.NowIndex == this.StartNode.length-1){
                    return "结束节点"
                }else {
                    return "审批节点"
                }
            },
            //获取ID节点
            StartGetNode(){
                const rLoading = this.openLoading();
                GetNode(this.StartID).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        this.StartNode = res.data;
                        this.NodeName = this.StartNode[this.NowIndex].title;
                    }
                })
            },
            //获取全部角色
            StartGetRole(){
                const rLoading = this.openLoading();
                GetAllRole().then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        this.AllRole = res.data;
                    }
                })
            },
            //保存并提交
            Save(){
                let roleIds = "";
                this.Node.role.map((v,i) => {
                    if(i == this.Node.role.length-1){
                        roleIds += v;
                    }else{
                        roleIds += v+","
                    }
                })
                const rLoading = this.openLoading();
                NodeSave({
                    nodeId:this.Node.nodeId,
                    processId:this.StartID,
                    userIds:null,
                    roleIds:roleIds
                }).then(res => {
                    if(res.code === "000000"){
                        rLoading.close();
                        this.$message({
                            message:"关联成功,请转点击下一级审批关联",
                            type:"success"
                        })
                    }else{
                        rLoading.close();
                        this.$message({
                            message:"关联失败",
                            type:"error"
                        })
                    }
                })
            },
            //
            peloyed(){
                if(this.NowIndex == 0){
                    return "开始审批"
                }else if(this.NowIndex == this.StartNode.length-1){
                    return "结束审批"
                }else{
                    return this.NowIndex+"级审批"
                }
            }
        },
        created() {
            var id = this.$route.params.id;
            this.StartID = id;
            this.StartGetNode();
            this.StartGetRole();
        },
        watch: {
            SelectGroup:function(val){
                if(val.indexOf("role") != -1){
                    this.RoleShow = true;
                }else{
                    this.RoleShow = false;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
.node{
    width:100%;
    height:100%;
}
.node_title{
    height: 40px;
    line-height: 40px;
    border-bottom:2px solid #BFEAE6;
    color:#333;
    font-weight: bold;
    font-size: 20px;
    color:#17B3A3;
    box-sizing: border-box;
}
.node_left{
    width:350px;
    height: auto;
    float: left;
}
.tip_1{
    width:100%;
    height:35px;
    background:#E8F7F6;
    border-radius: 5px;
    border:1px solid #BFEAE6;
    margin-top:20px;
    padding-left: 20px;
    box-sizing: border-box;
    line-height: 35px;
    i{
        color:#17B3A3;
    }
    span{
        margin-left: 15px;
    }
    span:nth-child(3){
        color: #17B3A3;
        font-weight: bold;
    }
    span:last-of-type{
        color: #17B3A3;
    }
}
.node_list{
    margin-top:20px;
    padding-left: 20px;
    box-sizing: border-box;
    >li{
        width:100%;
        display: flex;
        height: 30px;
        align-items: center;
        cursor: pointer;
        >p:first-child{
            width:25px;
            height:25px;
            border-radius: 50%;
            background:#17B3A3;
            text-align: center;
            line-height: 25px;
            color:white;
        }
        >p:last-child{
            margin-left: 20px;
        }
    }
    >li:hover{
        background:#E8F7F6;
    }
    >li:first-of-type{
        >p:first-child{
            // background:#47CB89;
            background:#FF006E;
        }
    }
    >li:last-of-type{
        >p:first-child{
            background:#999999;
        }
    }
}
._now{
    background:#E8F7F6 !important;
}
.node_right{
    float: left;
    margin-left: 20px;
    width:500px;
}
.tip_2{
    width:100%;
    height:auto;
    padding:10px 16px;
    background:#FFF9E6;
    border-radius: 5px;
    border:1px solid #FF9900;
    margin-top:20px;
    padding-left: 20px;
    box-sizing: border-box;
    line-height: 20px;
    display: flex;
    i{
        color:#FF9900;
        line-height: 20px;
    }
    span{
        margin-left: 15px;
        color:#515A81;
    }
}
/deep/ .el-form-item{
    margin-bottom:10px !important;
}
</style>