<template>
  <div class="shell-wrapp">
      <el-row :gutter="10">
        <!-- 选择服务器类型,默认：阿里巴巴 -->
        <el-col :xs="10" :sm="7" :md="5" :lg="4" :xl="4">
            <div class="grid-content bg-purple">
              <el-select v-model="SelectType" placeholder="默认服务器：阿里云" @change="ChangeType()" style="width:100%">
                <el-option
                v-for="item in Types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </div>
        </el-col>
        <!-- 选择Ansible下拉框 -->
        <el-col :xs="10" :sm="7" :md="5" :lg="4" :xl="4">
          <div class="grid-content bg-purple">
            <el-select v-model="SelectedIP" placeholder="请选择Ansible" style="width:100%">
              <el-option
              v-for="item in AnsibleIP"
              :key="item.id"
              :label="item.ip"
              :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <!-- 命令框 -->
        <el-col :xs="10" :sm="7" :md="5" :lg="4" :xl="4">
            <div class="grid-content bg-purple">
              <el-input v-model="command" placeholder="请输入命令" style="width:100%"></el-input>
            </div>
        </el-col>
        <el-col :xs="6" :sm="5" :md="4" :lg="3" :xl="3">
          <div class="grid-content bg-purple">
            <el-button type="success" @click="runexecute" style="width:100%">立即执行</el-button>
          </div>
        </el-col>
        <el-col :xs="6" :sm="5" :md="4" :lg="3" :xl="3">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="newHost" style="width:100%">添加主机</el-button>
          </div>
        </el-col>
      </el-row>  
      
      <div class="header">
        <div class="header-left">
          <span>汇总:</span>
        </div>
      </div>
    <div class="shell-content">
      <el-card class="box-card" style="border:1px solid #409EFF" v-show="cardArray"
       v-for="card in cardArray"  :key="card.index">
        <div slot="header" class="clearfix">
          <el-tooltip placement="top">
            <div slot="content">主机名称:{{card.name}}<br/>
              实例ID:{{card.executeWay}}<br/>
              公网IP:{{card.publicIp}}<br/>
              内网IP:{{card.privateIp}}<br/>
            </div>
            <el-button class="card-title">
              <i class="el-icon-monitor"></i>
              <span>{{card.name}}</span>
            </el-button>
          </el-tooltip>
          <el-button v-if="success" class="success" :type="success ? 'success' : 'danger'">{{success ?'成功' : '失败'}}</el-button>
          <el-button class="success" type="danger" @click="clearScreen(card.privateIp)">清屏</el-button>
          <el-button style="float: right; padding: 3px 0" @click="clearCard(card)" type="text"><i class="el-icon-close"></i></el-button>
        </div>
        <div class="text item">
          <span v-show="getItem(card.privateIp) != NaN">{{getItem(card.privateIp)}}</span>
        </div>
        <div class="card-footer">
          <el-input class="card-input" v-model="card.content"></el-input>
          <el-button class="card-button" type="primary" @click="CarryOne(card.privateIp,card.content)">执行</el-button>
        </div>
      </el-card>
    </div>
    <!-- 新增主机 -->
    <CommonDialog :typeNum="typeNum"></CommonDialog>
  </div>
</template>

<script>
import {
  executeCommand,
  getAllVmware,
  addHost,
  deleteHost,
  searchHost,
  getAllHost,
  getAllAnsible,
  getAllPlace
  }from '@/servise/index'
  import CommonDialog from "@/views/task/CommonDialog"
