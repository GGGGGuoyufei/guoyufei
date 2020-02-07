import request from "@/utils/request"
import { postRequestFormFile, getRequestLogin, getRequest, postRequest, putRequest, deleteRequest, deleteRequestJson, postRequestJson, putRequestJson, postRequestForm } from "@/utils/index.js"

//《登录页接口》------------------------------------------
//登录--
export function Login(params) {
    return getRequestLogin("/login", params)
}
//退出登录--
export function LoginOut(params) {
    return getRequestLogin("/loginout", params);
}
//获取当前登录人角色
export function GetNowRole(params) {
    return getRequest("/organization/role/queryRoleList", params);
}
// 根据角色获取菜单树
export function GetMenuByID(id, params) {
    return getRequest(`/organization/menu/getMenuTreeByRoleId/${id}`, params)
}
//《用户管理接口》------------------------------------------
//获取用户--
export function getUsers(params) {
    return postRequest("/organization/user/conditions", params);
}
//删除用户--
export function DelUser(addUrl, params) {
    return deleteRequest(`/organization/user/${addUrl}`, params);
}
//删除用户组
export function DeleteGroup(usergroupid, params) {
    return deleteRequest(`/organization/group/${usergroupid}`, params);
}
// 修改用户--
export function UpdateUser(addUrl, params) {
    return putRequestJson(`/organization/user/${addUrl}`, params);
}
//获取全部角色--
export function getRoleAll(params) {
    return getRequest("/organization/role/all", params);
}
//获取全部组织--
export function getGroupAll(params) {
    return getRequest("/organization/group/getGroupTree", params);
}
//添加用户--
export function AddUser(params) {
    return postRequestJson("/organization/user", params)
}
//搜索用户--
export function SearchUser(params) {
    return postRequestJson("/organization/user/conditions", params)
}
//《组织管理接口》-----------------------------------------
//搜索用户组
export function getUserGroup(params) {
    return postRequestJson("/organization/group/conditions", params)
}
//新增用户组
export function increaseGroup(params) {
    return postRequestJson("/organization/group", params)
}
//删除用户组
export function delUserGroup(params) {
    return deleteRequest(`/organization/user/${id}`, params)
}
//修改用户组
export function UpdateGroup(userid, params) {
    return putRequest(`/organization/group/${userid}`, params);
}
//查询用户组
export function SearchGroup(params) {
    return getRequest(`/organization/group`, params);
}
//《角色管理接口》-------------------------------------------
//获取角色
export function getRole(params) {
    return postRequestJson("/organization/role/conditions", params);
}
//获取全部菜单
export function getMenuTree(params) {
    return getRequest("/organization/menu/getMenuTree", params)
}
//搜索菜单
export function PostSearchMenu(params) {
    return postRequestJson("/menu/conditions", params)
}
//获取全部资源
export function getResourceAll(params) {
    return getRequest("/organization/resource/all", params)
}
//获取资源列表
export function getResourceList(params) {
    return postRequestJson("/organization/resource/conditions", params)
}
//添加角色
export function addRole(params) {
    return postRequestJson("/organization/role", params);
}
//删除角色
export function delRole(id, params) {
    return deleteRequest(`/organization/role/${id}`, params)
}
//查询角色
export function SearchRole(id, params) {
    return getRequest(`/organization/role/user/${id}`, params)
}
//修改角色
export function UpdateRole(id, params) {
    return putRequestJson(`/organization/role/${id}`, params)
}
// 《云账号管理接口》---------------------------------------
//获取全部云账号 // 查询
export function GetAllCloud(params) {
    return postRequestJson("/organization/cloudAccount/conditions", params);
}
//新增云管理账号
export function AddCloud(params) {
    return postRequestJson("/organization/cloudAccount", params)
}
//删除账号
export function DelCloud(id, params) {
    return deleteRequest(`/organization/cloudAccount/${id}`, params)
}
//编辑账号
export function UpdateCloud(id, params) {
    return putRequestJson(`/organization/cloudAccount/${id}`, params)
}
// 根据服务器类型获取主机列表
export function AccTypeGetHost(params){
    return getRequest("/assignment/instances/getInstancesByCloupType",params);
}
//根据ID和类型查询主机详细信息
export function AccIDGetHost(params){
    return getRequest("/assignment/instances/getDescribeInstanceById",params)
}
//关机
export function CloseHost(params){
    return getRequest("/assignment/instances/stop",params);
}
//开机
export function OpenHost(params){
    return getRequest("/assignment/instances/open",params);
}
//修改密码
export function ChangePass(params){
    return postRequestForm("/assignment/instances/resetPassword",params)
}
//重启
export function Restart(params){
    return postRequestForm("/assignment/instances/rebootInstance",params);
}

