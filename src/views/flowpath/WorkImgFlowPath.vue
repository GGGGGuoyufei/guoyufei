<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" disabled label-width="100px" class="demo-ruleForm">
      <el-form-item label="申请岗位" prop="name" >
        <el-input v-model="ruleForm.name" ></el-input>
      </el-form-item>
      <el-form-item label="入职日期">
        <el-col :span="11" style="margin-right:0px">
          <el-form-item prop="date1">
            <el-date-picker type="date" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center">转正日期</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="工作内容" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="工作成绩" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
    </el-form>
    <div class="path-image">
      <h1>流程图</h1>
      <img src="https://demo.renren.io/security-enterprise-server/act/his/getInstImage?token=a571f670591366ee43961454c8e59d31&processInstanceId=1258" alt="">
      <el-table
      class="user_list"
      :data="tableData"
      :header-cell-style="{background:'#F5F7FA'}"
      border
      style="width: 100%"
      >
        <el-table-column prop="name" label="任务名称" ></el-table-column>
        <el-table-column prop="managePerson" label="处理人"></el-table-column>
        <el-table-column prop="startTime" label="任务开始时间" ></el-table-column>
        <el-table-column prop="endTime" label="任务结束时间" ></el-table-column>
        <el-table-column prop="opinion" label="审核意见"></el-table-column>
        <el-table-column prop="taskTime" label="任务时长（秒）" ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
        ruleForm: {
          name: null,
          region: null,
          date1: null,
          date2: null,
          delivery: false,
          type: [],
          resource: null,
          desc: null
        },
        tableData:[
        {
          name:'主管审批',
          managePerson:'1067246875800000001',
          startTime:'2019-10-29 09:35:49',
          endTime:'2019-10-29 09:36:09',
          opinion:'没有',
          taskTime:10
        }
      ]
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style lang="scss" scoped>
   .path-image{
     border: 1px solid grey;
     padding: 20px;
     h1{
       font-size: 28px;
     }
     img{
       width: 500px;
       margin-left: 176px;
     }
   }
</style>