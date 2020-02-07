<template>
    <div>
        <el-form label-width="80px" :model="Create" :rules="rules" ref="Create">
            <el-form-item label="申请名称" prop="name">
                <el-input v-model="Create.name"></el-input>
            </el-form-item>
            <el-form-item label="申请内容">
                <el-input v-model="Create.content" rows="5" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="审批人" prop="assignee">
                <el-select v-model="Create.assignee" placeholder="请选择第一审批人" >
                    <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="Save()">保存并关闭</el-button>
                <el-button class="_targets" @click="$router.push('/flowPath/flowMag')">关闭</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { AddApply,GetDataByID,GetFirstPerson } from "@/servise"
    export default {
        name:"AddApply",
        data() {
            return {
                rules:{
                    name: [
                        { required: true, message: '请输入申请名称', trigger: 'blur' },
                    ],
                    assignee:[
                        { required: true, message: '请选择审批人', trigger: 'blur' },
                    ]
                },
                Create:{
                    name:null,
                    content:null,
                    assignee:null,
                },
                datas:{},
                procDefId:null,
                userList:[],
            }
        },
        methods: {
            Save(){
                this.$refs.Create.validate((valid) => {
                    if(valid){
                        const rLoading = this.openLoading();
                        AddApply({
                            name:this.Create.name,
                            content:this.Create.content,
                            procDefId:this.procDefId,
                            // categoryId:this.datas.categoryId,
                            categoryId:"0101",
                            assignee:this.Create.assignee
                        }).then(res => {
                            if(res.code === "000000"){
                                rLoading.close();
                                this.$message({
                                    message:"创建申请成功",
                                    type:"success"
                                })
                                this.$router.push("/flowPath/myApply");
                            }else{
                                rLoading.close();
                                this.$message.error("创建申请失败")
                            }
                        })
                    }else{
                        this.$message({
                            message:"请填写完整信息",
                            type:"warning"
                        })
                    }
                })
                
            },
            //开始根据ID获取数据
            StartGetID(){
                GetDataByID({
                    id:this.procDefId
                }).then(res => {
                    // console.log(res);
                    if(res.code === "000000"){
                        this.datas = res.data;
                    }
                })
            },
            //获取第一
            StartGetFirst(){
                GetFirstPerson({
                    procDefId:this.procDefId
                }).then(res => {
                    if(res.code === "000000"){
                        this.userList = res.data;
                    }
                })
            }
        },
        created() {
            var id = this.$route.params.id;
            this.procDefId = this.$route.params.id;
            this.StartGetID();
            this.StartGetFirst();
        },
    }
</script>

<style lang="scss" scoped>
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
</style>