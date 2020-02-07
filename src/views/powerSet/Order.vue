<template>    
  <div> 
    <el-row :gutter="10">
      <el-col :xs="16" :sm="7" :md="6" :lg="5" :xl="5">
        <div class="grid-content bg-purple">
         <el-input v-model="SearchText" placeholder="用户组名称"></el-input>
        </div>
      </el-col>
      <el-col :xs="8" :sm="5" :md="4" :lg="3" :xl="5">
        <div class="grid-content bg-purple-light">
          <el-button class="btns"  @click="searchGroup">查询</el-button>
        </div>
      </el-col>
      <el-col :xs="8" :sm="5" :md="4" :lg="3" :xl="5">
        <div class="grid-content bg-purple-light">
          <el-button type="primary" class="btns"  @click="addGroup">新增</el-button>
        </div>
      </el-col>
    </el-row>     
    <div class="container">            
      <el-dialog title="新增组织" :destroy-on-close="true" :visible.sync="dialogFormVisible">            
        <el-form :model="form" :rules="rules" ref="numberValidateForm">                
          <el-form-item label="名称" prop="name">                
              <el-input v-model="form.name"  autocomplete="off"></el-input>                
          </el-form-item>                
          <el-form-item label="描述" >                
              <el-input v-model="form.description" type="textarea" autocomplete="off"></el-input>                
          </el-form-item>               
          <el-form-item label="所属组织">
            <el-cascader
              v-model="groupValue"
              :options="groupTablate"
              :show-all-levels="false"
              :props="{ checkStrictly: true,value:'id',label:'name' }"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>            
        <div slot="footer"  class="dialog-footer">                
          <el-button @click="dialogFormVisible = false">取 消</el-button>                
          <el-button class="addGroup" type="primary" @click="successAjax('numberValidateForm')">确 定</el-button>           
        </div>           
      </el-dialog> 
      <el-table 
       :data="groupTablate" style="width: 100%;margin:20px 0px 20px 0px;"
       :header-cell-style="{background:'#F5F7FA'}"
       row-key="id" border
       :tree-props="{children: 'children',  hasChildren: 'hasChildren'}">
        <el-table-column prop="name" width="200"  label="名称"></el-table-column>                
        <el-table-column prop="id" label="id" width="200"></el-table-column>   
        <el-table-column prop="description" label="描述" width="600"></el-table-column>                            
        <el-table-column label="操作" align="center" fixed="right" min-width="150">                      
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="warning" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>             
        </el-table-column>            
      </el-table>                       
      <!-- 编辑弹出框 -->            
      <el-dialog title="编辑" :destroy-on-close="true" :visible.sync="editVisible"  width="30%">                
        <el-form ref="edit" :rules="rules" :model="edit"  label-width="70px">                    
          <el-form-item label="名称" prop="name">                        
              <el-input v-model="edit.name"></el-input>                    
          </el-form-item>                    
          <el-form-item label="描述">                        
              <el-input type="textarea" v-model="edit.description"></el-input>                    
          </el-form-item>   
        </el-form>                
        <span slot="footer"  class="dialog-footer">                    
          <el-button @click="editVisible = false">取 消</el-button>                    
          <el-button class="addGroup" type="primary"  @click="saveEdit('edit')">确 定</el-button>                
        </span>            
      </el-dialog> 
    </div>    
  </div>                             
</template>
<script>
import {
  getUserGroup,
  increaseGroup,
  UpdateGroup,
  DeleteGroup,
  SearchGroup,
  getGroupAll
  }from '@/servise/index'
