import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/login/Login"
import { getToken } from "@/utils/cookie"
//权限管理
import Common from '@/components/Common'
import Home from '@/views/powerSet/UserMag'
import Order from '@/views/powerSet/Order'
import Profile from '@/views/powerSet/PersonMag'
//系统设置
import Menu from '@/views/systemSet/Menu';
import Resource from "@/views/systemSet/Resource"
//云账号管理
import Cloud from "@/views/cloud/CloudMag"
import CloudHost from "@/views/cloud/CloudHost"
import CloudOSS from "@/views/cloud/CloudOSS"
import CloudELB from "@/views/cloud/CloudELB"
import HostDetail from "@/views/cloud/HostDetail"

//工单流程
import MyApply from "@/views/flowpath/MyApply"
import RunApply from "@/views/flowpath/RunApply"
import FinishedApply from "@/views/flowpath/FinishedApply"
import FlowMag from "@/views/flowpath/FlowMag"
import ModelMag from "@/views/flowpath/ModelMag"
import WorkImgFlowPath from "@/views/flowpath/WorkImgFlowPath"
// import FlowPathIng from "@/views/flowpath/FlowPathIng"
import NodeMag from "@/views/flowpath/NodeMag"
import Design from "@/views/flowpath/Design"
import AddApply from "@/views/flowpath/AddApply"
//个人办公
import RunTask from "@/views/personOffice/RunTask"
import EndTask from "@/views/personOffice/EndTask"
import Handle from "@/views/personOffice/Handle"
import PathPig from "@/views/personOffice/PathPig"
//监控管理
import Control from "@/views/control/Control"
import HostMessage from "@/views/control/HostMessage"
import Monitor from "@/views/control/Monitor"
import DetailChart from "@/views/control/DetailChart"
import MemoryDetail from "@/views/control/MemoryDetail"
import DisIODetail from "@/views/control/DisIODetail"
import DisuseDetail from "@/views/control/DisuseDetail"
import Application from "@/views/control/Apply"
import JavaApply from "@/views/control/JavaApply"
import ApplyMessage from '@/views/control/ApplyMessage'
import ApplyDetail from '@/views/control/ApplyDetail'
//作业平台
import Shell from '../views/task/Shell'
import ScriptExecution from '../views/task/ScriptExecution'
import File from '../views/task/File'
import ScriptManage from '../views/task/ScriptManage'
import ScriptStore from '../views/task/ScriptStore'
import Ansible from '../views/task/Ansible'

//网络管理
import Proper from "@/views/network/Proper"
import Switchs from "@/views/network/Switchs"
import RouterList from "@/views/network/RouterList"

Vue.use(VueRouter)

