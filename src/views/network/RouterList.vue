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
            <el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="2">
                <div class="grid-content bg-purple-light">
                    <el-button type="primary" class="btns" @click="CreateRoute()">路由创建</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 展示区table -->
        <el-table
        class="user_list"
        :data="RouteList"
        :header-cell-style="{background:'#F5F7FA'}"
        border
        style="width: 100%"
        >
        <el-table-column prop="vpcId" label="ID" width="200"></el-table-column>
        <el-table-column prop="routeTableName" label="路由名称" width="150"></el-table-column>
        <el-table-column prop="description" label="路由描述" width="180"></el-table-column>
        <el-table-column prop="creationTime" label="创建时间" width="200"></el-table-column>
        <el-table-column label="状态" width="120">
            <template slot-scope="scope">
                <span>{{Status(scope.row.status)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="DelRouteBtn(scope.$index, scope.row)">删除</el-button>
                <el-button type="warning" size="mini" @click="updateRoute(scope.$index,scope.row)">编辑</el-button>
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
        <el-dialog title="路由表创建" :visible.sync="isShow" @close="Clear()" :destroy-on-close="true">
            <el-form :model="Create" :rules="rules" ref="Create">
                <el-form-item label="路由名称" :label-width="formLabelWidth" prop="routeName">
                    <el-input v-model="Create.routeName" autocomplete="off"></el-input>
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
                <el-form-item label="所属区域" :label-width="formLabelWidth" prop="regionID" v-show="Create.type != null">
                    <el-select v-model="Create.regionID" placeholder="请选择区域" @change="PlaceChange()" :disabled="isUpdate">
                        <el-option
                        v-for="item in PlaceList"
                        :key="item.regionId"
                        :label="item.localName"
                        :value="item.regionId">
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
                <el-button type="primary" @click="AddRoute()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 删除的Dialog -->
        <el-dialog title="删除路由表" :visible.sync="isDel" @close="Clear()" :destroy-on-close="true">
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
                <el-button type="primary" @click="DelRoute()">确 定</el-button>
            </div>
        </el-dialog>   
    </div>
</template>

<script>
    import { getAllPlace, getRouteList, getCloudAccount, getAllProper, addRoute, delRoute, updateRoute } from "@/servise"
    export default {
        name:"RouterList",
        data() {
            return {
                //头部的
                cloudType:null, //服务器类型
                regionId:null,  //地点
                //全部服务器类型
                Types:[{value:"ALIBABACLOUD",label:"阿里云"},{value:"TENCENTCLOUD",label:"腾讯云"},{value:"AWS",label:"aws"},{value:"VMWARE",label:"vmware"},],       
                PlaceList:[],   //全部地点
                RouteList:[],   //Table路由表
                vpcList:[],     //专有网络列表
                AccountIDs:[],  //云账号列表
                //分页器数据
                pageSize: 10,
                page: 1,
                total: 0,
                //创建路由表
                Create:{
                    routeName:null,
                    description:null,
                    type:null,
                    regionID:null,
                    AccountID:null,
                    VpcID:null
                },
                //删除路由表
                Del:{
                    AccountID:null,
                },
                isShow:false,   //新增Dialog状态
                isUpdate:false, //修改Dialog状态
                isDel:false,    //删除Dialog状态
                DelScoped:null,
                ScopedID:null,
                formLabelWidth:"120px",
                //校验
                rules:{
                    routeName: [
                        { required: true, message: '请输入IP', trigger: 'blur' },
                    ],
                    AccountID:[
                        { required: true, message: '请输入AccountID', trigger: 'blur' },
                    ],
                    VpcID:[
                        { required: true, message: '请输入vpcName', trigger: 'blur' },
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
            //《封装》⑴ 根据服务器类型获取地方
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
            //《封装》⑵ 根据地点获取路由表
            GetRouteList(){
                getRouteList({
                    cloudType:this.cloudType,
                    regionId:this.regionId
                }).then(res => {
                    if(res.code === "000000"){
                        this.RouteList = res.data;
                    }
                })
            },
            //《封装》⑶ 根据服务器类型获取云账号
            CloudAccount(val){
                getCloudAccount({
                    type:val,
                }).then(res => {
                    if(res.code === "000000"){
                        this.AccountIDs = res.data
                    }
                })
            },
            //《封装》⑷ 获取专有网络
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
            //当头部的服务器类型改变时
            HeadTypeChange(){
                this.getPlace(this.cloudType);
            },
            //当头部的地点改变时
            HeadPlaceChange(){
                this.GetRouteList();
            },
            //table表格内单个列表状态
            Status(val){
                if(val == "Available"){
                    return "可用"
                }
            },
            //创建路由按钮
            CreateRoute(){
                this.isShow = true;
                this.isUpdate = false;
            },
            //Dialog的服务器类型改变时
            DiaChange(){
                this.getPlace(this.Create.type);
                this.CloudAccount(this.Create.type);
            },
            //Dialog的地点改变时
            PlaceChange(){
                this.Proper();
            },
            Clear(){
                this.Create.routeName = null;
                this.Create.description = null;
                this.Create.type = null;
                this.Create.VpcID = null;
                this.Create.regionID = null;
                this.Create.AccountID = null;
            },
            //新增路由表
            AddRoute(){
                var Create = {
                    routeTableName:this.Create.routeName,
                    cloudAccountId:this.Create.AccountID,
                    cloudType:this.Create.type,
                    description:this.Create.description,
                    regionId:this.Create.regionID,
                    vpcId:this.Create.VpcID,
                }
                this.$refs.Create.validate((valid) => {
                    if(valid){
                        if(!this.isUpdate){
                            addRoute(Create).then(res => {
                                if(res.code === "000000"){
                                    this.$message.success("新增路由表成功");
                                    this.GetRouteList();
                                    this.isShow = false;
                                }
                            })
                        }else{
                            updateRoute({
                                routeTableName:this.Create.routeName,
                                cloudAccountId:this.Create.AccountID,
                                description:this.Create.description,
                                routeTableId:this.ScopedID,
                                regionId:this.Create.regionID,
                                cloudType:this.cloudType
                            }).then(res => {
                                if(res.code === "000000"){
                                    this.$message.success("修改成功");
                                    this.GetRouteList();
                                    this.isShow = false;
                                    this.isUpdate = false;
                                }else{
                                    this.$message.error("修改失败");
                                }
                            })
                        }
                    }
                })
            },
            //删除路由表按钮
            DelRouteBtn(index,scoped){
                this.isDel = true;
                this.DelScoped = scoped;
                this.CloudAccount(this.cloudType)
                console.log(scoped);
            },
            //删除路由表
            DelRoute(){
                this.$refs.Del.validate((valid) => {
                    if(valid){
                        delRoute({
                            regionId:this.regionId,
                            routeTableId :this.DelScoped.routeTableId,
                            cloudAccountId:this.Del.AccountID,
                            cloudType:this.cloudType
                        }).then(res => {
                            if(res.code === "000000"){
                                this.$message.success("删除成功");
                                this.GetRouteList();
                                this.isDel = false;
                            }else{
                                this.$message.error("删除失败")
                                this.isDel = false;
                            }
                        })
                    }
                })
            },
            //修改交换机
            updateRoute(index,scoped){
                console.log(scoped);
                this.isUpdate = true;
                this.isShow = true;
                this.Create.routeName = scoped.routeTableName;
                this.Create.description = scoped.description;
                this.Create.type = this.cloudType;
                this.Create.VpcID = scoped.vpcId;
                this.Create.regionID = this.regionId;
                this.ScopedID = scoped.routeTableId;
                this.getPlace(this.cloudType);
                this.CloudAccount(this.cloudType);
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