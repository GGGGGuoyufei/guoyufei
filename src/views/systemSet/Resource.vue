<template>
  <div class="_resource">
    <!-- form表单操作 -->
    <el-row :gutter="10">
      <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="grid-content bg-purple">
          <el-input v-model="SearchName" placeholder="请输入资源名称"></el-input>
        </div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
        <div class="grid-content bg-purple-light">
          <el-button class="btns" @click="SearchResource()">资源查询</el-button>
        </div>
      </el-col>
      <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
        <div class="grid-content bg-purple-light">
          <el-button type="primary btns" @click="isShow = true,isChange = false">资源新增</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 展示区table -->
    <el-table
      class="user_list"
      :data="resourceList"
      :header-cell-style="{background:'#F5F7FA'}"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="资源名称" width="130"></el-table-column>
      <el-table-column prop="description" label="资源描述"></el-table-column>
      <el-table-column prop="method" label="资源请求方法" width="130"></el-table-column>
      <el-table-column prop="type" label="资源类型" width="130"></el-table-column>
      <el-table-column prop="url" label="资源路径" width="130"></el-table-column>
      <el-table-column prop="code" label="资源CODE" width="180"></el-table-column>
      <el-table-column label="资源操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delResource(scope.$index, scope.row)">删除</el-button>
          <el-button type="warning" size="mini" @click="UpdateResource(scope.$index,scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="page"
        :total="total"
        @current-change="countChange(page)"
      ></el-pagination>
    </div>
    <!-- 新增Dialog -->
    <el-dialog title="角色新增" :visible.sync="isShow" :destroy-on-close="true">
      <el-form :model="Create" ref="Create" :rules="rules">
        <el-form-item label="资源名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="Create.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源描述" :label-width="formLabelWidth">
          <el-input v-model="Create.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源请求方法" :label-width="formLabelWidth" prop="method">
          <el-input v-model="Create.method" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" :label-width="formLabelWidth" prop="type">
          <el-input v-model="Create.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" :label-width="formLabelWidth" prop="url">
          <el-input v-model="Create.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源CODE" :label-width="formLabelWidth" prop="code">
          <el-input v-model="Create.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源所属菜单" :label-width="formLabelWidth">
          <el-cascader
            v-model="Create.menuID"
            :options="allMenu"
            :show-all-levels="false"
            :props="{ checkStrictly: true,value:'id',label:'name' }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="addResource()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let id = 1000;
