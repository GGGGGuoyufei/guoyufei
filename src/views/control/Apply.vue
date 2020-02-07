<template>
    <div>
        <!-- 头部 -->
        <el-row :gutter="10" class="head">
            <el-col :xs="15" :sm="16" :md="18" :lg="19" :xl="1">
                <div class="grid-content bg-purple">
                <p style="font-weight: bold;font-size:17px">
                    应用监控概览：
                    <span style="color:#999999">共 4 个监控项</span>
                </p>
                </div>
            </el-col>
            <el-col :xs="9" :sm="8" :md="6" :lg="5" :xl="11">
                <div class="grid-content bg-purple-light">
                <p>
                    <i class="el-icon-refresh"></i>
                    <span>1分钟后自动刷新</span>
                </p>
                </div>
            </el-col>
        </el-row>
        <!-- 图表 -->
        <el-row :gutter="20" class="monitor_pig">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="1" class>
                <div class="grid-content bg-purple chart">
                <div class="chart_tit">
                    <p>
                    <i class="el-icon-data-line"></i> Eden Space
                    </p>
                </div>
                <CommonChart></CommonChart>
                <div class="chart_fot">
                    <p>CPU Total： {{Now_CUP}}%</p>
                    <p style="color:#3D91CC;cursor: pointer" @click="through()">详情</p>
                </div>
                </div>
            </el-col>
        </el-row>    
    </div>
</template>

<script>
    import { } from "@/servise";
    import CommonChart from "@/views/control/CommonChart"
    export default {
        name:"Apply",
        components:{CommonChart},
        data() {
            return {
                Now_CUP:"",
            }
        },
        methods: {
          ws() {
            var socket;
            if (!window.WebSocket) {
              window.WebSocket = window.MozWebSocket;
            } 
            if (window.WebSocket) {
              socket = new WebSocket("ws://192.168.64.131:8080/ws");
              socket.onmessage = function (event) {
                  var data = (event.data + '').split(',');
                  SetOptions(data);
              };
              socket.onopen = function (event) {
                console.info("连接开启");
                //var ta = document.getElementById('responseText');
                //ta.value = "连接开启!";
              };
              socket.onclose = function (event) {
                console.info("连接被关闭");
                //var ta = document.getElementById('responseText');
                //ta.value = ta.value + "连接被关闭";
              };
            }else {
                alert("你的浏览器不支持 WebSocket！");
            };
          }
        },
        mounted() {
            
        },
    }
</script>

<style lang="scss" scoped>
.head {
  border-bottom: 1px solid gainsboro;
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    > p {
      line-height: 36px;
      > span {
        font-size: 16px;
        color: #6da7e3;
      }
      i {
        font-size: 18px;
        color: #6da7e3;
      }
    }
  }
}
.monitor_pig {
  margin-top: 15px;
  .grid-content {
    line-height: 36px;
  }
}
.chart_tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  background: #f5f5f5;
  font-size: 12px;
  i {
    font-size: 18px;
  }
}
.chart {
  border: 1px solid gainsboro;
}
.chart:hover {
  transform: scale(1.01);
  box-shadow: 0 0 10px 5px #aaa;
}
.chart_fot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  color: #999999;
  font-size: 12px;
}
</style>