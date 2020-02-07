<template>
  <div id="monitor">
    <!-- 头部 -->
    <el-row :gutter="10" class="head">
      <el-col :xs="15" :sm="16" :md="18" :lg="19" :xl="1">
        <div class="grid-content bg-purple">
          <p style="font-weight: bold;font-size:17px">
            基础监控概览：
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
              <i class="el-icon-cpu"></i> CPU使用率
            </p>
            <!-- <p>来源：行云管家</p> -->
          </div>
          <div id="myChart1" :style="{width: '100%', height: '250px'}"></div>
          <div class="chart_fot">
            <p>CPU Total： {{Now_CUP}}%</p>
            <p style="color:#3D91CC;cursor: pointer" @click="through()">详情</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="11">
        <div class="grid-content bg-purple chart">
          <div class="chart_tit">
            <p>
              <i class="el-icon-receiving"></i> 内存使用率
            </p>
            <!-- <p>来源：行云管家</p> -->
          </div>
          <div id="myChart2" :style="{width: '100%', height: '250px'}"></div>
          <div class="chart_fot">
            <p>内存使用率： {{Now_Meory}}%</p>
            <p
              style="color:#3D91CC;cursor: pointer"
              @click="$router.push('/control/memoryDel/002')"
            >详情</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 磁盘图标 -->
    <el-row :gutter="20" class="monitor_pig">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="1" class>
        <div class="grid-content bg-purple chart">
          <div class="chart_tit">
            <p>
              <i class="el-icon-odometer"></i> 系统磁盘IOTraffic
            </p>
            <!-- <p>来源：行云管家</p> -->
          </div>
          <div id="myChart3" :style="{width: '100%', height: '250px'}"></div>
          <div class="chart_fot">
            <p>系统磁盘读速率：{{Now_IODisk_read}}Kbps 系统磁盘写速率：{{Now_IODisk_write}}Kbps</p>
            <p
              style="color:#3D91CC;cursor: pointer"
              @click="$router.push('/control/disIODel/003')"
            >详情</p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="11">
        <div class="grid-content bg-purple chart">
          <div class="chart_tit">
            <p>
              <i class="el-icon-stopwatch"></i> 磁盘使用率
            </p>
            <!-- <p>来源：行云管家</p> -->
          </div>
          <div id="myChart4" :style="{width: '100%', height: '250px'}"></div>
          <div class="chart_fot">
            <p>磁盘使用率： {{Now_UseDisk}}</p>
            <p
              style="color:#3D91CC;cursor: pointer"
              @click="$router.push('/control/disuseDel/004')"
            >详情</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { AllMonitor } from "@/servise";
