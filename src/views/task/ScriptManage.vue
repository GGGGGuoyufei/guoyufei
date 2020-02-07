<template>
  <div class="wrapp">
    <div class="header">
      <!-- <input type="text" class="menu-input" placeholder="脚本id" v-model="SearchText">
      <el-button type="primary" icon="el-icon-search" @click="searchScriptBtn">搜索</el-button> -->
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addScript">创建新的脚本</el-button>
    </div>
    <!-- 创建新的脚本 -->
    <el-dialog title="创建新的脚本" :visible.sync="scriprIsShow">
      <el-form :model="form">
        <el-form-item label="脚本库:">
          <el-select v-model="form.region" placeholder="请选择脚本库">
            <el-option v-for="item in options" :key="item.value"
            :label="item.name" :value="item.id"
            >
            </el-option> 
          </el-select>
        </el-form-item>
        <el-form-item label="脚本名称:" >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <div>
          <span>脚本类型:</span>
          <div class="radio">
            <el-radio v-model="radio1" label="LINUX_SHELL" border style="margin-left:15px;">Linux Shell</el-radio>
            <el-radio v-model="radio1" label="WINDOWS_CMD" border>Windows CMD</el-radio>
            <el-radio v-model="radio1" label="WINDOWS_POWER_SHELL" border>Windows PowerShell</el-radio>
            <el-radio v-model="radio1" label="PYTHON" border>Python</el-radio>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="scriprIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addScriptAjax">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :header-cell-style="{background:'#F5F7FA'}" :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="id" width="180"></el-table-column>
      <el-table-column prop="name" label="脚本库名称" width="180"></el-table-column>
      <el-table-column prop="description" label="脚本库描述"></el-table-column>
    </el-table>
    <!-- 编辑 -->
    <el-dialog title="修改脚本库" :visible.sync="editScript">
      <el-form :model="edit">
        <el-form-item label="脚本库名称:" >
          <el-input v-model="edit.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="脚本库描述:" >
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="edit.describe">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editScript = false">取 消</el-button>
        <el-button type="primary" @click="editScript = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import{
  AddScript,
  getAllScriptStore,
  searchScript
  } from '../../servise/index'
export default {
  data(){
    return{
      tableData:[{//表格
        id: null,
        name: '哈哈哈哈',
        description: null
      }],
      form: {//创建脚本库的form
        name: null,
        region: null,
        type: [], 
      },
      options:[{//获取到所有脚本库的下拉菜单
        value:null,
        label:null
      }
      ],
      edit:{},//编辑
      textarea:null,//脚本库描述
      scriprIsShow:false,//脚本的dialog
      radio1: 'LINUX_SHELL',
      editScript:false,//编辑框的dialog
      SearchText:null//搜索内容
    }
  },
  created(){
    this.getAllScriptStoreApi()//获取所有脚本库
  },
  methods:{
    //获取所有脚本库
    getAllScriptStoreApi(){
      getAllScriptStore().then(res=>{
        if(res.code==='000000'){
          this.options = res.data
        }else{
          alert('请求异常')
        }
      })
    },
    //创建新的脚本
    addScript(){
      this.scriprIsShow = true
    },
    //创建脚本，点击确定
    addScriptAjax(){
      AddScript({
        name:this.form.name,
        scriptLibraryId:this.form.region,
        type:this.radio1
      }).then(res=>{
        if(res.code ==='000000'){
          this.$message({
            message:"添加成功",
            type:"success"
          })
          this.scriprIsShow = false
          this.form.name = null
          this.form.region = null
        }else{
          alert('添加失败')
        }
      })
    },
    //搜索
    searchScriptBtn(){
      if(this.SearchText){
        searchScript({
        id:this.SearchText
      }).then(res=>{
          this.tableData[0].id = res.data.id
          this.tableData[0].name = res.data.name
          this.tableData[0].description = res.data.description
      })
      }else{
        alert('id不能为空')
      }
    }
  }
}
</script>

<style scoped>
  .el-form-item__content{
    display: inline-block;
    width: 406px;
  }
  .radio{
    display: flex;
  }
  .el-radio.is-bordered+.el-radio.is-bordered{
    margin-left: 0px;
    margin-right: 10px;
    width: 100%;
  }
  .el-radio{
    margin: 5px;
  }
  .header{
    margin-bottom: 10px;
  }
  .menu-input{
    width: 176px;
    height: 38px;
    border: 1px solid rgb(199, 199, 199);
    margin-right: 5px;
    border-radius: 5%;
    text-align: center
  }

</style>