<template>
    <div>
        <!-- form表单操作 -->
        <el-row :gutter="10">
            <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                    <el-select v-model="cloudType" placeholder="请选择类型" @change="headChange()">
                        <el-option
                        v-for="item in Types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                    <el-select v-model="regionId" placeholder="请选择区域" @change="headPlaceChange()">
                        <el-option
                        v-for="item in PlaceList"
                        :key="item.regionId"
                        :label="item.localName"
                        :value="item.regionId">
                        </el-option>
                    </el-select>
                </div>
            </el-col>

            <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                    <el-input v-model="SearchName" placeholder="IP"></el-input>
                </div>
            </el-col>
            <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="grid-content bg-purple-light">
                    <el-button class="btns" @click="SearchNetwork()">网络查询</el-button>
                </div>
            </el-col>
            <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="grid-content bg-purple-light">
                    <el-button type="primary" class="btns" @click="CreateNetwork()">网络创建</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 展示区table -->
        <el-table
        class="user_list"
        :data="switchList"
        :header-cell-style="{background:'#F5F7FA'}"
        border
        style="width: 100%"
        >
        <el-table-column prop="cidrBlock" label="cidrBlock" width="200"></el-table-column>
        <el-table-column prop="availableIpAddressCount" label="可用地址数" width="150"></el-table-column>
        <el-table-column prop="description" label="描述" width="200"></el-table-column>
        <el-table-column label="状态" width="120">
            <template slot-scope="scope">
                <span>{{Status(scope.row.status)}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="creationTime" label="创建时间" ></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="delSwitch(scope.$index, scope.row)">删除</el-button>
                <el-button type="warning" size="mini" @click="updateSwitch(scope.$index,scope.row)">编辑</el-button>
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
        <el-dialog title="交换机" :visible.sync="isShow" @close="Clear()" :destroy-on-close="true">
            <el-form :model="Create" :rules="rules" ref="Create">
                <!-- 必填 -->   
                <el-form-item label="cidrBlock" :label-width="formLabelWidth" prop="IP">
                    <el-input v-model="Create.IP" autocomplete="off" :disabled="isUpdate"></el-input>
                </el-form-item>
                <el-form-item label="垂直开关" :label-width="formLabelWidth">
                    <el-input v-model="Create.vswitchName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="Create.description" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 必填 -->
                <el-form-item label="服务器类型" :label-width="formLabelWidth" prop="type">
                    <el-select v-model="Create.type" placeholder="请选择类型" @change="DiaChange()" :disabled="isUpdate">
                        <el-option
                        v-for="item in Types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 必填 -->
                <el-form-item label="云账号" :label-width="formLabelWidth" prop="AccountID" v-show="Create.type != null">
                    <el-select v-model="Create.AccountID" placeholder="请选择类型">
                        <el-option
                        v-for="item in AccountIDs"
                        :key="item.id"
                        :label="item.accessKeyId"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 必填 -->
                <el-form-item label="所属区域" :label-width="formLabelWidth" prop="regionID" v-show="Create.type != null && !isUpdate">
                    <el-select v-model="Create.regionID" placeholder="请选择区域" @change="PlaceChange()" :disabled="isUpdate">
                        <el-option
                        v-for="item in DiaPlaceList"
                        :key="item.regionId"
                        :label="item.localName"
                        :value="item.regionId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 必填 -->
                <el-form-item label="分区" :label-width="formLabelWidth" prop="type" v-show="Create.regionID != null || isUpdate">
                    <el-select v-model="Create.ZoneID" placeholder="请选择类型" @change="DiaChange()" :disabled="isUpdate">
                        <el-option
                        v-for="item in ZoneList"
                        :key="item.zoneId"
                        :label="item.localName"
                        :value="item.zoneId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 必填 -->
                <el-form-item label="专有网络" :label-width="formLabelWidth" prop="vpcID" v-show="Create.regionID != null || isUpdate">
                    <el-select v-model="Create.VpcID" placeholder="请选择类型" @change="DiaChange()" :disabled="isUpdate">
                        <el-option
                        v-for="item in vpcList"
                        :key="item.vpcId"
                        :label="item.vpcName"
                        :value="item.vpcId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="addSwitch()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 删除的Dialog -->
        <el-dialog title="删除交换机" :visible.sync="isDel" @close="Clear()" :destroy-on-close="true">
            <el-form :model="Del" :rules="rules" ref="Del">
                <el-form-item label="云账号" :label-width="formLabelWidth" prop="AccountID">
                    <el-select v-model="Del.AccountID" placeholder="请选择类型">
                        <el-option
                        v-for="item in AccountIDs"
                        :key="item.id"
                        :label="item.accessKeyId"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDel = false">取 消</el-button>
                <el-button type="primary" @click="delSureSwitch()">确 定</el-button>
            </div>
        </el-dialog>        
    </div>
</template>

<script>
    import { getAllHost, getAllPlace, getAllSwitch, getCloudAccount, getZoneList, getAllProper, addSwitch, UpdateSwitch, DelSwitch } from "@/servise"
    export default {
        name:"Switchs",
        data() {
            return {
                cloudType:null,
                regionId:null,
                switchList:[],
                AccountIDs:[],//根据类型获取的云账号
                PlaceList:[],//非dialog的所属区域
                DiaPlaceList:[],//dialog的所属区域
                ZoneList:[],//分区列表
                vpcList:[],//vpc列表
                //分页器数据
                pageSize: 10,
                page: 1,
                total: 0,
                SearchName:null,//搜索内容
                isShow:false,//创建Dialog状态
                isDel:false,//删除Dialog状态
                isUpdate:false,//判断是修改还是添加
                formLabelWidth:'120px',
                //创建交换机
                Create:{
                    IP:null,   //172.26.64.0/20
                    vswitchName:null,
                    description:null,
                    type:null,
                    AccountID:null,
                    regionID:null,
                    ZoneID:null,
                    VpcID:null,
                    vswitchId:null,
                },
                //删除交换机
                Del:{
                    AccountID:null,
                },
                DelScoped:null,
                //创建类型
                Types:[
                    {value:"ALIBABACLOUD",label:"阿里云"},
                    {value:"TENCENTCLOUD",label:"腾讯云"},
                    {value:"AWS",label:"aws"},
                    {value:"VMWARE",label:"vmware"},
                ],
                
                //校验
                rules:{
                    IP: [
                        { required: true, message: '请输入IP', trigger: 'blur' },
                    ],
                    VpcID:[
                        { required: true, message: '请输入VpcID', trigger: 'blur' },
                    ],
                    ZoneID:[
                        { required: true, message: '请输入ZoneID', trigger: 'blur' },
                    ],
                    type:[
                        { required: true, message: '请选择所属服务器', trigger: 'blur' },
                    ],
                    AccountID:[
                        { required: true, message: '请输入AccountID', trigger: 'blur' },
                    ],
                    regionID:[
                        { required: true, message: '请选择所属区域', trigger: 'blur' },
                    ]
                },
            }
        },
        methods: {
            //开始获取全部网络列表
            getProper(){
                getAllSwitch({
                    regionId:this.regionId,
                    cloudType:this.cloudType,
                }).then(res => {
                    if(res.code === "000000"){
                        this.switchList = res.data;
                    }
                })
            },
            //table表格内单个列表状态
            Status(val){
                if(val == "Available"){
                    return "可用"
                }
            },
            //点击分页器页数改变
            countChange(page){

            },
            //点击创建交换机时
            CreateNetwork(){
                this.isShow = true;
                this.isUpdate = false;
            },
            //搜索
            SearchNetwork(){

            },
            Clear(){
                this.Create.IP = null;
                this.Create.type = null;
                this.Create.AccountID = null;
                this.Create.type = null;
                this.Create.description = null;
                this.Create.regionID = null;
                this.Create.VpcID = null;
                this.Create.vswitchName = null;
                this.Create.ZoneID = null;
            },
            //头部 ⑴ Table获取
            Table(){
                getAllSwitch({
                    cloudType:this.cloudType,
                    regionId:this.regionId
                }).then(res => {
                    if(res.code === "000000"){
                        this.switchList = res.data;
                    }
                })
            },
            //头部 - 服务器类型改变时
            headChange(){
                const rLoading = this.openLoading();
                getAllPlace({
                    cloudType:this.cloudType
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
            //头部 - 地区改变
            headPlaceChange(){
                this.Table();
            },
            // ⑴ 获取阿里云账号
            CloudAccount(val){
                getCloudAccount({
                    type:val,
                }).then(res => {
                    if(res.code === "000000"){
                        this.AccountIDs = res.data
                    }
                })
            },
            // ⑵ 获取分区
            Zone(){
                getZoneList({
                    regionId:this.Create.regionID,
                    cloudType:this.Create.type 
                }).then(res => {
                    if(res.code === "000000"){
                        this.ZoneList = res.data;
                    }
                })
            },
            // ⑶ 获取专有网络
            Proper(){
                getAllProper({
                    regionId:this.Create.regionID,
                    cloudType:this.Create.type
                }).then(res => {
                    console.log(res);
                    if(res.code === "000000"){
                        this.vpcList = res.data;
                    }
                })
            },
            //dialog的服务器类型改变
            DiaChange(){
                this.CloudAccount(this.Create.type);
                getAllPlace({
                    cloudType:this.Create.type
                }).then(res => {
                    if(res.code === "000000"){
                        this.DiaPlaceList = res.data;
                    }else{
                        this.$message.error("地区获取失败")
                    }
                })
            },
            //regionID改变时
            PlaceChange(){
                this.Zone();
                this.Proper();
            },
            //新增交换机
            addSwitch(){
                var Create = {
                    cidrBlock:this.Create.IP,
                    cloudAccountId:this.Create.AccountID,
                    cloudType:this.Create.type,
                    description:this.Create.description,
                    regionId:this.Create.regionID,
                    vpcId:this.Create.VpcID,
                    vswitchName:this.Create.vswitchName,
                    zoneId:this.Create.ZoneID,
                }
                var Update = {
                    cloudAccountId:this.Create.AccountID,
                    cloudType:this.Create.type,
                    description:this.Create.description,
                    vswitchName:this.Create.vswitchName,
                    regionId:this.regionId,
                    vswitchId:this.Create.vswitchId
                }
                this.$refs.Create.validate((valid) => {
                    if(valid){
                        if(!this.isUpdate){
                            addSwitch(Create).then(res => {
                                if(res.code === "000000"){
                                    this.isShow = false;
                                    this.$message.success("新增交换机成功")
                                    this.Table();
                                }else{
                                    this.isShow = false;
                                    this.$message.error("新增交换机失败")
                                }
                            })
                        }else{
                            UpdateSwitch(Update).then(res => {
                                if(res.code === "000000"){
                                    this.isShow = false;
                                    this.Table();
                                    this.$message.success("修改成功");
                                }else{
                                    this.$message.error("修改失败")
                                }
                            })
                        }
                    }
                })
            },
            //删除交换机按钮
            delSwitch(index,scoped){
                this.DelScoped = scoped;
                this.CloudAccount(this.cloudType);
                this.isDel = true;
            },
            //删除确定按钮
            delSureSwitch(){
                this.$refs.Del.validate((valid) => {
                    if(valid){
                        DelSwitch({
                            regionId:this.regionId,
                            vswitchId:this.DelScoped.vswitchId,
                            cloudAccountId:this.Del.AccountID,
                            cloudType:this.DelScoped.cloudType,  
                        }).then(res => {
                            if(res.code === "000000"){
                                this.$message.success("删除成功");
                                this.isDel = false
                                this.Table();
                            }else{
                                this.$message.error("删除失败");
                                this.isDel = false;
                            }
                        })
                    }
                })
                
            },
            //修改交换机
            updateSwitch(index,scoped){
                this.isUpdate = true;
                this.isShow = true;
                this.Create.IP = scoped.cidrBlock;
                this.Create.vswitchName = scoped.vswitchName;
                this.Create.description = scoped.description;
                this.Create.type = scoped.cloudType;
                this.Create.ZoneID = scoped.zoneId;
                this.Create.VpcID = scoped.vpcId;
                this.Create.regionID = this.regionId;
                this.Create.vswitchId = scoped.vswitchId;
                this.CloudAccount(this.Create.type);
                this.Zone();
                this.Proper();
            }
        },
    }
</script>

<style lang="scss" scoped>
.block{
    margin-top:20px;
    float: right;
}
.user_list{
    margin-top: 20px;
}
//按钮
.btns {
  width: 100%;
  // text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: hidden;
}
</style>