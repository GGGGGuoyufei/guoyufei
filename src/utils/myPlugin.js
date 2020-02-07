function addZero(str){
    if(str < 10){
        return "0" + str;
    }else{
        return str
    }
}
const MyPlugin = {
    install(Vue,options){
        Vue.prototype.ChangeTime = (timer) => {
            var oDate = new Date(timer),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth()+1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear +'-'+ addZero(oMonth) +'-'+ addZero(oDay) +' '+ addZero(oHour) +':'+addZero(oMin) +':'+addZero(oSen);
            return oTime;
        },
        Vue.prototype.openLoading = function() {
            const loading = this.$loading({           // 声明一个loading对象
              lock: true,                             // 是否锁屏
              text: "正在拼命加载中...",                     // 加载动画的文字
              spinner: 'el-icon-loading',             // 引入的loading图标
              background: 'rgba(0, 0, 0, 0.3)',       // 背景颜色
              target: '.sub-main',                    // 需要遮罩的区域
              body: true,                              
              customClass: 'mask'                     // 遮罩层新增类名
            })
            setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
              loading.close();                        // 关闭遮罩层
            },10000)
            return loading;
          }
    }
}
export default MyPlugin;