export default {
  components:{ CommonDialog},
  data(){
    return{
      typeNum:1,  //当前文件页面的类型数
      DiaSelect:"",//dialog的服务器类型选择
      PlaceSelect:"",//dialog的地区选择
      PlaceList:[],//
      optionsValue:[],//选择下拉框，获取主机
      success:null,
      runResult:[],
      switchProcess:false,//进程开关
      switchInstruct:false,//指令开关
      command:null,//命令
      ips:'10.152.240.108,',
      ips2:'10.152.240.109',
      executeWay :'000',//主机类型
      selectionHostList:[],  //勾选checkout的数组
      cardArray:[],
      //所有主机列表
      ips3:null,
      HostCont:[],//添加的全部主机信息
      CarryOneMsg:{},//执行单个主机(清空之后)的输入框
      Types:[//类型
          {value:"ALIBABACLOUD",label:"阿里云"},
          {value:"TENCENTCLOUD",label:"腾讯云"},
          {value:"AWS",label:"aws"},
          {value:"VMWARE",label:"vmware"},
      ],
      SelectType:"ALIBABACLOUD",//服务器类型
      AnsibleIP:[],//选择好类型后接口获取的对应类型IP
      SelectedIP:null,//服务器IP
      allIP:[],//全部对应服务器ID
      
    }
  },
  methods:{
    //改变主机类型时
    ChangeType(){
      this.AnsibleIP = [];
      const rLoading = this.openLoading();
      searchHost({
        type:1,
        cloudType:this.SelectType
      }).then(res => {
        if(res.code === "000000"){
          rLoading.close();
          if(res.data){
            this.cardArray = res.data
            let IP = "";
            res.data.forEach((v,i) =>{
              IP += v.privateIp + ","
            })
            if(res.data.length != 1){
              IP = IP.substr(0,IP.length-1);
              this.ips3 = IP
            }else{
              this.ips3 = IP
            }
          }else{
            this.cardArray = [];
          }
        }else{
          rLoading.close();
          this.$message.error("数据获取失败")
        }
      })
      this.StartGetIPS();
    },
    //开始获取对应主机类型的全部IP
    StartGetIPS(){
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
    //选择好类型后选择IP
    searchHostApi(){
      searchHost(
        {type:1,cloudType:"ALIBABACLOUD"}
      ).then(res=>{
        if(res.code === '000000'){
          //拿到主机对应服务器的全部主机ID
          if(res.data){
            this.cardArray = res.data
            let IP = "";
            let allIP = [];
            res.data.forEach((v,i) =>{
              IP += v.privateIp + ","
              allIP.unshift(v.privateIp);
            })
            this.allIP = allIP
            if(res.data.length != 1){
              IP = IP.substr(0,IP.length-1);
              this.ips3 = IP
            }else{
              this.ips3 = IP
            }
          }else{
            this.cardArray = [];
          }
        }
      })
    },
    //添加主机
    newHost(){
      this.$store.commit("HostShowOpen"); 
    },
    //删除主机
    clearCard(event){
      this.$confirm(`确定要将${event.name}从控制台删除吗, 删除后可重新从主机添加`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rLoading = this.openLoading();
          deleteHost({
            ids:event.id
          }).then(res=>{
            if(res.code === '000000'){
              rLoading.close();
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.searchHostApi();
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
    //立即执行(全部)
    runexecute(){
      if(this.command){
        const rLoading = this.openLoading();
        executeCommand({
          ips:this.ips3,
          command:this.command,
          executeWay:this.executeWay,
          ansibleId:this.SelectedIP
        }).then(res=>{
          if(res.code==='000000'){
            rLoading.close();
            console.log(res);
            this.runResult = res.data.substr(8)//不能注释
            var arr = res.data.substr(8);
            let ContArray = [];
            if(this.cardArray.length == 1){
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
            this.$message.error("执行失败")
          }
        })
      }else{
        alert('请填写完整')
      }
    },
    //清屏
    clearScreen(val){
      var Clear = this.HostCont.filter((v,i) => {
        return v.indexOf(val) == -1
      })
      this.HostCont = Clear;
    },
    //截取分开主机内容----(GSS)
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
    //执行(清屏之后)
    CarryOne(ips,cont){
      if(this.CarryOneMsg == null){
        this.$message.error("请输入执行命令");
      }else{
        const rLoading = this.openLoading();
        executeCommand({
          ips:ips+",",
          command:cont,
          executeWay:this.executeWay,
          ansibleId:this.SelectedIP
        }).then(res => {
          if(res.code === "000000"){
            //再添加回数组
            rLoading.close();
            var str = res.data.substr(8);
            this.HostCont.push(str);
            this.$message({
              message:"执行成功",
              type:"success"
            })
          }else{
            rLoading.close();
            this.$message.error("执行失败")
          }
        })
      }
    }

  },
  created(){
    this.searchHostApi()//获取已添加的主机
    this.StartGetIPS();
  },
  
}
</script>

<style lang="scss" scoped>
// 选择服务器类型 栅格
.el-col {
  border-radius: 4px;
  margin-bottom:15px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple{
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
//---------------------------------
//  .el-input{
//   display: inline-block;
//   width: 200px;
//   margin: 8px;
//  }
 .shell-header{
   position: relative;
 }
 .el-icon-question{
   font-size: 19px;
   color: #409EFF;
   position: absolute;
   left: 393px;
   top: 19px;
 }
 .header{
   
   .header-left{
    display: inline-block;
    margin-top: 5px;
    font-size: 16px;
 }
  ul{
   float: right;
   display: flex;
   margin:5px 35px 0px 0px;
    li{
    margin-left: 20px;
    font-size: 16px;
    color: black;
    }
  }
 }
 .box-card{
   position: relative;
    display: inline-block;
    width: 430px;
    margin: 30px 42px;
 }
 .el-card__header{
   background:#B0C4DE;
 }
 .el-card__body{
   height: 200px;
 }
 .header{
   margin-top: 10px;
 }
 
  
  .el-card{
    position: relative;
    height: 260px;
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
  .success{
    width: 61px;
    height: 32px;
    font-size: 11px;
    text-align: center;
    margin-left: 144px;
    span{
      line-height: 0px;
    }
  }
  .card-tips{
    position: absolute;
    left: 0px;
    top: 0px;
    width: 200px;
    height: 200px;
    background: pink;
  }
  .card-title{
    background: #F5F5F5;
    border: none;
  }
  .el-divider--horizontal{
    margin: 5px 0px;
  }
</style>
<style>
 .el-card__body{
   height: 134px;
 }
 .el-card__header{
    background: #F5F5F5;
    height: 55px;
 } 
 
</style>