<template>
  <div class="wrapp" v-if="isRouterAlive">
    <div class="header">
      <el-row :gutter="10">
        <el-col :xs="12" :sm="8" :md="4" :lg="5" :xl="4">
          <div class="grid-content bg-purple">
            <el-input  v-model="SearchText" placeholder="名称"></el-input>
          </div>
        </el-col>
        <el-col :xs="12" :sm="4" :md="3" :lg="3" :xl="2">
          <div class="grid-content bg-purple-light">
            <el-button type="primary" class="btns" @click="searchScript">搜索</el-button>
          </div>
        </el-col>
        <el-col :xs="12" :sm="5" :md="3" :lg="3" :xl="2">
          <div class="grid-content bg-purple-light">
            <el-button type="primary" class="btns" @click="addScriptStore">创建脚本库</el-button>
          </div>
        </el-col>
        <el-col :xs="12" :sm="5" :md="3" :lg="3" :xl="2">
          <div class="grid-content bg-purple-light">
            <el-button type="primary btns" @click="addScript">创建新的脚本</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 创建脚本库 -->
    <el-dialog title="创建脚本库" :destroy-on-close="true" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="addScriptStore" :model="scriptStoreForm" >
        <el-form-item label="脚本库名称:" prop="name">
          <el-input v-model="scriptStoreForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="脚本库描述:" >
          <el-input type="textarea"  placeholder="请输入内容" v-model="scriptStoreForm.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="SubmitScript('addScriptStore')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑脚本库名称 -->
    <el-dialog :destroy-on-close="true" title="修改脚本库" :visible.sync="editScript">
      <el-form :rules="rules" :model="edit" ref="editScriptStore">
        <el-form-item label="脚本库名称:" prop="name">
          <el-input v-model="edit.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="脚本库描述:">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="edit.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editScript = false">取 消</el-button>
        <el-button type="primary" @click="editAjax(editScriptStore)" >确 定</el-button>
      </div>
    </el-dialog>
    <div>
      <el-row class="tac" :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="4">
          <h5>所有脚本库</h5>
          <p v-show="!menuData" @click="addScriptStore">暂无脚本库，
            <span class="addBtn">
              点击添加
            </span>
          </p>
          <el-menu default-active="2" unique-opened class="el-menu-vertical-demo" @close="handleClose"  @open="handleOpen"
          >
            <el-submenu  :index="menu.id + ''" 
            v-for="(menu) in menuData" 
            :key="menu.id">
              <template slot="title" >
                <i class="el-icon-coin"></i>
                <span>{{menu.name}}</span>
                <i class="icon el-icon-edit-outline" @click="handleEdit(menu.id,menu.description,menu.name)"></i>
                <i class="icon el-icon-delete" @click="handleDelete(menu.id,menu.name)"></i>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="menuChildren.id + ''" 
                v-for="(menuChildren) in menuChildrenData"
                :key="menuChildren.id"
                @click="showDetail(menuChildren)">
                {{menuChildren.name}}
                <i class="icon el-icon-delete" @click="handleDeleteScript(menuChildren.id,menuChildren.name,menuChildrenData.index)"></i>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    <!-- 编辑 -->
      <div class="monaco-wrapp">
        <div class="monaco-title">
          <el-row :gutter="10">
            <el-col :xs="12" :sm="5" :md="4" :lg="8" :xl="5">
              <div class="grid-content bg-purple">
                <span>脚本名称 :</span>
                <el-input class="select-script" v-model="changeScript.name" placeholder="请先选择脚本" autocomplete="off"></el-input>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="5" :xl="4">
              <div class="grid-content bg-purple">
                <div style="display:inline-block">
                  <span>默认超时:</span>
                  <el-input v-model="changeScript.timeout" autocomplete="off" style="width:59px;"></el-input>
                  <span>秒</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="8" :md="6" :lg="3" :xl="4">
              <div class="grid-content bg-purple">
                <el-button type="warning btns" @click="saveScript">保存</el-button>
              </div>
            </el-col>
            <el-col :xs="12" :sm="8" :md="6" :lg="3" :xl="4">
              <div class="grid-content bg-purple">
                <el-button type="success btns" @click="run(changeScript)">立即执行</el-button>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
              <div class="grid-content bg-purple">
                <span class="tips" @click="switchInput">脚本说明
                </span>
                <el-input v-show="inputNone" class="tips-input" type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
              </div>
            </el-col>
          </el-row>
          <div ref="container" class="monaco-editor" :style="`height: ${300}px`" @input="changeValue"></div>
        </div>
        <!--调用子组件-->
      <!-- <monaco style="border:1px solid gray"  ref="monaco" :getCodes='getCodes'  @change="changeValue">
      </monaco> -->
      <!-- ----------- -->
    
      <!-- ------------- -->
      </div>
    </div>
     <!-- 创建新的脚本 -->
    <el-dialog title="创建新的脚本" :destroy-on-close="true" :visible.sync="scriprIsShow">
      <el-form :rules="rules" ref="numberValidateForm" :model="form"> 
        <el-form-item label="脚 本 库 : ">
          <el-select v-model="form.region" placeholder="请选择脚本库">
            <el-option v-for="item in options" :key="item.value"
            :label="item.name" :value="item.id"
            >
            </el-option> 
          </el-select>
        </el-form-item>
        <el-form-item label="脚本名称:" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述:" >
          <el-input v-model="form.description" autocomplete="off"></el-input>
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
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import{
  AddScriptStore,
  getAllScriptStore,
  editScriptStore,
  deleteScriptStore,
  searchScriptStore,
  getScript,
  deleteScript,
  editScript,
  runScript,
  AddScript
  } from "../../servise/index"
