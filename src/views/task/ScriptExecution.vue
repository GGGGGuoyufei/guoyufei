<template>
  <div class="script-wrapp">
    <el-row :gutter="10">
      <!-- 主机类型下拉框 -->
      <el-col :xs="10" :sm="8" :md="4" :lg="4" :xl="4">
        <div class="grid-content bg-purple">
            <el-select v-model="SelectType" placeholder="默认服务器：阿里云" @change="ChangeType()" style="width:100%;">
                <el-option
                v-for="item in Types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
          </div>
      </el-col>
      <!-- AnsibleIP下拉框 -->
      <el-col :xs="10" :sm="8" :md="4" :lg="4" :xl="4">
        <div class="grid-content bg-purple">
          <el-select v-model="SelectedIP" placeholder="请选择Ansible" style="width:100%;">
            <el-option
            v-for="item in AnsibleIP"
            :key="item.id"
            :label="item.ip"
            :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <!-- 选择脚本库 -->
      <el-col :xs="10" :sm="8" :md="4" :lg="4" :xl="4">
        <div class="grid-content bg-purple">
          <el-select v-model="ScriptDep" @change='select' placeholder="请选择脚本库" style="margin-right:5px;width:100%;">
            <el-option v-for="menu in menuData" :key="menu.value" :label="menu.name" :value="menu.id" >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <!-- 选择脚本名称 -->
      <el-col :xs="10" :sm="8" :md="4" :lg="4" :xl="4">
        <div class="grid-content bg-purple">
          <el-select v-model="SelecedName" placeholder="请选择脚本名称" style="width:100%;">
            <el-option
              v-for="item in ScriptAllName"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <!-- 按钮 -->
      <el-col :xs="10" :sm="5" :md="4" :lg="3" :xl="3">
        <div class="grid-content bg-purple">
          <el-button type="success" class="btn" icon="el-icon-video-play" @click="runScriptBtn()" style="width:100%;">立即执行</el-button>
        </div>
      </el-col>
      <!--  -->
      <el-col :xs="10" :sm="5" :md="4" :lg="3" :xl="3">
        <div class="grid-content bg-purple ">
          <el-button class="btn" type="primary" icon="el-icon-circle-plus-outline" @click="addHost" style="width:100%;">添加主机</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 动态添加的input框 -->
    <el-row :gutter="10">
      <el-col :xs="10" :sm="8" :md="4" :lg="4" :xl="4" v-for="(item,key) in Params" :key="key">
        <div class="grid-content bg-purple ">
          <el-input type="text" v-model="item.txt" style="width:100%" placeholder="请输入脚本参数"></el-input>
        </div>
      </el-col>
      <el-col :xs="10" :sm="8" :md="4" :lg="4" :xl="4">
        <div class="grid-content bg-purple ">
          <el-button icon="el-icon-plus" circle title="点击添加下一个参数" @click="addParams()"></el-button>
          <el-button icon="el-icon-minus" circle title="点击删除多余参数" @click="delParams()"></el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 已添加的主机 -->
    <el-table @selection-change="RunSelect" :header-cell-style="{background:'#F5F7FA'}" :data="selectionHostList" border style="margin-top:20px;">
      <el-table-column type="selection" align="center" ></el-table-column>
      <el-table-column prop="name" label="主机名称" width="150"></el-table-column>
      <el-table-column prop="publicIp" label="公网IP" ></el-table-column>
      <el-table-column prop="privateIp" label="内网IP" ></el-table-column>
      <el-table-column label="操作" width="150" align="center">                      
        <template slot-scope="scope" >
          <el-button type="warning" size="mini" @click="handleDelete(scope.$index, scope.row)">删除主机</el-button>
        </template>             
      </el-table-column>
    </el-table>
    <!-- 新增主机弹出的Dialog框 -->
    <CommonDialog :typeNum="typeNum"></CommonDialog>
    <!-- 脚本执行 -->
    <Drawer title="脚本执行" v-model="isShow" width="720"
      :mask-closable="true"
      :draggable="true">
      <el-card class="box-card" style="border:1px solid #409EFF" v-for="(item,key) in runScriptHostList" :key="key">
        <div slot="header" class="clearfix">
          <el-button class="card-title">
            <i class="el-icon-monitor"></i>
            <span>{{item.name}}</span>
          </el-button>
          <!-- <el-button class="success" type="danger" @click="clearScreen">清屏</el-button> -->
          <!-- <el-button style="padding: 3px 0" type="text" @click="clearCard(runScriptHostList)">X</el-button> -->
        </div>
        <div class="text item">
          {{getContent(item.privateIp)}}
        </div>
      </el-card>     
    </Drawer>
  </div>
</template>

<script>
import{
  getAllScriptStore,
  getScript,
  getAllVmware,
  addHost,
  searchHost,
  runScript,
  deleteHost,
  getAllHost,
  getAllAnsible
  } from "@/servise/index"