export default {
  name: "Monitor",
  data() {
    return {
      Now_CUP: null,
      Now_Meory: null,
      Now_IODisk_read: null,
      Now_IODisk_write: null,
      Now_UseDisk: null
    };
  },
  methods: {
    //点击进入详情
    through() {
      this.$router.push("/control/detail/001");
    },
    CPU() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      // 绘制图表
      myChart.setOption({
        // backgroundColor:'#E6E6E6',
        title: {
          // text: '堆叠区域图'
        },
        tooltip: {
          trigger: "axis",
          padding: 5,
          axisPointer: {
            type: "none",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          textStyle: {
            // color:"#FBFF00",
            fontSize: 12
          },
          // 显示百分比
          formatter:
            "{b0}<br/>" +
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#E6E6E6"></span>{a0}:{c0}%<br/>' +
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#439FE0"></span>{a1}:{c1}%<br/>' +
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#2EC58A"></span>{a2}:{c2}%<br/>' +
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#C9E495"></span>{a3}:{c3}%<br/>' +
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#A78DE7"></span>{a4}:{c4}%<br/>'
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "0%",
          top: "0%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            show: false,
            boundaryGap: false,
            axisTick: {
              show: false //不显示坐标轴刻度线
            },
            axisLine: {
              show: false //不显示坐标轴线
            },
            axisLabel: {
              show: false //不显示坐标轴上的文字
            }
          }
        ],
        yAxis: [
          {
            min: 0,
            max: 100,
            type: "value",
            axisTick: {
              show: false //不显示坐标轴刻度线
            },
            axisLine: {
              show: false //不显示坐标轴线
            },
            axisLabel: {
              show: false, //不显示坐标轴上的文字
              interval: "auto",
              formatter: "{value}%"
            }
          }
        ],
        series: [
          {
            showSymbol: false,
            symbol: "circle", //折点设定为实心点
            symbolSize: 5, //设定实心点的大小
            name: "CPU Idle",
            type: "line",
            stack: "",
            areaStyle: {},
            areaStyle: {
              normal: {
                color: "#E6E6E6" //改变区域颜色
              }
            },
            lineStyle: {
              normal: {
                color: "#E6E6E6" //折现颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#E6E6E6",
                borderWidth: 1.5,
                borderColor: "white",
                // 显示百分比
                label: {
                  show: false,
                  position: "top",
                  formatter: "{b}\n{c}%"
                }
              }
            }
          },
          {
            showSymbol: false,
            symbol: "circle", //折点设定为实心点
            symbolSize: 5, //设定实心点的大小
            name: "CPU System",
            type: "line",
            stack: "",
            areaStyle: {},
            lineStyle: {
              normal: {
                color: "#439FE0"
              }
            },
            areaStyle: {
              normal: {
                color: "#439FE0" //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#439FE0",
                borderWidth: 1.5,
                borderColor: "white",
                // 显示百分比
                label: {
                  show: false,
                  position: "top",
                  formatter: "{b}\n{c}%"
                }
              }
            }
          },
          {
            showSymbol: false,
            symbol: "circle", //折点设定为实心点
            symbolSize: 5, //设定实心点的大小
            name: "CPU User",
            type: "line",
            stack: "",
            areaStyle: {},
            lineStyle: {
              normal: {
                color: "#2EC58A"
              }
            },
            areaStyle: {
              normal: {
                color: "#2EC58A" //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#2EC58A",
                borderWidth: 1.5,
                borderColor: "white",
                // 显示百分比
                label: {
                  show: false,
                  position: "top",
                  formatter: "{b}\n{c}%"
                }
              }
            }
          },
          {
            showSymbol: false,
            symbol: "circle", //折点设定为实心点
            symbolSize: 5, //设定实心点的大小
            name: "CPU IOWait",
            type: "line",
            stack: "",
            areaStyle: { normal: {} },
            lineStyle: {
              normal: {
                color: "#C9E495"
              }
            },
            areaStyle: {
              normal: {
                color: "#C9E495" //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#C9E495",
                borderWidth: 1.5,
                borderColor: "white",
                // 显示百分比
                label: {
                  show: false,
                  position: "top",
                  formatter: "{b}\n{c}%"
                }
              }
            }
          },
          {
            showSymbol: false,
            symbol: "circle", //折点设定为实心点
            symbolSize: 5, //设定实心点的大小
            name: "CPU Other",
            type: "line",
            stack: "",
            lineStyle: {
              normal: {
                color: "#A78DE7"
              }
            },
            areaStyle: {
              normal: {
                color: "#A78DE7" //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#A78DE7",
                borderWidth: 1.5,
                borderColor: "#FFFFFF",
                // 显示百分比
                label: {
                  show: false,
                  position: "top",
                  formatter: "{b}\n{c}%"
                }
              }
            }
          }
        ]
      });
      // const rLoading = this.openLoading();
      AllMonitor().then(res => {
        // console.log(res);
        let timerBox = []; //横轴时间坐标
        let CPU_Idle = []; //CPU-Idle
        let CPU_System = []; //CPU-System
        let CPU_User = []; //CPU-User
        let CPU_IOWait = []; //CPU-IOWait
        let CPU_Other = []; //CPU-Other
        // if(res.code === "000000"){
          res.forEach((v, i) => {
            timerBox.unshift(v.basetime);
            CPU_Idle.unshift(parseFloat(v.idlecpu).toFixed(2));
            CPU_System.unshift(parseFloat(v.syscpu).toFixed(2));
            CPU_User.unshift(parseFloat(v.usercpu).toFixed(2));
            CPU_IOWait.unshift(parseFloat(v.waitcpu).toFixed(2));
            CPU_Other.unshift(
              (
                100 -
                Number(
                  parseFloat(v.idlecpu) +
                    parseFloat(v.syscpu) +
                    parseFloat(v.usercpu) +
                    parseFloat(v.waitcpu)
                ).toFixed(2)
              ).toFixed(2)
            );
          });
          this.Now_CUP = (100 - Number(parseFloat(res[0].idlecpu))).toFixed(2);
          // rLoading.close();
          myChart.setOption({
            xAxis: [
              {
                data: timerBox
              }
            ],
            series: [
              { name: "CPU Idle", data: CPU_Idle },
              { name: "CPU System", data: CPU_System },
              { name: "CPU User", data: CPU_User },
              { name: "CPU IOWait", data: CPU_IOWait },
              { name: "CPU Other", data: CPU_Other }
            ]
          });
        // }
      });
    },
    Memory() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart2"));
      // 绘制图表
      myChart.setOption({
        legend: {
          show: false,
          padding: 10
        },
        tooltip: {
          trigger: "axis",
          padding: 5,
          axisPointer: {
            type: "none",
            label: {
              backgroundColor: "#6a7985"
            }
          },
          textStyle: {
            fontSize: 12
          },
          formatter: function(v) {
            return (
              `${v[0].name}<br/>` +
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#E6E6E6"></span>${
                v[0].seriesName
              }:${(100 - v[1].value).toFixed(2)}%<br/>` +
              `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#439FE0"></span>${v[1].seriesName}:${v[1].value}%<br/>`
            );
          }
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "0%",
          top: "0%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            show: false,
            boundaryGap: false,
            axisTick: {
              show: false //不显示坐标轴刻度线
            },
            axisLine: {
              show: false //不显示坐标轴线
            },
            axisLabel: {
              show: false //不显示坐标轴上的文字
            }
          }
        ],
        yAxis: [
          {
            min: 0,
            max: 100,
            type: "value",
            axisTick: {
              show: false //不显示坐标轴刻度线
            },
            axisLine: {
              show: false //不显示坐标轴线
            },
            axisLabel: {
              show: false, //不显示坐标轴上的文字
              interval: "auto",
              formatter: "{value}%"
            }
          }
        ],
        series: [
          {
            showSymbol: false,
            symbol: "circle", //折点设定为实心点
            symbolSize: 5, //设定实心点的大小
            name: "剩余内存",
            type: "line",
            stack: "",
            areaStyle: {},
            lineStyle: {
              normal: {
                color: "#E6E6E6"
              }
            },
            areaStyle: {
              normal: {
                color: "#E6E6E6" //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#E6E6E6",
                borderWidth: 1.5,
                borderColor: "#FFFFFF",
                label: {
                  show: false,
                  poition: "top",
                  formatter: "{b}\n{c}%"
                }
              }
            }
          },
          {
            showSymbol: false,
            symbol: "circle", //折点设定为实心点
            symbolSize: 5, //设定实心点的大小
            name: "内存使用率",
            type: "line",
            stack: "",
            areaStyle: {},
            areaStyle: {
              normal: {
                color: "#439FE0" //改变区域颜色
              }
            },
            lineStyle: {
              normal: {
                color: "#439FE0"
              }
            },
            itemStyle: {
              normal: {
                color: "#439FE0",
                label: {
                  show: false,
                  poition: "top",
                  formatter: "{b}\n{c}%"
                }
              }
            }
          }
        ]
      });
      // const rLoading = this.openLoading();
      AllMonitor().then(res => {
        // console.log(res);
        let timerBox = []; //横轴时间坐标
        let Memory = []; //内存使用率
        let Total = []; //内存总量
        // if(res.code === "000000"){
          res.forEach((v, i) => {
            timerBox.unshift(v.basetime);
            Memory.unshift(
              ((parseFloat(v.usedmem) / parseFloat(v.totalmem)) * 100).toFixed(2)
            );
            Total.unshift(100);
          });
          // console.log(Memory)
          this.Now_Meory = (
            (parseFloat(res[0].usedmem) / parseFloat(res[0].totalmem)) *
            100
          ).toFixed(2);
          // rLoading.close();
          myChart.setOption({
            xAxis: [
              {
                data: timerBox
              }
            ],
            series: [
              { name: "剩余内存", data: Total },
              { name: "内存使用率", data: Memory }
            ]
          });
        // }
        
      });
    },
    //磁盘IOT
    Disk() {
      // 基于准备好的dom，初始化echarts实例
      var colors = ["#5793f3", "#d14a61", "#675bba"];
      let myChart = this.$echarts.init(document.getElementById("myChart3"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter:
            "{b0}<br/>" +
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#439FE0"></span>{a0}：{c0}Kbps<br/>' +
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#2EC58A"></span>{a1}：{c1}Kbps<br/>'
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",
          top: "2%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: false //不显示坐标轴刻度线
          },
          axisLine: {
            show: false //不显示坐标轴线
          },
          axisLabel: {
            show: false //不显示坐标轴上的文字
          }
        },
        yAxis: {
          min: 0,
          max: 3000,
          type: "value",
          axisLabel: {
            formatter: "{value} °C"
          },
          axisTick: {
            show: false //不显示坐标轴刻度线
          },
          axisLine: {
            show: false //不显示坐标轴线
          },
          axisLabel: {
            show: false //不显示坐标轴上的文字
          }
        },
        series: [
          {
            showSymbol: false,
            name: "系统磁盘读速率",
            type: "line",
            itemStyle: {
              normal: {
                color: "#53A7E3",
                lineStyle: {
                  width: 1
                }
              }
            }
          },
          {
            showSymbol: false,
            name: "系统磁盘写速率",
            type: "line",
            itemStyle: {
              normal: {
                color: "#6FD7AE",
                lineStyle: {
                  width: 1
                }
              }
            }
          }
        ]
      });
      // const rLoading = this.openLoading();
      AllMonitor().then(res => {
        // console.log(res);
        let timerBox = []; //横轴时间坐标
        let readRate = []; //读速率
        let writeRate = []; //写速率
        // if(res.code === "000000"){
          res.forEach((v, i) => {
            timerBox.unshift(v.basetime);
            readRate.unshift((v.readsdis / 1000).toFixed(2));
            writeRate.unshift((v.writesdis / 1000).toFixed(2));
          });
          this.Now_IODisk_read = (res[0].readsdis / 1000).toFixed(2);
          this.Now_IODisk_write = (res[0].writesdis / 1000).toFixed(2);
          // rLoading.close();
          myChart.setOption({
            xAxis: [
              {
                data: timerBox
              }
            ],
            series: [
              { name: "系统磁盘读速率", data: readRate },
              { name: "系统磁盘写速率", data: writeRate }
            ]
          });
        // }
      });
    },
    //磁盘使用率
    DiskUse() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart4"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: "{b0}<br/>{a0}: {c0}%"
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "1%",
          top: "2%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: false //不显示坐标轴刻度线
          },
          axisLine: {
            show: false //不显示坐标轴线
          },
          axisLabel: {
            show: false //不显示坐标轴上的文字
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          type: "value",
          axisTick: {
            show: false //不显示坐标轴刻度线
          },
          axisLine: {
            show: false //不显示坐标轴线
          },
          axisLabel: {
            show: false, //不显示坐标轴上的文字
            interval: "auto",
            formatter: "{value}%"
          }
        },
        series: [
          {
            showSymbol: false,
            name: "磁盘使用率",
            type: "line",
            itemStyle: {
              normal: {
                color: "#53A7E3",
                lineStyle: {
                  width: 1
                }
              }
            }
          }
        ]
      });
      // const rLoading = this.openLoading();
      AllMonitor().then(res => {
        // console.log(res);
        let timerBox = []; //横轴时间坐标
        let Disk = [];
        // if(res.code === "000000"){
          res.forEach((v, i) => {
            timerBox.unshift(v.basetime);
            // Disk.unshift(parseFloat(v.useddis));
            Disk.unshift(v.useddis);
            console.log(Disk)
          });
          this.Now_UseDisk = res[0].useddis;
          // rLoading.close();
          myChart.setOption({
            xAxis: [
              {
                data: timerBox
              }
            ],
            series: [{ name: "磁盘使用率", data: Disk }]
          });
        // }
      });
    }
  },
  mounted() {
    this.CPU();
    this.Memory();
    this.Disk();
    this.DiskUse();
    //监听窗口改变,resize();
    window.addEventListener("resize", () => {
      // if (document.getElementById("myChart2")) {
        this.$echarts.init(document.getElementById("myChart1")).resize();
        this.$echarts.init(document.getElementById("myChart2")).resize();
        this.$echarts.init(document.getElementById("myChart3")).resize();
        this.$echarts.init(document.getElementById("myChart4")).resize();
      // }
    });
    //
    setInterval(() => {
        this.CPU();
        this.Memory();
        this.Disk();
        this.DiskUse();
    }, 300000);
  }
};
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