let gloRow = null
export default {
  data() {
    return {
      groupTablate: [],//表格
      editVisible: false,//编辑的dialog
      //分页器
      pageSize: 10,
      page: null,
      total: null,
      dialogFormVisible: false,//新增的dialog
      form: {//新增组织的form表单
        name: null,
        description: null,
        parentId: null
      },
      formLabelWidth: '120px',//表单的宽
      edit: {//编辑的form表单
        name: null,
        description: null,
        parentId: 0
      },
      SearchText :null,//搜索内容
      rules: {//新增时表单验证
        name: [
          { required: true, message: '请输入组织名称', trigger: 'blur' },
          { min: 3, max: 7, message: '组织名称长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      Treedata:[  //组织树  
      ],
      defaultProps: {//组织树的默认值
        children: 'children',
        label: 'name'
      },
      groupValue:null,
    }
  },
  created(){
    //获取组织树api
    this.getGroupAllApi()
  },
  
  methods:{
  //获取组织树
  getGroupAllApi(){
    const rLoading = this.openLoading();
    getGroupAll(
    ).then(res=>{
      if(res.code === '000000'){
        rLoading.close();
        this.groupTablate = res.data
        this.Treedata = res.data
      }else{
        rLoading.close();
        this.$message.error("网络异常，请稍后重试")
      }
    })
  },
    //新增
    addGroup(){
      this.dialogFormVisible=true; 
    },
    //点击添加成功的回调
    successAjax(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.groupValue === null){
            const rLoading = this.openLoading();
            increaseGroup({
              name: this.form.name,
              description:this.form.description,
              parentId:'-1',
            }).then(res => {
              if(res.code==='000000'){
                rLoading.close();
                this.$message({
                  message: "新增成功",
                  type: "success"
                 })
              }else{
                rLoading.close();
                this.$message.error("新增失败，请稍后重试")
               }  
            })
              this.getGroupAllApi()           
              this.dialogFormVisible = false
              this.form.name = null
              this.form.description = null
              this.groupValue = null
          }else{
            const rLoading = this.openLoading();
            increaseGroup({
              name: this.form.name,
              description:this.form.description,
              parentId:this.groupValue[this.groupValue.length-1],
            }).then(res => {
              if(res.code==='000000'){
                rLoading.close();
                this.$message({
                  message: "新增成功",
                  type: "success"
                })
              }else{
                rLoading.close();
                this.$message.error("新增失败，请稍后重试")
              }   
            })   
            this.getGroupAllApi()           
            this.dialogFormVisible = false
            this.form.name = null
            this.form.description = null
            this.groupValue = null
          }  
        }else{
          return false;
        }
      })
        
    },
    //修改
    handleEdit(index, row){
      this.editVisible = true
      gloRow = row
      let {name,description,parentId} = gloRow
      this.edit.name = name
      this.edit.description = description
      this.edit.parentId = parentId
    },
    //修改成功
    saveEdit(formName){ 
      this.$refs[formName].validate((valid) => {  
        let userId = gloRow.id  
        const rLoading = this.openLoading();     
        UpdateGroup(
          userId,{
            name:this.edit.name,
            description:this.edit.description,
            parentId:this.edit.parentId
          }).then(res => {
            if(res.code==='000000'){
              rLoading.close();
              this.$message({
                message: "修改成功",
                type: "success"
              })
            }else{
              rLoading.close();
              this.$message.error("修改失败")
            }
        }) 
        this.getGroupAllApi()
        this.editVisible = false
      })
    },
    //删除。
    handleDelete(index, row){
      this.$confirm(`确定删除${row.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rLoading = this.openLoading();
          DeleteGroup(row.id).then(res=>{
            if(res.code === "000000"){
              rLoading.close();
              this.getGroupAllApi() 
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }else{
              rLoading.close();
              this.$message.error("删除失败")
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });   
    },
    //搜索用户组
    searchGroup(){
      if(this.SearchText === ''){
        this.getGroupAllApi()
      }else if(this.SearchText == null){
        this.$message("请输入菜单名称")
      }else{
        const rLoading = this.openLoading();
        SearchGroup({
          name:this.SearchText.trim()
        }).then(res=>{
          if(res.code === '000000'){
            rLoading.close();
            this.groupTablate = res.data
          }else{
            rLoading.close();
            this.$message('没有找到该菜单');
          }
        })
      }
    },
  }
}
</script>

<style scoped>
.home {
  height: auto;
}
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

.btns {
  width: 100%;
  display: flex;
  justify-content: center;
}

</style>