import { type } from 'os'
import CommonDialog from "@/views/task/CommonDialog"
let id = null;
export default {
  components:{ CommonDialog},
  data(){
    return{
      typeNum:2,//当前文件页面的类型数
      isShow:false,//右侧抽屉状态
      value:null,
      inputNone:false,
      textarea:null,
      menuData:[],
      ScriptDep:null,//选择脚本库
      seleceScriptId:null,//选择好的脚本库ID
      ScriptAllName:[],//由ID选择的全部脚本名称
      SelecedName:null,//选择好的脚本名称
      selectionHostList:[],
      runScriptHostList:[],//立即执行前的选择主机
      dialogFormVisible:false,//添加主机的dialog框
      hostList:[],//获取到的所有主机
      runScriptItem:{},
      timeout:'300',
      ScriptRes:[],//立即执行完后返回的数据
      optionsValue:[],
      CheckedHost:[],
      SelectType:"ALIBABACLOUD",//当前页面选择的主机类型
      Types:[//类型
          {value:"ALIBABACLOUD",label:"阿里云"},
          {value:"TENCENTCLOUD",label:"腾讯云"},
          {value:"AWS",label:"aws"},
          {value:"VMWARE",label:"vmware"},
      ],
      SelectedIP:null,//选择当前页面的AnsibleIP
      AnsibleIP:[],//选择好类型后接口获取的对应类型IP
      runResult:'', //暂存截取success后的字符串
      allIP:[],//开始存取获取到的主机的全部IP
      Params:[
        {txt:""},
      ],//脚本参数
    }

  },
  created(){
    this.getAllScriptStoreApi()//获取所有脚本库
    this.searchHostApi()//获取已添加的主机
    this.StartGetAnsible();
  },
  methods:{
    //动态添加脚本参数框
    addParams(){
      var obj = {txt:""};
      this.Params.push(obj);
    },
    //动态删除脚本参数框
    delParams(){
      this.Params.pop();
    },
    //添加主机按钮--dialog框---table
    AddHost(val){
      this.CheckedHost = val;
    },
    ///二级联动改变事件
    handleChange(){//根据下拉框的值，请求主机
      const rLoading = this.openLoading();
      if(this.optionsValue.length == 1){
        getAllHost({
         cloudType:this.optionsValue[0]
       }).then(res=>{
         if(res.code === '000000'){
           rLoading.close();
           this.hostList = res.data
         }else{
           rLoading.close();
           this.$message.error("数据获取失败")
         }
       })
      }else{
        getAllHost({
         cloudType:this.optionsValue[0],
         regionId:this.optionsValue[1]
        }).then(res=>{
         if(res.code === '000000'){
           rLoading.close();
           this.hostList = res.data
         }else{
           rLoading.close();
           this.$message.error("数据获取失败")
         }
       })
      } 
    },
    //开始根据当前的服务器类型获取Ansible的全部IP
    StartGetAnsible(){
      const rLoading = this.openLoading();
      getAllAnsible({
        serverType:this.SelectType
      }).then(res => {
          if(res.code === "000000"){
            rLoading.close();
              this.AnsibleIP = res.data.records;
          }
      })
    },
    ChangeType(){
      this.StartGetAnsible();
    },
    // -
    getAllScriptStoreApi(){
      getAllScriptStore().then(res=>{
        this.menuData=res.data
      })
    },
    //获取已添加的主机
    searchHostApi(){
      const rLoading = this.openLoading();
      searchHost(
        {type:2,cloudType:this.SelectType}
      ).then(res=>{
        if(res.code==='000000'){
          rLoading.close();
          this.selectionHostList = res.data
          let allIP = [];
          res.data.forEach((v,i) =>{
            allIP.unshift(v.privateIp);
          })
          this.allIP = allIP
        }
      })
    },
    //添加主机
    addHost(){
      this.$store.commit("HostShowOpen"); 
    },
    //添加主机时勾选checkout触发
    handleSelectionChange(val){
      this.selectionHostList = val;
    },
    //运行主机勾选时出发的checkout
    RunSelect(val){
      console.log(val);
      this.runScriptHostList =val;
    },
    //添加主机---确定按钮
    addHostPost(){
      const rLoading = this.openLoading();
      var addHostArray = [];
      this.CheckedHost.forEach((v,i) => {
        var obj = {
          name:v.name,
          privateIp:v.privateIp,
          publicIp:v.publicIp,
          type:2,
          cloudType:v.cloudType
        }
        addHostArray.push(obj);
      })
      addHost(addHostArray).then(res => {
         if(res.code === '000000'){
           rLoading.close();
           this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.dialogFormVisible = false
          this.searchHostApi()
         }
        }).catch(res=>{
          if(!res.code==='000000'){
            rLoading.close();
            alert('请求出错'+res.code)
        }
        })
    },
    switchInput(){
      this.inputNone = !this.inputNone
    },
    //清空主机
    resetHost(){
      this.selectionHostList = []
    },
    //判断选择的脚本库
    select(value){
      const rLoading = this.openLoading();
      this.seleceScriptId = value
      getScript({
         scriptLibraryId:value
      }).then(res=>{ 
          if(res.code === "000000"){
            rLoading.close();
            this.ScriptAllName = res.data;
          }
        })
      this.value = null
    },
    //立即执行
    runScriptBtn(){
      //获取脚本参数
        let params = [];
        this.Params.map((v,i) => {
          params.push(v.txt);
        })
      // ----------
      const rLoading = this.openLoading();
      let IPS = "";
      if(this.runScriptHostList.length == 1){
        IPS = this.runScriptHostList[0].privateIp + ","
      }else{
        this.runScriptHostList.forEach((v,i) =>{
          IPS += v.privateIp + ","
        })
        IPS = IPS.substr(0,IPS.length-1)
      }
      runScript(this.SelecedName,
        {
          ips:IPS,
          type:'LINUX_SHELL',
          ansibleId:this.SelectedIP,
          params:params
        }).then(res=>{
          if(res.code === "000000"){
            rLoading.close();
            this.isShow = true
            this.runScriptRes = res.data
            this.runResult = res.data.substr(8)//不能注释
            var arr = res.data.substr(8);
            let ContArray = [];
            // if(this.cardArray.length == 1){
            if(this.selectionHostList.length == 1){  
              ContArray.push(arr);
              this.ScriptRes = ContArray;
            }else{
              var Box = this.allIP;
              for(let i = 0;i < Box.length;i++){
                var arr = arr.replace(new RegExp(Box[i],'g'), "囧"+Box[i]);
              }
              var newArr = arr.split("囧");
              newArr.shift();
              this.ScriptRes = newArr;
            }
          }else{
            rLoading.close();
            this.$message.error("执行错误");
          }
      })
    },
    //立即执行后主机返回的内容
    getContent(val){
      if(this.ScriptRes.length === 0){
        return ""
      }else{
        var myEnd = this.ScriptRes.filter((v,i) => {
          return v.indexOf(val) != -1;
        })
        if(myEnd.length != 0){
          if(myEnd.length === 1){
            return myEnd[0]
          }else{
            return myEnd[0] + myEnd[1];
          }
        }else{
          return "";
        }
      }
    },
    //删除
    handleDelete(index,row){
      this.$confirm(`确定要将${row.name}从控制台删除吗, 删除后可重新从主机添加`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rLoading = this.openLoading();
          deleteHost({
            ids:row.id
          }).then(res=>{
            if(res.code === '000000'){
              rLoading.close();
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.searchHostApi()
            }else{
              rLoading.close();
              this.$message.error('删除失败')
            }
          })  
        }).catch(() => {
          rLoading.close();
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>

<style lang="scss" scoped>
// 选择服务器类型 栅格
.el-col {
  border-radius: 4px;
}
// .bg-purple-dark {
//   background: #99a9bf;
// }
.bg-purple {
  // background: #d3dce6;
  margin-bottom:10px;
}
// .bg-purple-light {
//   background: #e5e9f2;
// }
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}


  .header-bottom{
    width: 70%;
    margin: 20px 0px 0px 10px;
    line-height: 37px;
    font-size: 16px;
  }
  .header-bottom p{
    display: inline-block;
    margin-right: 15px;
  }
  // .history{
  //   width: 20%;
  //   height: 515px;
  //   position: absolute;
  //   right: 17px;
  //   top: 56px;
  //   border-left: 1px solid rgb(129, 126, 126);
  //   padding: 10px;

  // }
  // .history span{
  //   font-size: 18px;
  //   color: black;
  // }
  // .history p{
  //   line-height: 377px;
  //   font-size: 26px;
  //   color: gray;
  //   text-align: center;
  // }
  .block{
    margin-top: 30px;
  }
  .tips{
    color: #409EFF;
    margin-left: 9px;
    font-size: 20px;
}

 .tips-input{
   width: 200px;
 }
 .el-textarea{
   width: 737px;
   margin: 20px 0px 0px 8px;
 }
 .select{
   display: inline-block;
 }
 .select-system{
   display: inline-block;
 }
 .select-host{
   position: absolute;
   right: 65px;
   top: 90px;
   width: 200px;
   font-size: 20px;
   display: inline-block; 
   h1{
     font-size: 20px;
   }
   ul{
     border: 1px solid grey;
     width: 162px;
     flex-wrap: wrap;
     padding: 2px;
     margin-top: 10px;
     li{
       text-align: center;
       font-size: 19px;
       margin: 5px 0px;
     }
   }
 } 
  .tips{
    position: absolute;
    left: 266px;
    top: 51px;
    width: 379px;
    height: 79px;
    font-size: 13px;
    border: 1px solid #409EFF;
    background: #D9EAF8;
  } 
  .el-card{
    position: relative;
    height: 260px;
    .header{
      el-button{
        float: left;
      }
    }
  }
  .card-footer{
    position: absolute;
    left: 1px;
    top: 218px;
    width: 100%;
    .card-input{
      width: 327px;
      margin: 0px;
      width: 80%;
    }
    .card-button{
      width: 20%;
    }
  }
  .btn{
    float: none;
  }
  .box-card{
   position: relative;
   display: inline-block;
   width: 430px;
   margin: 30px 42px;
 }
 .card-title{
    background: #F5F5F5;
    border: none;
    float: left;
  }
.btn{
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}  
</style>