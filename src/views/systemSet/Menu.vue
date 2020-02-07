<template>
  <div >
    <el-row :gutter="10">
      <el-col :xs="16" :sm="7" :md="6" :lg="5" :xl="5">
        <div class="grid-content bg-purple">
          <el-input v-model="SearchText" placeholder="菜单名称"></el-input>
        </div>
      </el-col>
      <el-col :xs="8" :sm="5" :md="4" :lg="3" :xl="5">
        <div class="grid-content bg-purple-light">
          <el-button class="btns" @click="search">查询</el-button>
        </div>
      </el-col>
      <el-col :xs="8" :sm="5" :md="4" :lg="3" :xl="5">
        <div class="grid-content bg-purple-light">
           <el-button   type="primary btns" @click="addMenu">新增</el-button>
        </div>
      </el-col>
    </el-row>
    
    <el-table :data="tableData" style="width: 100%;margin:20px 0px 20px 0px;"
      row-key="id"
      border 
      :tree-props="{children: 'children',  hasChildren: 'hasChildren'}">
      <el-table-column prop="name" label="名称" width="110"></el-table-column>
      <el-table-column prop="icon" label="图标" width="110">
        <template slot-scope="scope" >
          <i :class='scope.row.icon'></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" width="110" label="类型">
        <template >
            {{tableData.type=='MENU'?'按钮':'菜单'}}
        </template>
      </el-table-column>
      <!-- <el-table-column sortable prop="orderNum" width="110" label="排序"></el-table-column> -->
      <el-table-column  prop="href"  label="路由"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作"  width="180"  align="center" fixed="right">                      
        <template slot-scope="scope" >
          <el-button type="danger" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>             
      </el-table-column>
    </el-table>   
    <!-- 编辑弹出框 -->  
    <el-dialog title="编辑"  :destroy-on-close="true" :visible.sync="editShow" >                
      <el-form ref="edit" :rules="rules"  :model="edit"  label-width="70px">                    
          <el-form-item label="名称" prop="name">                        
              <el-input v-model="edit.name"></el-input>                    
          </el-form-item>   
          <el-form-item label="图标">                        
              <icon-picker class="select-icon" v-model="edit.icon"></icon-picker>                
          </el-form-item> 
          <span class="class">类型</span>
          <div class="check editCheck">
            <el-radio v-model="formMeun.type" label="MENU">菜单</el-radio>
          </div>
          <!-- <el-form-item label="排序">                        
              <el-input v-model="edit.orderNum"></el-input>                    
          </el-form-item> -->
          <el-form-item label="路由">                        
              <el-input v-model="edit.href"></el-input>                    
          </el-form-item>
          <el-form-item label="描述">                        
              <el-input v-model="edit.description"></el-input>                    
          </el-form-item>             
      </el-form>                
      <span slot="footer"  class="dialog-footer">                    
          <el-button @click="editShow = false">取 消</el-button>                    
          <el-button type="primary"  @click="saveEdit">确 定</el-button>                
      </span>            
    </el-dialog>
    <!-- 新增框 -->
    <el-dialog  title="新增菜单"  :destroy-on-close="true" :visible.sync="dialogFormVisible" width="500px">            
      <el-form :model="formMeun" :rules="rules" ref="numberValidateForm"> 
          <el-form-item label="名称" prop="name">                
              <el-input v-model.number="formMeun.name"  autocomplete="off"></el-input>                
          </el-form-item> 
          <span>类 型</span>
          <div class="check">
            <el-radio v-model="formMeun.type" label="MENU">菜单</el-radio>
          </div>
          <el-form-item label="路 由"  prop="href">                
              <el-input v-model="formMeun.href"  autocomplete="off"></el-input>                
          </el-form-item>
          
          <el-form-item label="描 述" prop="description">                
              <el-input v-model="formMeun.description"  autocomplete="off" ></el-input>                
          </el-form-item>  
          <el-form-item label="图 标" prop="icon">                
              <icon-picker class="select-icon" v-model="formMeun.icon"></icon-picker>                
          </el-form-item> 
          <el-form-item label="所属菜单">
            <el-cascader
              v-model="menuValue"
              :options="menuTree"
              :show-all-levels="false"
              :props="{ checkStrictly: true,value:'id',label:'name' }"
              clearable
            ></el-cascader>
          </el-form-item>
      </el-form>            
      <div slot="footer"  class="dialog-footer">                
          <el-button @click="dialogFormVisible = false">取 消</el-button>                
          <el-button type="primary" @click="successAjax('numberValidateForm')">确 定</el-button>           
      </div>           
    </el-dialog>
  </div>
</template>

<script >
import {
  getMeunAll,
  editMenu,
  PostMenu,
  deleteMenu,
  searchMenu,
  getMenuTree} from '@/servise/index'