// 《资源管理》
//Table全部资源展示
export function GetAllResource(params) {
    return getRequest("/organization/resource/all", params);
}
//开始获取全部菜单-无资源
export function GetMenuNo(params) {
    return getRequest("/organization/menu/getFullMenuTree", params);
}
//资源新增
export function AddResource(params) {
    return postRequestJson("/organization/resource", params);
}
//删除资源
export function DelResource(id, params) {
    return deleteRequest(`/organization/resource/${id}`, params)
}
//资源查询
export function SearchResource(params) {
    return postRequestJson(`/organization/resource/conditions`, params);
}
//资源修改
export function UpdateResource(id, params) {
    return putRequestJson(`/organization/resource/${id}`, params)
}
// 《菜单管理》--------
//获取菜单资源树
export function getMeunAll(params) {
    return getRequest('/organization/menu/getFullMenuTree', params)
}
//新增菜单
export function PostMenu(params) {
    return postRequestJson('/organization/menu', params)
}
//修改菜单
export function editMenu(id, params) {
    return putRequestJson(`/organization/menu/${id}`, params)
}
//删除菜单
export function deleteMenu(id, params) {
    return deleteRequest(`/organization/menu/${id}`, params)
}
//查询菜单
export function searchMenu(params) {
    return getRequest('/organization/menu', params)
}

//《模型管理》
//Start获取全部模型
export function GetAllModel(params) {
    return postRequestForm("/work-order/actModel/getByCondition", params)
}
//添加空白模型
export function AddModel(params) {
    return postRequestJson("/work-order/actModel/addModel", params);
}
//模型部署
export function DeployModel(params) {
    return postRequestForm("/work-order/actModel/deploy", params);
}
//模型删除
export function DelModel(id, params) {
    return deleteRequest(`/work-order/actModel/deleteModelById/${id}`, params);
}

// 《流程管理》
//开始获取全部流程
export function GetAllFlow(params) {
    return getRequest("/work-order/actProcess/getByCondition", params);
}
//流程挂起操作
export function HangUp(params) {
    return postRequestForm("/work-order/actProcess/hangUp", params)
}
//流程激活操作
export function Activate(params) {
    return postRequestForm("/work-order/actProcess/activate", params)
}
//删除流程
export function DelFlow(params) {
    return deleteRequest("/work-order/actProcess/delete", params)
}
//编辑流程
export function UpdateFlow(id, params) {
    return putRequestJson(`/work-order/actProcess/editById/${id}`, params);
}
// 《节点设置》
//获取对应id节点
export function GetNode(id, params) {
    return getRequest(`/work-order/actNode/getProcessNode/${id}`, params);
}
//获取全部角色
export function GetAllRole(params) {
    return getRequest("/organization/role/all", params);
}
//保存并提交
export function NodeSave(params) {
    return postRequestForm("/work-order/actNode/editNodeUser", params);
}
//《我的代办》
//获取全部待办列表
export function GetMyTask(params) {
    return getRequest("/work-order/task/getWaitProcess", params);
}
//通过请求
export function Approve(params) {
    return postRequestForm("/work-order/task/approve", params);
}
//驳回请求
export function Reject(params) {
    return postRequestForm("/work-order/task/back", params);
}
//《已办任务》
//获取全部已办任务
export function GetFulFuillProcess(params) {
    return getRequest("/work-order/task/getFulfillProcess", params)
}

// 《我的申请》
//添加工单
export function AddApply(params) {
    return postRequestJson("/work-order/workOrder/addWorkOrder", params);
}
//根据条件查询
export function GetAllApply(params) {
    return getRequest("/work-order/workOrder/getByCondition", params);
}
//查询流程列表激活的
export function GetActive(params) {
    return getRequest("/work-order/actProcess/getAllByCondition", params);
}
//删除申请
export function DelApply(params) {
    return deleteRequest("/work-order/workOrder/delete", params);
}
//开始根据ID 获取数据
export function GetDataByID(params) {
    return getRequest("/work-order/actProcess/getById", params);
}
//获取第一节点名称
export function GetFirstPerson(params) {
    return getRequest("/work-order/task/getFirstNodeUser", params);
}
//判断是否右下一级
export function OffNext(params) {
    return getRequest("/work-order/task/haveNextTask", params);
}
//审批获取下一级用户
export function NextUser(params) {
    return getRequest("/organization/user/getListByRoleIds", params);
}

// 《监控》
//24组实时更新图
export function AllMonitor(params) {
    return getRequest("/monbase-server/select/group", params)
}
//全部数据图
export function AllDataChart(params) {
    return getRequest("/monbase-server/select/all", params);
}
//应用监控
export function ApplyGC(params){
    return getRequest("/monbase-server/topic/gc",params);
}

