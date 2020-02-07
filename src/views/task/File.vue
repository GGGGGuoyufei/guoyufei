<template>
  <div class="script-wrapp">
        <!-- 下拉框 -->
        <el-row :gutter="10">
          <el-col :xs="10" :sm="8" :md="6" :lg="4" :xl="4">
            <div class="grid-content bg-purple">
              <el-select v-model="SelectType" placeholder="请选择服务器类型" @change="ChangeType()" style="width:100%;">
                  <el-option
                  v-for="item in Types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="10" :sm="8" :md="6" :lg="4" :xl="4">
            <div class="grid-content bg-purple">
              <el-select v-model="SelectedIP" placeholder="请选择IP" style="width:100%;">
                  <el-option
                  v-for="item in AnsibleIP"
                  :key="item.id"
                  :label="item.ip"
                  :value="item.id">
                  </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="10" :sm="8" :md="6" :lg="4" :xl="4">
            <div class="grid-content bg-purple">
              <el-input v-model="targetDir" placeholder="请输入目标路径"></el-input>
            </div>
          </el-col>
          <el-col :xs="10" :sm="6" :md="4" :lg="3" :xl="3">
            <div class="grid-content bg-purple">
              <el-button type="primary"  icon="el-icon-circle-plus-outline" @click="addHostBtn()">添加主机</el-button>
            </div>
          </el-col>
          <!-- 文件分发按钮 -->
          <el-col :xs="10" :sm="6" :md="4" :lg="3" :xl="3">
            <div class="grid-content bg-purple">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="/cmp/assignment/fileTransfer/upload"
                :show-file-list="true"
                :headers="SendHeader"
                :data="SendDatas"
                :on-change="handleChange"
                :auto-upload="false"
                :limit="limit">
                <el-button slot="trigger" icon="el-icon-collection" type="primary" style="width:100%">选取文件</el-button>
              </el-upload>
            </div>
          </el-col>
          <el-col :xs="10" :sm="6" :md="4" :lg="3" :xl="3">
            <div class="grid-content bg-purple-light">
              <el-button icon="el-icon-upload2" type="success" @click="submitUpload()">立即分发</el-button>
            </div>
          </el-col>
        </el-row>
    <!-- 已添加的主机 -->
    <el-table @selection-change="SelectionChange" :header-cell-style="{background:'#F5F7FA'}"  :data="selectionHostList" border style="margin-top:20px;">
      <el-table-column type="selection" align="center" ></el-table-column>
      <el-table-column prop="name" label="主机名称" ></el-table-column>
      <el-table-column prop="publicIp" label="公网IP" ></el-table-column>
      <el-table-column prop="privateIp" label="内网IP" ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除主机</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加主机时OPEN的Dialog -->
    <CommonDialog :typeNum="typeNum"></CommonDialog>
    <!-- 文件分发 -->
    <Drawer title="文件分发" v-model="isShow" width="720"
      :mask-closable="true"
      :draggable="true">
      <el-card class="box-card" style="border:1px solid #409EFF;" v-for="(item,key) in HostServe" :key="key">
        <div slot="header" style="" class="clearfix">
          <el-button class="card-title">
            <i class="el-icon-monitor"></i>
            <span></span>
          </el-button>
        </div>
        <div class="text item" style="box-sizing:border-box;overflow:auto">
          {{getItem(item.privateIp)}}
        </div>
      </el-card>     
    </Drawer>
  </div>
</template>

<script>
import { 
  fileTransfer,
  addHost,
  deleteHost,
  searchHost,
  getAllVmware,
  getAllAnsible,
  getAllHost,
  }from '@/servise/index'