// import monaco from '@/components/monaco'
let ScriptId = 1
export default {
  components: { monaco },
  provide(){
    reload:this.reload
  },
  data(){
    return{
      isRouterAlive:true,
      // 主要配置-------------
      defaultOpts: {
          //value: '#!/bin/bash', // 编辑器的值
          // value:'#!/bin/bash<br />1<br />2<br />3<br />',
          value:null,
          theme: 'vs', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
          roundedSelection: false, // 右侧不显示编辑器预览框
          autoIndent: true // 自动缩进
      },
      // -------------
      menuData:[//脚本库列表
        {
          id:null,
          name:null
        }
      ],
      menuChildrenData:[//脚本列表
        {
          id:null,
          name:null,
          description:null
        }
      ],
      scriptStoreForm:{//创建脚本库
          name:null,
          description:null
        },
      changeScript:{//编辑脚本
        content:null,
        description:null,
        name:null,
        timeout:'300',
        tipsInput:null,
        id:null,
        type:null,
      },
      edit:{//编辑脚本库
        name:null,
        description:null
      },
      dialogFormVisible: false,//创建脚本库的dialog
      scriprIsShow:false,//创建脚本的dialog
      textarea:null,//脚本说明
      scriprIsShow:false,//脚本的dialog
      editScript:false,//修改脚本
      SearchText:null,//搜索脚本库
      inputNone:false,//决定脚本说明显示隐藏
      getCodes:null,//点击拿到代码值赋予
      form:{//创建脚本的form
        content:'#!/bin/bash',
        description:null,
        name: null,
        region: null,
        type: [], 
        timeout:'300'
      },
      options:[{//获取到所有脚本库的下拉菜单
        value:null,
        label:null
        }
      ],
      radio1: 'LINUX_SHELL',
      rules: {//新增脚本的验证
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ]
        },
    }
  },
  mounted(){
    this.init()
  },
  created(){
    this.getAllScriptStoreApi()//获取所有脚本库
  },
  methods:{
    // ------monaco
    init() {
            // 初始化container的内容，销毁之前生成的编辑器
            this.$refs.container.innerHTML = ''
            // this.$refs.container.innerHTML = this.getCodes;
            this.editorOptions = Object.assign(this.defaultOpts, this.opts)
            // 生成编辑器对象
            this.monacoEditor = monaco.editor.create(this.$refs.container, this.editorOptions)
            
            // 编辑器内容发生改变时触发
            this.monacoEditor.onDidChangeModelContent(() => {
                this.$emit('change', this.monacoEditor.getValue())
            })
            // console.log(this.getCodes)
            this.value = this.getCodes;
        },
        // 供父组件调用手动获取值
        getVal() {
            return this.monacoEditor.getValue()
        },
    // -------------获取所有脚本库
    getAllScriptStoreApi(){
      const rLoading = this.openLoading();
      getAllScriptStore()
       .then(res=>{
         if(res.code === '000000'){
            rLoading.close();
            this.menuData=res.data
            this.options = res.data
         }else{
            rLoading.close();
            this.$message.error(res.mesg)
         } 
      })
    },
    reload(){
      this.isRouterAlive=false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    },
    //切换脚本库显示隐藏
    switchInput(){
      this.inputNone=!this.inputNone 
    },
    //创建脚本库
    addScriptStore(){
      this.dialogFormVisible = true
    },
    //点击确定，创建脚本库
    SubmitScript(formName){
      this.$refs[formName].validate((valid) => {
        const rLoading = this.openLoading();
        AddScriptStore({
            name:this.scriptStoreForm.name,
            description:this.scriptStoreForm.description
        }).then( res =>{
            if(res.code === '000000'){
              rLoading.close();
              this.$message({
              message:"添加成功",
              type:"success"
            })
            this.dialogFormVisible = false
            this.getAllScriptStoreApi()
            }else{
              rLoading.close();
              this.$message.error("添加失败")
            }
        })
          this.getAllScriptStoreApi()
          this.scriptStoreForm.name =null,
          this.scriptStoreForm.description = null
      })
    },
    //编辑
    handleEdit(id,description,name){
      this.editScript = true
      this.edit.name = name;
      this.edit.description = description
      this.edit.id = id
      ScriptId = id
    },
    //编辑完成，点击确定
    editAjax(){
      this.$refs.numberValidateForm.validate((valid) => {
        const rLoading = this.openLoading();
        editScriptStore(
          ScriptId,
          {
          name:this.edit.name,
          description:this.edit.description
        }).then(res=>{
          if(res.code === '000000'){
            rLoading.close();
            this.$message({
                message:"修改成功",
                type:"success"
              })
            this.getAllScriptStoreApi()
          }else{
            rLoading.close();
            this.$message.error("修改失败")
          }
        })
        this.editScript = false
      })
    },
    //删除脚本库
    handleDelete(id,name){
      this.$confirm(`确定要将${name}删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rLoading = this.openLoading()
          deleteScriptStore({
            id
          }).then(res=>{
            if(res.code === '000000'){
              rLoading.close();
              this.$message({
              type: 'success',
              message: '删除成功!'
            }),
            this.getAllScriptStoreApi()
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
    //删除脚本
    handleDeleteScript(id,name,index){
      this.$confirm(`确定要将${name}删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rLoading = this.openLoading();
          deleteScript({
            id
          }).then(res=>{
            if(res.code === '000000'){
              rLoading.close();
              this.$message({
                type: 'success',
                message: '删除成功!'
              }),
              this.changeScript.name = null
              this.$refs.container.innerHTML = ''
              this.reload()
              this.menuChildrenData.splice(index)
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
    //搜索
    searchScript(){
        const rLoading = this.openLoading()
        getAllScriptStore({
          name:this.SearchText
        }).then(res=>{
          if(res.code === '000000'){
            rLoading.close();
            this.menuData = res.data
          }else{
            rLoading.close();
            this.$message("没有找到该脚本");
          }
        })
    },
    //编辑器切换语言出发
    changeLanguage(val) {
        this.opts.language = val
      },
      changeTheme(val) {
        this.opts.theme = val
      },
      // 手动获取值
      getValue() {
        this.$message.info(this.$refs.monaco.getVal())
      },
      // //编辑器内容改变触发，自动获取值
      changeValue(e) {
        // console.log(e.target.value);
        var val = e.target.value
        let str = val.replace(/[\n]/g,"<br>");
        // console.log(val.indexOf("↵"));
        // console.log(str)
        this.changeScript.content = str 
      },
      //菜单打开时触发
      handleOpen(...list) {
        const rLoading = this.openLoading();
        getScript({
          scriptLibraryId:list[0]
        }).then(res=>{ 
          if(res.code === '000000'){
            rLoading.close();
            this.menuChildrenData = res.data; 
          }else{
            rLoading.close();
          }
          
        })
      },
      //当菜单关闭时触发
      handleClose(){
          this.menuChildrenData = []
      },
      //点击显示脚本库详情
      showDetail(obj){
        if(obj.content!=null){
         this.getCodes = obj.content.replace(/b/g,"1")
         this.defaultOpts.value = obj.content.replace(/(<(.[^>]*)>)|(&nbsp;)/g,"\n")
         this.changeScript = obj
        }else{
          this.changeScript = obj
        }
        this.init();

      },
      //保存更改
      saveScript(){
        const rLoading = this.openLoading();
        editScript(
         this.changeScript.id,{
          content:this.changeScript.content ,
          description:this.changeScript.description,
          name:this.changeScript.name,
          timeout:this.changeScript.timeout,
          type:this.changeScript.type,
        }).then(res=>{
           if(res.code === '000000'){
             rLoading.close()
             this.$message({
              message:"修改成功",
              type:"success"
            })
             this.getAllScriptStoreApi()
           }else{
             rLoading.close()
             this.$message.error("修改失败")
           }
        })
      },
    //运行
    run(cs){
      this.$router.replace('/task/scriptExecution')
    },
    //创建脚本
     addScript(){
      this.scriprIsShow = true
    },
    //创建脚本，点击确定
    addScriptAjax(){
      this.$refs.numberValidateForm.validate((valid) => {
        const rLoading = this.openLoading();
        AddScript({
          content:this.form.content,
          description:this.form.description,
          name:this.form.name,
          scriptLibraryId:this.form.region,
          type:this.radio1,
          timeout:this.form.timeout
        }).then(res=>{
          if(res.code ==='000000'){ 
            rLoading.close();
            this.$message({
              message:"添加成功",
              type:"success"
            })
            this.reload()
            this.scriprIsShow = false
            this.form.name = null
            this.form.region = null
            this.form.description=null
          }else{
            rLoading.close();
          }
        })
        
      })
    }
  }
}
</script>

<style scoped lang="scss">
//  .wrapp{
//   min-width: 1060px;
//   overflow: hidden;
//  }
  .radio{
    display: flex;
    flex-wrap:wrap;
  }
  .el-radio{
    margin: 5px;
  }
  .header{
    margin-bottom: 10px;
  }
  .el-col-12{
    width: 300px
  }
 .tac{
  width:30%;
  display: inline-block;
   .icon{
     float:right;
     line-height:50px;
     margin-right:20px;
   }
 }
 .monaco-wrapp{
   width:70%;
   height: 400px;
   float:right;
   
 }
.monaco-editor{
  height: 425px!important;
}
.monaco-title{
  padding: 10px;
}
.select-script{
  width:137px;
  margin:0px 2px;
}
.tips{
  color: #409EFF;
  font-size: 17px;
  line-height: 44px;
}
.tips-input{
  margin-top: 20px;
}
p{
  text-align: center;
  line-height: 250px;
  font-size: 22px;
  span{
    color: #409EFF;
    cursor: pointer;
  }
}
.el-col {
  border-radius: 4px;
  margin:2px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.el-col-lg-8{
  width: 30.33333%;
}
//按钮样式
.btns {
  width: 100%;
  display: flex;
  justify-content: center;
  margin:1px;
}
.add {
  background: #17b3a3;
  color: white;
  border: 1px solid #17b3a3;
}
.add:hover {
  background: #17b3a3;
}
.user_list {
  margin-top: 20px;
}
.block {
  float: right;
  margin-top: 20px;
}
//dialog框
.create_user {
  width: 100%;
}
.checks {
  width: 100%;
}
// .el-col-lg-9{
//   width:35.5%;
// }
</style>