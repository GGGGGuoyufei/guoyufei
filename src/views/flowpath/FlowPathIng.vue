<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="工单名称" prop="name" >
        <el-input v-model="ruleForm.name" placeholder="工单名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="入职日期" required>
        <el-col :span="11" style="margin-right:0px">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center">转正日期</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择日期" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item> -->
      <el-form-item label="所属分类">
        <el-input type="textarea" v-model="ruleForm.categoryId" placeholder="工作内容"></el-input>
      </el-form-item>
      <el-form-item label="工单内容" >
        <el-input type="textarea" v-model="ruleForm.content" placeholder="工作成绩"></el-input>
      </el-form-item>
      <el-form-item>
        
        <el-button type="primary" @click="submitForm('ruleForm')">发起流程</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {addWork,deleteWork} from '../../servise/index'
export default {
  data() {
      return {
        ruleForm: {
          name: null,
          categoryId:null,
          content:null,
          assignee: null,
          procDefId: null
        },
        rules: {
          name: [
            { required: true, message: '请输入工单名称', trigger: 'blur' },
          ],
          
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写所属分类', trigger: 'blur' }
          ],
          workSuccess: [
            { required: true, message: '请填写工单内容', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addWork({
              name:this.ruleForm.name,
              categoryId:this.ruleForm.categoryId,
              content:this.ruleForm.content,
              assignee:this.ruleForm.assignee,
              procDefId:this.ruleForm.procDefId,
            }).then(res=>{
              if(res.code=='000000'){
                this.$message({
                message: "新增工单成功",
                type: "success"
                }),
                this.$router.push('/flowPath/myApply')
              }
            })
          } else {
            return false;
          }
        });
      },
      handleDelete(){
        
      }
    }
}
</script>

<style>

</style>