import {getToken} from "@/utils/cookie"  
import CommonDialog from "@/views/task/CommonDialog"
export default {
  name:"File",
  components:{ CommonDialog},
  data(){
    return{
      typeNum:3,//当前文件页面的类型数
      isShow:false,
      limit:1,//最大上传个数
      input:null,//选择文件的v-model
      files:null,
      ips:null,
      targetDir:null,//目标路径 /home/appuser/fileLibrary
      hostList:[{//所有主机列表
        selection:false,
        name:null,
        publicIpprop:null,
        privateIp:null
      }],
      HostShow: false,//添加主机的Dialog框状态
      selectionHostList:[],//《开始获取全部添加过的主机 Table》
      //发送的参数
      SendData:{
        ips:'10.152.240.108',
        targetDir:'/home/appuser/fileLibrary',
      },
      SendHeader:{//传输文件请求头
        "Authorization": `Bearer ${getToken()}`,
      },
      File:null,
      HostServe:null,
      fileData:null,//清屏
      runResult:null,//切割返回主机信息值用
      HostCont:[],//切割完后装数组
      Types:[//类型
          {value:"ALIBABACLOUD",label:"阿里云"},
          {value:"TENCENTCLOUD",label:"腾讯云"},
          {value:"AWS",label:"aws"},
          {value:"VMWARE",label:"vmware"},
      ],
      SelectType:"ALIBABACLOUD",//选择类型
      SelectedIP:null,//当类型为VMWARE时,出现的Ansible选择框
      AnsibleIP:[],   //全部Ansible的IP
      HostSelected:[],//添加主机 => 下拉选择框 => Vmodel
      HostTable:[],   //添加主机 => Table内容
      allIP:[],       //立即执行时勾选的主机IP
    }
  },
  computed: {
    SendDatas:function(){
      return {
        ips:'10.152.240.108',
        targetDir:'/home/appuser/fileLibrary',
      }
    }
  },
  methods:{
    //点击添加主机按钮
    addHostBtn(){
      this.$store.commit("HostShowOpen"); 
    },
    //选择已添加完成主机触发的checkout
    SelectionChange(val){
      this.HostServe=val;
      let allIP = [];
      val.forEach((v,i) =>{
        allIP.unshift(v.privateIp);
      })
      this.allIP = allIP
    },
    //点击上传到服务器------------------------------------------------
    submitUpload() {
      let fd = new FormData();
      fd.append("files",this.File);
      //IPS
      if(this.HostServe != null){
        var IP = "";
        this.HostServe.forEach((v,i) =>{
          IP += v.privateIp + ","
        })
        if(this.HostServe.length != 1){
          IP = IP.substr(0,IP.length-1);
        }
      }else{
        this.$message.error("请选择主机")
        return false;
      }
      const rLoading = this.openLoading();
      fileTransfer(fd,{
        ips:IP,
        targetDir:this.targetDir,
        ansibleId:this.SelectedIP,
      }).then(res => {
        if(res.code === "000000"){
          var Res = res.data.commandResults[0]
          rLoading.close();
          this.isShow = true;
          this.runResult = Res.substr(8)//不能注释
          var arr = Res.substr(8);
          let ContArray = [];
          if(this.selectionHostList.length == 1){
            ContArray.push(arr);
            this.HostCont = ContArray;
          }else{
            var Box = this.allIP;
              for(let i = 0;i < Box.length;i++){
                var arr = arr.replace(new RegExp(Box[i],'g'), "囧"+Box[i]);
              }
              var newArr = arr.split("囧");
              newArr.shift();
              this.HostCont = newArr;
          }
        }else{
          rLoading.close();
          this.$message.error("上传失败")
        }
      })
    },
    //主机返回值
    getItem(val){
      if(this.HostCont.length === 0){
        return ""
      }else{
        var myEnd = this.HostCont.filter((v,i) => {
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
    handleChange(file, fileList) {
      this.File = file.raw;
    },
//--------------------------------------------------------------
    //《开始获取已添加的主机》
    searchHostApi(){
      const rLoading = this.openLoading();
      searchHost({
          type:3,
          cloudType:this.SelectType,
        }).then(res=>{
        if(res.code==='000000'){
          rLoading.close();
          this.selectionHostList = res.data
        }
      })
    },
    fileUpload(event){
      console.log(event);
      let file = event.target.files
      let formData = new FormData()
      formData.append('ips', this.ips)
      formData.append('targetDir', this.targetDir)
      formData.append('files', file[0])
      console.log(formData);
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
              alert('请求出错')
            }
          })  
        }).catch(() => {
          rLoading.close();
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //《服务器类型改变时获取对应Ansible的IP》下拉框 => 下拉框
    ChangeType(){
      const rLoading = this.openLoading();
      getAllAnsible({
        serverType:this.SelectType
      }).then(res => {
          console.log(res);
          if(res.code === "000000"){
            rLoading.close();
              this.AnsibleIP = res.data.records;
          }
      })
    },
    // 《开始获取对应服务器类型的全部IP》
    StartGetIPS(){
      const rLoading = this.openLoading();
      getAllAnsible({
        serverType:this.SelectType
      }).then(res => {
          console.log(res);
          if(res.code === "000000"){
            rLoading.close();
              this.AnsibleIP = res.data.records;
          }
      })
    },
    //《添加主机 => V-modle改变时请求》
    HostSelectChange(val){
      const rLoading = this.openLoading();
      console.log(val)
        let SelectedID = val[val.length-1];
        let SelectedType = val[0];
        getAllHost({
          regionId:SelectedID,
          cloudType:SelectedType,
       }).then(res=>{
         if(res.code === '000000'){
           rLoading.close();
           this.HostTable = res.data
         }
       })
    },
  },
  mounted(){
    this.searchHostApi()//获取已添加的主机
    this.StartGetIPS();
  },
}
</script>

<style lang="scss" scoped>
// 24栅格
.el-col {
    border-radius: 4px;
    margin-bottom:10px;
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
    .el-button{
      width:100%;
    }
}
//up-load
/deep/ .el-upload{
  width:100%;
}
// el-upload-list--text
/deep/ .el-upload-list{
  position: absolute;
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
  
  .card-btn{
    float: right;
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
  .el-card__body{
    min-height: 134px !important;
  }
   .select-ip{
       margin-left:5px;
     }
</style>

