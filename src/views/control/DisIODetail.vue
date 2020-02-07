<template>
  <div id="detail">
    <el-row :gutter="10" class="detail_tit">
      <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="1">
        <div class="grid-content bg-purple tit">
            <p>系统磁盘IOTraffic监控详情</p>
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
  name: "DisIODetail",
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
              formatter:'{b0}<br/>'+
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#439FE0"></span>{a0}：{c0}Kbps<br/>' +
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#2EC58A"></span>{a1}：{c1}Kbps<br/>'
          },
          legend: {
              data:['系统磁盘读速率','系统磁盘写速率'],
              x: 'left',
              icon:'line',
              top:10,
              left:40
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
                  max:2500,
                  type: 'value',
                  axisLabel: {
                    formatter:'{value} K'
                    }
              },
          ],
          series: [
              {
                  showSymbol:false,//不显示折点
                  symbol: 'circle',     //折点设定为实心点
                  symbolSize: 10,   //设定实心点的大小
                  name:'系统磁盘读速率',
                  type:'line',
                  animation: false,
                  lineStyle: {
                      normal:{
                         color:"#53A7E3",//折现颜色
                     }
                  },
                  itemStyle:{
                        normal:{
                            color:"#53A7E3",
                             lineStyle:{
                                width:1
                            }
                        }
                    },
                  markArea: {
                      silent: true,
                  },
              },
              {
                  showSymbol:false,//不显示折点
                  symbol: 'circle',     //折点设定为实心点
                  symbolSize: 10,   //设定实心点的大小
                  name:'系统磁盘写速率',
                  type:'line',
                  animation: false,
                  lineStyle: {
                      normal:{
                            color:"#6FD7AE",//折线颜色
                        }
                  },
                  itemStyle:{
                        normal:{
                            color:"#6FD7AE",
                             lineStyle:{
                                width:1
                            }
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
            let readRate = [];      //读速率
            let writeRate = [];     //写速率
            res.forEach((v,i) => {
                timerBox.push(v.basetime);
                readRate.push(v.readsdis/1000);
                writeRate.push(v.writesdis/1000);
            })
            myChart.setOption({
                xAxis : [
                    {
                        data : timerBox,
                    }
                ],
                series:[
                    {name:'系统磁盘读速率',data:readRate},
                    {name:'系统磁盘写速率',data:writeRate},
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