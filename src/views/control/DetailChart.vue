<template>
  <div id="detail">
    <el-row :gutter="10" class="detail_tit">
      <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="1">
        <div class="grid-content bg-purple tit">
            <p>CPU使用率监控详情</p>
        </div>
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="11">
        <div class="grid-content bg-purple-light">
            <p style="line-height:36px;">
                <i class="el-icon-refresh" style="font-size:18px;color:#79B9E6"></i> <span>5分钟后自动刷新</span>
            </p>
        </div>
      </el-col>
    </el-row>
    <div id="myChart5" :style="{width: '100%', height: '400px'}"></div>
  </div>
</template>

<script>
import { AllDataChart } from "@/servise";
export default {
  name: "DetailChart",
  data() {
      return {
          
      }
  },
  methods: {
      drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart5'));
        // 绘制图表
        myChart.setOption({
          grid: {
              bottom: 80
          },
          tooltip : {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  animation: false,
                  label: {
                      backgroundColor: '#505765'
                  }
              },
              formatter:'{b0}<br/>' +
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#E6E6E6"></span>{a0}：{c0}%<br/>' +
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#439FE0"></span>{a1}：{c1}%<br/>' +
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#2EC58A"></span>{a2}：{c2}%<br/>' +
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#C9E495"></span>{a3}：{c3}%<br/>' +
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#A78DE7"></span>{a4}：{c4}%<br/>', 
          },
          legend: {
              data:['流量','降雨量'],
              x: 'left'
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 65,
                  end: 85
              },
              {
                  type: 'inside',
                  realtime: true,
                  start: 65,
                  end: 85
              }
          ],
          xAxis : [
              {
                  type : 'category',
                  boundaryGap : false,
                  axisLine: {onZero: false},
              }
          ],
          yAxis: [
              {
                  min:0,
                  max:100,
                  type: 'value',
              },
          ],
          series: [
              {
                  showSymbol:false,//不显示折点
                  symbol: 'circle',     //折点设定为实心点
                  symbolSize: 5,   //设定实心点的大小
                  name:'CPU Idle',
                  type:'line',
                  animation: false,
                  areaStyle: {
                      normal: {
                            color: '#E6E6E6' //改变区域颜色
                        }
                  },
                  lineStyle: {
                      width: 1,
                      normal:{
                         color:"#E6E6E6",//折现颜色
                     }
                  },
                  itemStyle:{
                        normal:{
                            color:"#E6E6E6",
                            borderWidth:1.5,
                            borderColor:"white",
                        }
                    },
                  markArea: {
                      silent: true,
                  },
              },
              {
                  showSymbol:false,//不显示折点
                  symbol: 'circle',     //折点设定为实心点
                  symbolSize: 5,   //设定实心点的大小
                  name:'CPU System',
                  type:'line',
                  animation: false,
                  areaStyle: {
                      normal: {
                            color: '#439FE0' //改变区域颜色
                        }
                  },
                  lineStyle: {
                      width: 1,
                      normal:{
                            color:"#439FE0",
                        }
                  },
                  itemStyle:{
                        normal:{
                            color:"#439FE0",
                            borderWidth:1.5,
                            borderColor:"white",
                        }
                    },
                  markArea: {
                      silent: true,
                  },
              },
              {
                  showSymbol:false,//不显示折点
                  symbol: 'circle',     //折点设定为实心点
                  symbolSize: 5,   //设定实心点的大小
                  name:'CPU User',
                  type:'line',
                  animation: false,
                  areaStyle: {
                      normal: {
                            color: '#2EC58A' //改变区域颜色
                        }
                  },
                  lineStyle: {
                      width: 1,
                      normal:{
                            color:"#2EC58A",
                        }
                  },
                  itemStyle:{
                        normal:{
                            color:"#2EC58A",
                            borderWidth:1.5,
                            borderColor:"white",
                        }
                    },
                  markArea: {
                      silent: true,
                  },
              },
              {
                  showSymbol:false,//不显示折点
                  symbol: 'circle',     //折点设定为实心点
                  symbolSize: 5,   //设定实心点的大小
                  name:'CPU IOWait',
                  type:'line',
                  animation: false,
                  areaStyle: {
                      normal: {
                            color: '#C9E495' //改变区域颜色
                        }
                  },
                  lineStyle: {
                      width: 1,
                      normal:{
                            color:"#C9E495",
                        }
                  },
                  itemStyle:{
                        normal:{
                            color:"#C9E495",
                            borderWidth:1.5,
                            borderColor:"white",
                        }
                    },
                  markArea: {
                      silent: true,
                  },
              },
              {
                  showSymbol:false,//不显示折点
                  symbol: 'circle',     //折点设定为实心点
                  symbolSize: 5,   //设定实心点的大小
                  name:'CPU Other',
                  type:'line',
                  animation: false,
                  areaStyle: {
                      normal: {
                            color: '#A78DE7' //改变区域颜色
                        }
                  },
                  lineStyle: {
                      width: 1,
                      normal:{
                            color:"#A78DE7",
                        }
                  },
                  itemStyle:{
                        normal:{
                            color:"#A78DE7",
                            borderWidth:1.5,
                            borderColor:"#FFFFFF",
                        }
                    },
                  markArea: {
                      silent: true,
                  },
              },
          ]
        });
        AllDataChart().then(res => {
            // console.log(res);
            let timerBox = [];      //横轴时间坐标
            let CPU_Idle = [];      //CPU-Idle
            let CPU_System = [];    //CPU-System
            let CPU_User = [];      //CPU-User
            let CPU_IOWait = [];    //CPU-IOWait
            let CPU_Other = [];     //CPU-Other 
            res.forEach((v,i) => {
                timerBox.push(v.basetime);
                CPU_Idle.push(parseFloat(v.idlecpu).toFixed(2));
                CPU_System.push(parseFloat(v.syscpu).toFixed(2));
                CPU_User.push(parseFloat(v.usercpu).toFixed(2));
                CPU_IOWait.push(parseFloat(v.waitcpu).toFixed(2));
                CPU_Other.push((100-Number(parseFloat(v.idlecpu)+parseFloat(v.syscpu)+parseFloat(v.usercpu)+parseFloat(v.waitcpu)).toFixed(2)).toFixed(2))
            })
            // console.log(timerBox);
            myChart.setOption({
                xAxis : [
                    {
                        data : timerBox.map(function (str) {
                            return str.replace(' ', '\n')
                        }),
                    }
                ],
                series:[
                    {name:'CPU Idle',data:CPU_Idle},
                    {name:'CPU System',data:CPU_System},
                    {name:'CPU User',data:CPU_User},
                    {name:'CPU IOWait',data:CPU_IOWait},
                    {name:'CPU Other',data:CPU_Other},
                ]
            })
        })
      }
  },
  mounted() {
    this.drawLine();
    //监听窗口改变,resize();
    window.addEventListener('resize',()=>{
      if(document.getElementById('myChart5')){
        this.$echarts.init(document.getElementById('myChart5')).resize()
      }
    })   
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
//头部
.detail_tit{
    border-bottom:1px solid gainsboro;
}
.tit>p{
    line-height: 36px;
    font-weight: bold;
    font-size: 18px;
}
</style>