let gloRow = null
let selectMenu = null
export default {
    data() {
      return {
        SearchText:null,//搜索内容
        editShow:false,//编辑框dialog
        dialogFormVisible: false,//新增表单默认隐藏
        edit: {//编辑的form表单
          name:null,
          icon: null,
          type: null,
          orderNum: 0,
          href: null,
          description: null,
          parentId: 0
        },
        formMeun:{//新增表单
          name:null,
          icon: null,
          type: 'MENU',
          orderNum: null,
          href: null,
          description: null,
          parentId: null
        },
        Form:{
          userName:null,
          userSex:null,
          department:null,
       },
        tableData: [],//表格
        rules: {//新增时表单验证
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 3, max: 10, message: '菜单名称长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        menuTree:[],//树形控件，新增时选择为几级菜单
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        menuValue:null
      }
    },
    mounted(){
      this.getAllMeunApi() //获取所有菜单
    },
    methods:{
      //获取所有菜单
      getAllMeunApi(){
        const rLoading = this.openLoading();
        getMeunAll().then(res => {
          if(res.code=== '000000'){
            rLoading.close();
            this.tableData = res.data
          }  
         })
      },
        
      //点击修改
      handleEdit(index,row){
        this.editShow = true
        gloRow = row
        let {name,icon,type,orderNum,href,description,parentId} = row
        this.edit.name =name
        this.edit.icon =icon
        this.edit.type =type.toUpperCase()
        this.edit.orderNum =orderNum
        this.edit.href =href
        this.edit.description =description
        this.edit.parentId =parentId
      },
      //保存修改
      saveEdit(){
        let userId = gloRow.id
        const rLoading = this.openLoading();
        editMenu(
          userId,
          {
           name:this.edit.name,
           icon:this.edit.icon,
           type:this.formMeun.type,
           orderNum:this.edit.orderNum,
           href:this.edit.href,
           description:this.edit.description,
           parentId:this.edit.parentId
        }).then(res=>{
          if(res.code == '000000'){
            rLoading.close();
            this.$message({
            message:"修改成功",
            type:"success"
          })
          this.getAllMeunApi()
          }else{
            rLoading.close();
            this.$message.error("修改失败,请稍后进行操作")
          }
        })
        this.editShow = false
      },
      //删除
      handleDelete(index,row){
        this.$confirm(`确定删除${row.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rLoading = this.openLoading();
          deleteMenu(row.id)
            .then(res=>{
              if(res.code === '000000'){
                rLoading.close();
                this.$message({
                type: 'success',
                message: '删除成功!'
              });
               this.getAllMeunApi();
              }else{
                rLoading.close();
                this.$message({
                  type: 'success',
                  message: '删除失败!'
                });
              }
          })   
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //新增
      addMenu(){
        this.dialogFormVisible = true
        const rLoading = this.openLoading();
        getMeunAll().then(res=>{
         if(res.code === '000000'){
            rLoading.close();
            this.menuTree = res.data
         }
        })
      },
      //新增完成
      successAjax(formName){
        this.$refs.numberValidateForm.validate((valid) => {
          if (valid) {
            if(this.menuValue === null){
              const rLoading = this.openLoading();
              PostMenu({
                description:this.formMeun.description,
                href:this.formMeun.href,
                name:this.formMeun.name,
                icon:this.formMeun.icon,
                orderNum:'0',
                parentId:'-1',
                type:this.formMeun.type
              }).then(res=>{
                if(res.code === '000000'){
                  rLoading.close();
                  this.$message({
                    message: "新增成功",
                    type: "success"
                  })
                  this.getAllMeunApi()
                  this.dialogFormVisible = false
                  this.formMeun.description = null,
                  this.formMeun.name = null
                  this.formMeun.href = null
                  this.formMeun.icon = null
                  this.menuValue = null
                }
              })
            }else{
              const rLoading = this.openLoading();
              PostMenu({
              description:this.formMeun.description,
              href:this.formMeun.href,
              name:this.formMeun.name,
              icon:this.formMeun.icon,
              orderNum:'0',
              parentId:this.menuValue[this.menuValue.length-1],
              type:this.formMeun.type
            }).then(res=>{
              if(res.code === '000000'){
                 rLoading.close();
                 this.$message({
                  message: "新增成功",
                  type: "success"
                })
                this.getAllMeunApi()
                this.dialogFormVisible = false
                this.formMeun.description = null,
                this.formMeun.name = null
                this.formMeun.href = null
                this.formMeun.icon = null
                this.menuValue = null
              }
            })
            }
          }
        })
      },  
    handleMenu(){

    },
    //搜索
    search(){
      if(this.SearchText === ''){
        this.getAllMeunApi()
      }else if(this.SearchText == null){
        this.$message("请输入菜单名称")
      }else{
        const rLoading = this.openLoading();
        searchMenu({
          name:this.SearchText
        }).then(res=>{
          if(res.code === '000000'){
            rLoading.close();
            this.tableData = res.data
          }else{
            rLoading.close();
            this.$message('没有找到该菜单')
          }
        })
      }
    }, 
  }
}
</script>

<style scoped>
  .el-form-item__content .el-input{
    width: 409px !important;
    
  }
  .check{
    display: inline-block;
    margin: 0px 0px 20px 26px;
  }
  .class{
    margin-left: 25px;
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
  text-align: center;
  display: flex;
  justify-content: center;
}
</style>