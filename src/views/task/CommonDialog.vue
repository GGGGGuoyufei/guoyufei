<template>
    <el-dialog title="添加主机" :visible.sync="$store.state.HostShow" class="dialog" :destroy-on-close="true" >
        <el-row :gutter="10">
          <el-col :xs="10" :sm="5" :md="5" :lg="4" :xl="4">
            <div class="grid-content bg-purple">
              <el-select v-model="DiaSelect" placeholder="请选择服务器" @change="DiaChange()">
                <el-option
                v-for="item in Types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="10" :sm="5" :md="5" :lg="4" :xl="4" v-show="DiaSelect != ''">
            <div class="grid-content bg-purple">
              <el-select v-model="PlaceSelect" placeholder="请选择服务器" @change="PlaceChange()">
                <el-option
                v-for="item in PlaceList"
                :key="item.regionId"
                :label="item.localName"
                :value="item.regionId">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-table :data="tableData" style="width:100%;margin:20px auto"
          @selection-change="handleSelectionChange" stripe border>
          <el-table-column type="selection" align="center" ></el-table-column>
          <el-table-column prop="name" label="主机名称" ></el-table-column>
          <el-table-column prop="publicIp" label="公网IP" ></el-table-column>
          <el-table-column prop="privateIp" label="内网IP" ></el-table-column>
        </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Cancel()">取 消</el-button>
        <el-button type="primary" @click="addHostPost">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
    import { getAllHost, getAllPlace, addHost } from "@/servise"
    export default {
        name:"CommonDialog",
        props:[
            "typeNum",  //文件第几状态
        ],
        data() {
            return {
                DiaSelect:'',   //服务器类型选择值
                PlaceSelect:'',//地区选择值
                Types:[         //服务器类型
                    {value:"ALIBABACLOUD",label:"阿里云"},
                    {value:"TENCENTCLOUD",label:"腾讯云"},
                    {value:"AWS",label:"aws"},
                    {value:"VMWARE",label:"vmware"},
                ],
                PlaceList:[],
                tableData:[],
            }
        },
        methods: {
            //服务器类型改变时
            DiaChange(){
                const rLoading = this.openLoading();
                getAllPlace({
                    cloudType:this.DiaSelect
                }).then(res => {
                    if(res.code === "000000"){
                    rLoading.close();
                    this.PlaceList = res.data;
                    }else{
                    rLoading.close();
                    this.$message.error("地区获取失败")
                    }
                })
            },
            //地区改变时
            PlaceChange(){
                const rLoading = this.openLoading();
                getAllHost({
                    cloudType:this.DiaSelect,
                    regionId:this.PlaceSelect,
                }).then(res => {
                    if(res.code === "000000"){
                    rLoading.close();
                    this.tableData = res.data;
                    }else{
                    rLoading.close();
                    this.$message.error("主机信息获取失败")
                    }
                })
            },
            //勾选需要添加的主机
            handleSelectionChange(val){
                this.$store.commit("CheckedHost",val);
            },
            //确定
            addHostPost(){
                const rLoading = this.openLoading();
                var SendArray = [];
                this.$store.state.selectionHostList.forEach((v,i) => {
                    var obj = {
                        name:v.name,
                        privateIp:v.privateIp,
                        publicIp:v.publicIp,
                        type:this.typeNum,
                        cloudType:v.cloudType
                    }
                    SendArray.push(obj);
                })
                //添加主机(接口)
                addHost(
                    SendArray
                ).then(res => {
                    if(res.code === '000000'){
                    rLoading.close();
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                        this.$parent.searchHostApi()
                        this.$store.commit('HostShowClose')
                    }else{
                        rLoading.close();
                        this.$message.error("添加失败")
                    }
                })
            },
            //取消按钮
            Cancel(){
                this.$store.commit("HostShowClose")
            }
        },
    }
</script>

<style lang="scss" scoped>
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
</style>