// 《作业平台》-------脚本库管理
//新增脚本库
export function AddScriptStore(params) {
    return postRequestJson("/assignment/scriptLibrary/add", params);
}
//获取全部脚本库
export function getAllScriptStore(params) {
    return getRequest("/assignment/scriptLibrary/conditions", params);
}
//根据id删除
export function deleteScriptStore(params) {
    return deleteRequest('/assignment/scriptLibrary/deleteById', params);
}
//修改脚本库
export function editScriptStore(id, params) {
    return putRequestJson(`/assignment/scriptLibrary/edit/${id}`, params);
}
//根据id查询脚本库
export function searchScriptStore(params) {
    return putRequestJson('/assignment/scriptLibrary/getById', params);
}
//开始获取全部地区
export function getAllPlace(params) {
    return getRequest("/assignment/instances/getDescribeRegions", params);
}
//---------------脚本管理----
//新增脚本
export function AddScript(params) {
    return postRequestJson("/assignment/script/add", params);
}
//根据id删除脚本 
export function deleteScript(params) {
    return deleteRequest('/assignment/script/deleteById', params);
}
//修改脚本库
export function editScript(id, params) {
    return putRequestJson(`/assignment/script/edit/${id}`, params);
}
//根据id查询脚本
export function searchScript(params) {
    return getRequest('/assignment/scriptLibrary/getById', params);
}
//根据条件查询(获取全部脚本)
export function getScript(params) {
    return getRequest('/assignment/script/conditions', params);
}
//运行run
export function runScript(id, params) {
    return postRequestJson(`/assignment/script/run/${id}`, params);
}

//《命令控制台》----
//命令执行
export function executeCommand(params) {
    return postRequestForm('/assignment/command/executeCommand', params);
}

//《文件分发》-----
export function fileTransfer(params, query) {
    return postRequestFormFile("/assignment/fileTransfer/upload", params, query)
}
//《vmware虚拟机管理》---------
//获取虚拟机列表
export function getAllVmware(params) {
    return getRequest('/assignment/vmware/getVirtualMachineList', params);
}
//主机实例管理
//获取主机列表(根据云分类、地区)
export function getAllHost(params) {
    return getRequest('/assignment/instances/getInstances', params);
}

//《主机管理》---------
//批量添加主机
export function addHost(params) {
    return postRequestJson('/assignment/mainframe/add', params);
}
//删除主机
export function deleteHost(params) {
    return deleteRequest('/assignment/mainframe/delete', params);
}
//根据分类查询
export function searchHost(params) {
    return getRequest('/assignment/mainframe/list', params);
}

//《Ansible管理》
//开始获取全部ansible服务器
export function getAllAnsible(params) {
    return postRequestJson("/assignment/ansible-server/findByCondition", params);
}
//新增ansible服务器
export function addAnsible(params) {
    return postRequestJson("/assignment/ansible-server/saveOrUpdate", params);
}
//删除ansible服务器
export function delAnsible(params) {
    return getRequest("/assignment/ansible-server/deleteById", params);
}
//id查询
export function aa(params) {
    return getRequest("/assignment/ansible-server/findById", params);
}

//《网络管理》
    //交换机列表
    export function getAllSwitch(params){
        return getRequest("/assignment/vswitch/getVSwitchList",params)
    }
    //根据类型获取云账号
    export function getCloudAccount(params){
        return getRequest("/organization/cloudAccount/getByType",params)
    }
    //获取分区列表
    export function getZoneList(params){
        return getRequest("/assignment/vswitch/getZones",params)
    }
    //新增交换机
    export function addSwitch(params){
        return postRequestJson("/assignment/vswitch/createVSwitch",params)
    }
    //修改交换机
    export function UpdateSwitch(params){
        return putRequestJson("/assignment/vswitch/updateVSwitch",params)
    }
    //删除交换机
    export function DelSwitch(params){
        return deleteRequest("/assignment/vswitch/deleteVSwitch",params)
    }
    //专有网络列表
    export function getAllProper(params){
        return getRequest("/assignment/vpc/getVpcList",params)
    }
    //新增专有网络
    export function addProper(params){
        return postRequestJson("/assignment/vpc/createVpc",params)
    }
    //删除专有网络
    export function delProper(params){
        return deleteRequest("/assignment/vpc/deleteVpc",params)
    }
    //获取全部路由表
    export function getRouteList(params){
        return getRequest("/assignment/routeTable/getRouteTableList",params);
    }
    //新增路由表
    export function addRoute(params){
        return postRequestJson("/assignment/routeTable/createRouteTable",params)
    }
    //删除路由表
    export function delRoute(params){
        return deleteRequest("/assignment/routeTable/deleteRouteTable",params)
    }
    //修改路由表
    export function updateRoute(params){
        return putRequestJson("/assignment/routeTable/updateRouteTable",params)
    }