import {GetAllResource,GetMenuNo,AddResource,DelResource,SearchResource,UpdateResource} from "@/servise";
export default {
  name: "Resource",
  data() {
    return {
      rules:{
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        code:[
          { required: true, message: '请输入CODE', trigger: 'blur' },
          { min: 2, max: 200, message: '长度在 4 到 200 个字符', trigger: 'blur' }
        ],
        method:[
          { required: true, message: '请输入资源请求方法', trigger: 'blur' },
          { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ],
        url:[
          { required: true, message: '请输入资源路径', trigger: 'blur' },
          { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ],
        type:[
          { required: true, message: '请输入资源类型', trigger: 'blur' },
          { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
        ]
      },
      SearchName:null,//查询内容
      resourceList:[],//开始展示的资源
      allMenu:[],//全部菜单-无资源
      //分页器
      pageSize: 10,
      page: 1,
      total: 0,
      isShow:false,//dialog状态
      formLabelWidth:"120px",
      //dialog里的数据
      Create: {
        name: null,
        description:null,
        type:null,
        code:null,
        url:null,
        method:null,
        menuID:[],
      },
      isChange:false,//判断点击按钮时添加还是修改
      TimerID:null,//暂存ID
    };
  },
  methods: {
    //资源新增
    addResource(){
      let menuID = "";
      if(this.Create.menuID != []){
        menuID = this.Create.menuID[this.Create.menuID.length-1];
      }else{
        menuID = "";
      }
      let createResource = {
          code: this.Create.code,
          description: this.Create.description,
          menuId: menuID,
          method: this.Create.method,
          name: this.Create.name,
          type: this.Create.type,
          url: this.Create.url
      }
      this.$refs.Create.validate((valid) => {
        if(valid){
          if(this.Create.menuID.length != 0){
            const rLoading = this.openLoading();
            if(!this.isChange){
              AddResource(createResource).then(res => {
                  if(res.code === "000000"){
                    rLoading.close();
                    this.$message({
                        message:"添加成功",
                        type:"success"
                    })
                    this.StartGetResource();
                    this.isShow = false;
                    this.Create.code = null;
                    this.Create.description = null;
                    this.Create.menuID = null;
                    this.Create.method = null;
                    this.Create.name = null;
                    this.Create.type = null;
                    this.Create.url = null;
                  }else if(res.code === "030000"){
                    rLoading.close();
                    this.$message.error("CODE值冲突")
                  }else{
                    rLoading.close();
                    this.$message.error("请添加完整信息")
                  }
              })
            }else{
                UpdateResource(this.TimerID,createResource).then(res => {
                    this.isChange = false;
                    if(res.code === "000000"){
                      rLoading.close();
                      this.$message({
                          message:"修改成功",
                          type:"success"
                      })
                      this.StartGetResource(); 
                      this.isShow = false;
                      this.Create.code = null;
                      this.Create.description = null;
                      this.Create.menuID = null;
                      this.Create.method = null;
                      this.Create.name = null;
                      this.Create.type = null;
                      this.Create.url = null;
                    }else if(res.code === "030000"){
                      rLoading.close();
                      this.$message.error("CODE值冲突")
                    }else{
                      rLoading.close();
                      this.$message.error("修改失败")
                    }
                })
            }
          }else{
            this.$message({
              message:"请选择资源所属菜单",
              type:"warning"
            })
          }
        }else{
          this.$message({
            message:"请填写完整信息",
            type:"warning"
          })
        }
      })
    },
    //删除资源
    delResource(index,scoped){
      const rLoading = this.openLoading();
      DelResource(scoped.id).then(res => {
          if(res.code === "000000"){
            rLoading.close();
            this.StartGetResource();
            this.$message({
                message:"删除资源成功",
                type:"success"
            })
          }else{
            rLoading.close();
            this.$message.error("资源删除失败")
          }
      })
    },
    //搜索资源
    SearchResource(){
      if(this.SearchName != ""){
        const rLoading = this.openLoading();
        SearchResource({
          current:1,
          size:this.pageSize,
          name:this.SearchName
        }).then(res => {
          if(res.code === "000000"){
            this.resourceList = res.data.records;
            this.total = res.data.total;
            rLoading.close();
          }else{
            rLoading.close();
            this.$message.error("查询失败")
          }
        })
      }else{
          this.StartGetResource();
      }
    },
    //修改
    UpdateResource(index,scoped){
      this.isChange = true;
      this.TimerID = scoped.id;
      this.isShow = true;
      //修改前补充
      this.Create.code = scoped.code;
      this.Create.description = scoped.description;
      this.Create.method = scoped.method;
      this.Create.name = scoped.name;
      this.Create.type = scoped.type;
      this.Create.url = scoped.url;
    },
    //点击页码跳转对应页
    countChange(page) {
      const rLoading = this.openLoading();
      SearchResource({
          current: page,
          size: this.pageSize
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.resourceList = res.data.records;
        }else{
          rLoading.close();
          this.$message({
            message:"转入下一页失败",
            type:"error"
          })
        }
      });
    },
    //开始获取Table展示资源
    StartGetResource(){
      this.page = 1;
      const rLoading = this.openLoading();
      SearchResource({
          current:1,
          size:this.pageSize,
      }).then(res => {
        rLoading.close();
        if(res.code === "000000"){
            this.total = res.data.total;
            this.resourceList = res.data.records;
        }
      })
    },
    //开始获取全部菜单-无资源
    StartGetMenu(){
      GetMenuNo().then(res => {
        if(res.code === "000000"){
          this.allMenu = this.getTreeData(res.data);
        }
      })
    },
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data){
      for(var i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    }
  },
  created() {
    this.StartGetResource();
    this.StartGetMenu();
  },
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
    // overflow: auto;
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
._resource{
  box-sizing: border-box;
  // width:100%;
  // height: 100%;
  // overflow: auto;  
}
</style>