let router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [{
            path: '/common',
            component: Common,
            name: "",
            meta: { isLogin: true },
            children: [{
                    path: 'home',
                    component: Home,
                    name: "用户管理",
                    meta: { isLogin: true,},
                },
                {
                    path: 'order',
                    component: Order,
                    name: "组织管理",
                    meta: { isLogin: true,},
                },
                {
                    path: 'profile',
                    component: Profile,
                    name: "角色管理",
                    meta: { isLogin: true },
                },
            ]
        },
        {
            path: '/system',
            component: Common,
            name: "",
            meta: { isLogin: true },
            children: [{
                    path: '/system/menu',
                    component: Menu,
                    name: "菜单管理",
                    meta: { isLogin: true },
                },
                {
                    path: '/system/resource',
                    component: Resource,
                    name: "资源管理",
                    meta: { isLogin: true },
                }
            ]
        },
        {
            path: '/cloud',
            component: Common,
            name: "",
            meta: { isLogin: true },
            children: [
                {
                    path: 'home',
                    component: Cloud,
                    name: "云账号管理",
                    meta: { isLogin: true,},
                },
                {
                    path: 'host',
                    component: CloudHost,
                    name: "云主机管理",
                    meta: { isLogin: true,},
                },
                {
                    path: 'hostdetail',
                    component: HostDetail,
                    name: "云主机详情",
                    meta: { isLogin: true },
                },
                {
                    path: 'oss',
                    component: CloudOSS,
                    name: "云OSS管理",
                    meta: { isLogin: true },
                },
                {
                    path: 'elb',
                    component: CloudELB,
                    name: "云ELB管理",
                    meta: { isLogin: true },
                },
            ]
        },
        {
            path: "/flowPath",
            component: Common,
            name: "",
            meta: { isLogin: true },
            children: [{
                    path: "/flowPath/myApply",
                    component: MyApply,
                    name: "我的申请",
                    meta: { isLogin: true }
                },
                {
                    path: "/flowPath/runApply",
                    component: RunApply,
                    name: "运行中的流程",
                    meta: { isLogin: true }
                },
                {
                    path: "/flowPath/finishedApply",
                    component: FinishedApply,
                    name: "完成的申请",
                    meta: { isLogin: true }
                },
                {
                    path: "/flowPath/flowMag",
                    component: FlowMag,
                    name: "流程管理",
                    meta: { isLogin: true }
                },
                {
                    path: "/flowPath/modelMag",
                    component: ModelMag,
                    name: "模型管理",
                    meta: { isLogin: true }
                },
                // {
                //     path: "/flowPath/flowPathIng",
                //     component: FlowPathIng,
                //     name: "发起流程",
                //     meta: { isLogin: true }
                // },
                {
                    path: "/flowPath/workImgFlowPath",
                    component: WorkImgFlowPath,
                    name: "查看流程图",
                    meta: { isLogin: true }
                },
                {
                    path: "/flowPath/nodeMag/:id",
                    component: NodeMag,
                    name: "节点设置",
                    meta: { isLogin: true }
                },
            ]
        },
        {
            path: '/workOffice',
            component: Common,
            name: "",
            meta: { isLogin: true },
            children: [{
                    path: '/workOffice/runTask',
                    component: RunTask,
                    name: "我的待办",
                    meta: { isLogin: true },
                },
                {
                    path: '/workOffice/endTask',
                    component: EndTask,
                    name: "我的已办",
                    meta: { isLogin: true },
                },
                {
                    path: '/workOffice/handle',
                    component: Handle,
                    name: "我的待办 - 处理",
                    meta: { isLogin: true },
                },
                {
                    path: '/workOffice/pathPig/:id',
                    component: PathPig,
                    name: "我的待办 - 流程图",
                    meta: { isLogin: true },
                },
                {
                    path: '/workOffice/addApply/:id',
                    component: AddApply,
                    name: "我的申请 - 添加",
                    meta: { isLogin: true },
                }
            ]
        },
        {
            path: '/control',
            component: Common,
            name: "",
            meta: { isLogin: true },
            children: [{
                    path: '/control/cont',
                    component: Control,
                    name: "阿里云",
                    meta: { isLogin: true },
                },
                {
                    path: '/control/host/:id',
                    component: HostMessage,
                    name: "阿里云-监控管理",
                    meta: { isLogin: true },
                },
                {
                    path: '/control/monitor/:id',
                    component: Monitor,
                    name: "阿里云-实施监控",
                    meta: { isLogin: true },
                },
                {
                    path: '/control/detail/:id',
                    component: DetailChart,
                    name: "阿里云-CPU监控",
                    meta: { isLogin: true },
                },
                {
                    path: '/control/memoryDel/:id',
                    component: MemoryDetail,
                    name: "阿里云-内存监控",
                    meta: { isLogin: true },
                },
                {
                    path: '/control/disIODel/:id',
                    component: DisIODetail,
                    name: "阿里云-磁盘IO监控",
                    meta: { isLogin: true },
                },
                {
                    path: '/control/disuseDel/:id',
                    component: DisuseDetail,
                    name: "阿里云-磁盘IO监控",
                    meta: { isLogin: true },
                },
                {
                    path: "/control/tencent",
                    component: Control,
                    name: "腾讯云",
                    meta: { isLogin: true }
                },
                {
                    path: '/control/tcHost/:id',
                    component: HostMessage,
                    name: "腾讯云-监控管理",
                    meta: { isLogin: true },
                },
                {
                    path:"/control/application",
                    component:Application,
                    name:"应用监控",
                    meta: {isLogin : true},
                },
                {
                    path:"/control/javaApply",
                    component:JavaApply,
                    name:"Java应用监控",
                    meta: {isLogin : true},
                },
                {
                    path: '/control/apply/:id',
                    component: ApplyMessage,
                    name: "应用总览",
                    meta: { isLogin: true },
                },
                {
                    path: '/control/ApplyDetail/:id',
                    component: ApplyDetail,
                    name: "应用详情",
                    meta: { isLogin: true },
                },
            ]
        },
        {
            path: '/task',
            component: Common,
            name: "",
            meta: { isLogin: true },
            children: [{
                    path: '/task/shell',
                    component: Shell,
                    name: "命令执行",
                    meta: { isLogin: true },
                },
                {
                    path: '/task/scriptexecution',
                    component: ScriptExecution,
                    name: "脚本执行",
                    meta: { isLogin: true },
                },
                {
                    path: '/task/file',
                    component: File,
                    name: "文件分发",
                    meta: { isLogin: true },
                },
                // {
                //     path: '/task/scriptmanage',
                //     component: ScriptManage,
                //     name: "脚本管理",
                //     meta: { isLogin: true },
                // },
                {
                    path: '/task/scriptStore',
                    component: ScriptStore,
                    name: "脚本库管理",
                    meta: { isLogin: true },
                },
                {
                    path: '/task/ansible',
                    component: Ansible,
                    name: "Ansible管理",
                    meta: { isLogin: true },
                },
            ]
        },
        {
            path: '/network',
            component: Common,
            name: "",
            meta: { isLogin: true },
            children: [{
                    path: '/network/proper',
                    component: Proper,
                    name: "专有网络",
                    meta: { isLogin: true },
                },
                {
                    path: '/network/switch',
                    component: Switchs,
                    name: "交换机",
                    meta: { isLogin: true },  
                },
                {
                    path: '/network/route',
                    component: RouterList,
                    name: "路由表",
                    meta: { isLogin: true },  
                }
            ]
        },
        {
            path: "/login",
            name: "Login",
            component: Login
        },
        {
            path: "/design/:id",
            component: Design,
            name: "流程设计",
            meta: { isLogin: true }
        },
        {
            path: '/',
            redirect: "/common/home",
        }

    ]
})



//登录权限
router.beforeEach((to, from, next) => {
    if (to.meta.isLogin) {
        if (getToken()) {
            next();
            // console.log("呵呵");
        } else {
            next({
                path: "/login",
                // query:{redirect:to.fullPath}
            })
        }
    } else {
        next();
    }
})


export default router