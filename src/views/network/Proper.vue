<template>
    <div>
        <!-- form表单操作 -->
        <el-row :gutter="10">
            <el-col :xs="7" :sm="6" :md="5" :lg="4" :xl="4">
                <div class="grid-content bg-purple">
                    <el-select v-model="cloudType" placeholder="请选择类型" @change="HeadTypeChange()">
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
                    <el-select v-model="regionId" placeholder="请选择区域" @change="HeadPlaceChange()">
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
        :data="properList"
        :header-cell-style="{background:'#F5F7FA'}"
        border
        style="width: 100%"
        >
        <!-- <el-table-column prop="type" label="IP" width="180"></el-table-column> -->
        <el-table-column prop="vpcId" label="ID" width="200"></el-table-column>
        <el-table-column prop="vpcName" label="vpcName" width="150"></el-table-column>
        <!-- <el-table-column prop="description" label="描述"></el-table-column> -->
        <el-table-column prop="regionId" label="所属区域" width="180"></el-table-column>
        <el-table-column prop="creationTime" label="创建时间" width="200"></el-table-column>
        <el-table-column label="状态" width="120">
            <template slot-scope="scope">
                <span>{{Status(scope.row.status)}}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="DelProperBtn(scope.$index, scope.row)">删除</el-button>
                <el-button type="warning" size="mini" @click="updateCloud(scope.$index,scope.row)">编辑</el-button>
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
        <el-dialog title="专有网络创建" :visible.sync="isShow" @close="Clear()" :destroy-on-close="true">
            <el-form :model="Create" :rules="rules" ref="Create">
                <el-form-item label="IP" :label-width="formLabelWidth" prop="IP">
                    <el-input v-model="Create.IP" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="Create.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="VPCName" :label-width="formLabelWidth" prop="vpcName">
                    <el-input v-model="Create.vpcName" autocomplete="off"></el-input>
                </el-form-item>
                <!-- 必填 -->
                <el-form-item label="服务器类型" :label-width="formLabelWidth" prop="type">
                    <el-select v-model="Create.type" placeholder="请选择类型" @change="DiaChange()">
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
                <el-form-item label="所属区域" :label-width="formLabelWidth" prop="regionID" v-show="Create.type != null">
                    <el-select v-model="Create.regionID" placeholder="请选择区域" @change="PlaceChange()">
                        <el-option
                        v-for="item in PlaceList"
                        :key="item.regionId"
                        :label="item.localName"
                        :value="item.regionId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="addNetwork()">确 定</el-button>
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
                <el-button type="primary" @click="delSureProper()">确 定</el-button>
            </div>
        </el-dialog>    
    </div>
</template>

<script>
    import { getAllHost, getAllPlace, getAllProper, getCloudAccount, addProper, delProper } from "@/servise"
    export default {
        name:"Proper",
        data() {
            return {
                cloudType:null,
                regionId:null,
                properList:[],      //专有网络列表(Table)
                AccountIDs:[],      //阿里云账号列表(dialog)
                PlaceList:[],       //Dialog地区列表 
                DelScoped:null,     //当前删除的网络全部信息
                //分页器数据
                pageSize: 10,
                page: 1,
                total: 0,
                SearchName:null,//搜索内容
                isShow:false,//创建Dialog状态
                isDel:false,//删除的Dialog状态
                formLabelWidth:'120px',
                //创建网络
                Create:{
                    IP:null, 
                    type:null,      //服务器类型     
                    AccountID:null, //阿里云账号
                    description:null,
                    regionID:null,
                    vpcName:null,
                },
                Del:{
                    AccountID:null,
                },
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
                        // { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                    AccountID:[
                        { required: true, message: '请输入AccountID', trigger: 'blur' },
                        // { min: 2, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    vpcName:[
                        { required: true, message: '请输入vpcName', trigger: 'blur' },
                        // { min: 3, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
                    ],
                    type:[
                        { required: true, message: '请选择所属服务器', trigger: 'blur' },
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
                getAllProper({
                    regionId:this.regionId,
                    cloudType:this.cloudType,
                }).then(res => {
                    console.log(res);
                    if(res.code === "000000"){
                        this.properList = res.data;
                    }
                })
            },
            // ⑴ 根据服务器类型获取地方
            getPlace(val){
                const rLoading = this.openLoading();
                getAllPlace({
                    cloudType:val
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
            // ⑵ 获取阿里云账号
            CloudAccount(val){
                getCloudAccount({
                    type:val,
                }).then(res => {
                    if(res.code === "000000"){
                        this.AccountIDs = res.data
                    }
                })
            },
            //顶部 - 服务器类型改变时
            HeadTypeChange(){
                this.getPlace(this.cloudType);
            },
            //顶部 - 地区改变时
            HeadPlaceChange(){
                this.getProper();
            },
            //table表格内单个列表状态
            Status(val){
                if(val == "Available"){
                    return "可用"
                }
            },

            //Dialog - 服务器类型改变时
            DiaChange(){
                this.getPlace(this.Create.type);
                this.CloudAccount(this.Create.type);
            },
            //分页器点击页数时
            countChange(page){

            },
            //点击网络创建按钮
            CreateNetwork(){
                this.isShow = true;
            },
            SearchNetwork(){

            },
            Clear(){
                this.Create.username = null;
                this.Create.IP = null;
                this.Create.type = null;
            },
            //地区改变时
            PlaceChange(){
                this.getProper();
            },
            //添加网络
            addNetwork(){
                var Create = {
                    cidrBlock:this.Create.IP,
                    cloudAccountId:this.Create.AccountID,
                    cloudType:this.Create.type,
                    description:this.Create.description,
                    regionId:this.Create.regionID,
                    vpcName:this.Create.vpcName,
                }
                this.$refs.Create.validate((valid) => {
                    if(valid){
                        addProper(Create).then(res => {
                            console.log(res);
                            if(res.code === "000000"){
                                this.$message.success("创建成功");
                                this.isShow = false;
                                this.getProper();
                            }else{
                                this.$message.error("创建失败")
                            }
                        })
                    }
                })
            },
            //删除专有网络按钮
            DelProperBtn(index,scoped){
                this.isDel = true;
                this.DelScoped = scoped;
                this.CloudAccount(this.cloudType);
                console.log(scoped)
            },
            //删除专有网络
            delSureProper(){
                delProper({
                    regionId:this.DelScoped.regionId,
                    cloudType:this.cloudType,
                    vpcId:this.DelScoped.vpcId,
                    cloudAccountId:this.Del.AccountID
                }).then(res => {
                    if(res.code === "000000"){
                        this.isDel = false;
                        this.$message.success("删除成功");
                        this.getProper();
                    }else{
                        this.isDel = false;
                        this.$message.error("删除失败")
                    }
                })
            },
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