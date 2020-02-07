<template>
  <div class="_person">
    <!-- form表单操作 -->
    <el-row :gutter="10">
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="grid-content bg-purple">
          <el-input v-model="SearchName" placeholder="名称"></el-input>
        </div>
      </el-col>
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
        <div class="grid-content bg-purple-light">
          <el-button class="btns" @click="SearchRole()">查询</el-button>
        </div>
      </el-col>
      <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
        <div class="grid-content bg-purple-light">
          <el-button type="primary btns" @click="isShow = true">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 展示区table -->
    <el-table
      class="user_list"
      :data="roleList"
      :header-cell-style="{background:'#F5F7FA'}"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="description" label="备注" ></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="300"></el-table-column>
      <el-table-column label="操作" width="180" fixed="right" >
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delRole(scope.$index, scope.row)">删除</el-button>
          <el-button type="warning" size="mini" @click="UpdateRole(scope.$index,scope.row)">编辑</el-button>
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
      <el-form :model="Create" :rules="rules" ref="Create">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="Create.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="Create.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编号" :label-width="formLabelWidth" prop="roleCode">
          <el-input v-model="Create.roleCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form class="treebox">
          <el-form-item label="菜单授权" :label-width="formLabelWidth">
          <el-tree
            ref="tree"
            class="menutree"
            :data="menuTree"
            show-checkbox
            node-key="name"
            :expand-on-click-node="false"
            :render-content="renderContent"
             @check-change="handleCheckChange">
          </el-tree>
        </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let id = 1000;
import {getRole,getMenuTree,getResourceAll,getResourceList,addRole,getRoleAll,delRole,SearchRole,UpdateRole} from "@/servise";
export default {
  name: "PersonMag",
  data() {
    return {
      rules:{
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        roleCode:[
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      SearchName:null,
      roleList:[],
      currentPage: 1,
      //分页器
      pageSize: 10,
      page: 1,
      total: 0,
      //dialog状态
      isShow:false,
      formLabelWidth:"120px",
      //dialog里的值
      Create: {
        name: null,
        description:null,
        roleCode:null,//角色类型
        checkedMenu:[],//选中的菜单
        checkedResource:[],//选中的资源
      },
      menuTree:[],//菜单树
      resourceTree:[],//资源树
      allRoleType:[],//所有角色类型
      update:false,//按钮点击的是添加还是修改
      OnceID:'',//暂存ID
    };
  },
  methods: {
    //开始获取全部角色
    StartGetRole(){
      const rLoading = this.openLoading();
      this.page = 1;
      getRole({
        current:1,
        size:this.pageSize
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.roleList = res.data.records;
          this.total = res.data.total;
          this.roleList.forEach((v,i) => {
            v.createdTime = this.ChangeTime(v.createdTime);
          })
        }else{
          rLoading.close();
          this.$message.error("角色获取失败")
        }
      })
    },
    //开始获取全部菜单
    StartGetMenu(){
      const rLoading = this.openLoading();
      getMenuTree().then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.menuTree = res.data;
        }
      })
    },
    //开始获取全部资源
    StartGetResource(){
      const rLoading = this.openLoading();
      getResourceAll().then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.resourceTree = res.data;
        }
      })
    },
    //开始获取所有角色类型
    StartGetRoleType(){
      const rLoading = this.openLoading();
      getRoleAll().then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.allRoleType = res.data;
        }
      });
    },
    //选中的选项
    handleCheckChange () {
      let res = this.$refs.tree.getCheckedNodes()
      let menu = [];
      let resource = [];
      res.forEach((item) => {
        if(item.code){
          resource.push(item.id);
        }else{
          menu.push(item.id);
        }
      })
      this.Create.checkedMenu = menu;
      this.Create.checkedResource = resource;
    },
    //删除角色
    delRole(index,scoped){
      const rLoading = this.openLoading();
      delRole(scoped.id).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.$message({
            message:"删除成功",
            type:"success"
          })
          this.StartGetRole();
        }else{
          rLoading.close();
          this.$message.error("删除失败")
        }
      })
    },
    //搜索角色
    SearchRole(){
      const rLoading = this.openLoading();
      getRole({
        name:this.SearchName,
        current:1,
        size:10
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          if(res.data.records.length == 0){
            this.roleList = res.data.records;
            this.$message("没有找到该用户");
          }else{
            this.roleList = res.data.records;
            console.log(res.data.records)
          }
        }else{
          rLoading.close();
          this.$message.error("查询失败");
        }
      })
    },
    //修改
    UpdateRole(index,scoped){
      this.isShow = true;
      this.update = true;
      this.Create.name=scoped.name;
      this.Create.description=scoped.description;
      this.OnceID = scoped.id;
    },
    //点击页码跳转对应页
    countChange(page) {
      const rLoading = this.openLoading();
      getRole({
        current: page,
        size: this.pageSize
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          this.roleList = res.data.records;
        }else{
          rLoading.close();
          this.$message.error("转入下一页失败")
        }
      });
    },
    //新增角色
    addRole(){
      var create = {
        name:this.Create.name,
        code:this.Create.roleCode,
        description:this.Create.description,
        menuIds:this.Create.checkedMenu,
        resourceIds:this.Create.checkedResource
      }
        this.$refs.Create.validate((valid) => {
          if(valid){
            if(this.Create.checkedMenu.length != 0 && this.Create.checkedResource.length != 0){
              const rLoading = this.openLoading();
                if(!this.update){
                  addRole(create).then(res => {
                    if(res.code === "000000"){
                      this.StartGetRole();
                      rLoading.close();
                      this.isShow = false;
                      this.$message({
                        message:"添加成功",
                        type:"success"
                      })
                      this.Create.name=null;
                      this.Create.roleCode=null;
                      this.Create.description=null;
                      this.Create.checkedMenu=[];
                      this.Create.checkedResource=[];
                    }else{
                      rLoading.close();
                      this.isShow = false;
                      this.$message.error("添加失败")
                    }
                  })
                }else{
                  UpdateRole(this.OnceID,create).then(res => {
                    const rLoading = this.openLoading();
                    if(res.code === "000000"){
                      this.StartGetRole();
                      rLoading.close();
                      this.isShow = false;
                      this.$message({
                        message:"修改成功",
                        type:"success"
                      })
                      this.Create.name="";
                      this.Create.roleCode="";
                      this.Create.description="";
                      this.Create.checkedMenu="";
                      this.Create.checkedResource="";
                      this.update = false;
                    }else{
                      rLoading.close();
                      this.isShow = false;
                      this.$message.error("修改失败");
                      this.update = false;
                    }
                  })
                }
            }else{
              this.$message({
                message:"请填写菜单授权信息",
                type:"warning"
              })
            }
          }else{
            this.$message({
              message:"请填充完整信息",
              type:"warning"
            })
          }
        })
    },
    //点开树形结构的回调
    renderContent(h, { node, data, store }) {
        return (
        <span class="custom-tree-node" style="width:100%">
          <span class="box">{node.key}</span>
        </span>
        );
    },
  },
  created() {
    this.StartGetRole();
    this.StartGetMenu();
    this.StartGetResource();
    this.StartGetRoleType();
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
.el-dialog{
  overflow: hidden;
}
</style>

