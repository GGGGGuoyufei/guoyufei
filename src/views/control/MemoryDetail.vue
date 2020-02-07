<template>
  <div id="detail">
    <el-row :gutter="10" class="detail_tit">
      <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="1">
        <div class="grid-content bg-purple tit">
            <p>内存使用率监控详情</p>
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
  name: "MemoryDetail",
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
              formatter:function(v){
                    // console.log(v)
                    return `${v[0].name}<br/>`+
                    `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#E6E6E6"></span>${v[0].seriesName}:${(100-v[1].value).toFixed(2)}%<br/>` +
                    `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#439FE0"></span>${v[1].seriesName}:${v[1].value}%<br/>`;
                }
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
                  symbolSize: 10,   //设定实心点的大小
                  name:'剩余内存',
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
                  symbolSize: 10,   //设定实心点的大小
                  name:'内存使用率',
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
          ]
        });
        AllDataChart().then(res => {
            // console.log(res);
            let timerBox = [];      //横轴时间坐标
            let Memory = [];        //内存使用率
            let Total = [];         //内存总量
            res.forEach((v,i) => {
                timerBox.push(v.basetime);
                Memory.push((parseFloat(v.usedmem)/parseFloat(v.totalmem)*100).toFixed(2));
                Total.push(100);
            })
            // console.log(Memory)
            myChart.setOption({
                xAxis : [
                    {
                        data : timerBox,
                    }
                ],
                series:[
                    {name:'剩余内存',data:Total},
                    {name:'内存使用率',data:Memory},
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