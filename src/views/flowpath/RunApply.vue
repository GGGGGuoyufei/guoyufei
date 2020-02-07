<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="grid-content bg-purple">
          <el-input v-model="SearchName" placeholder="实例ID"></el-input>
        </div>
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="grid-content bg-purple">
          <el-input v-model="SearchMake" placeholder="定义Key"></el-input>
        </div>
      </el-col>
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
        <div class="grid-content bg-purple-light">
          <el-button type="primary" class="btns" @click="SearchOrder()">查询</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 展示区table -->
    <el-table
      class="user_list"
      :data="tableData"
      :header-cell-style="{background:'#F5F7FA'}"
      border
      style="width: 100%"
    >
      <el-table-column prop="caseId" label="实例ID" ></el-table-column>
      <el-table-column prop="defineKey" label="定义Key"></el-table-column>
      <el-table-column prop="defineId" label="定义ID" ></el-table-column>
      <el-table-column prop="name" label="流程名称" ></el-table-column>
      <el-table-column prop="current" label="当前环节"></el-table-column>
      <el-table-column prop="await" label="是否挂起" ></el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template>
          <el-button type="text" @click="delItem">删除</el-button>
          <el-button type="primary" size="mini" @click="watchImg()">查看流程图</el-button>
        </template>
      </el-table-column>
    </el-table>
     <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
  </div>
  </div>
</template>

<script>

export default {
  name: "RunApply",
  data() {
    return {
      SearchName:null,//查询内容
      SearchMake:null,//查询标识
      orderList:[],//工单列表
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      tableData:[
        {
          caseId:12345,
          defineKey:'correctionprocess',
          defineId:'1115',
          name:'转正申请审批',
          mark:'correctionprocess',
          current:'部门经理审批',
          await:'否'
        }
      ]
    };
  },
  created(){
    
  },
  
  methods: {
    //查询
    SearchOrder(){

    },
    //删除
    delOrder(){

    },
    //查看流程图
    watchImg(path){
      this.$router.push('/flowPath/workImgFlowPath')
    },
    handleSizeChange(val) {
        
    },
    handleCurrentChange(val) {
      
    },
    delItem(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
};
</script>

<style scoped lang="scss">
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

