<template>
    <div>
        <div id="myChart" :style="{width: '100%', height: '250px'}"></div>
    </div>
</template>

<script>
    import { ApplyGC, } from "@/servise"
    export default {
        name:"CommonChart",
        data() {
            return {
                
            }
        },
        methods: {
            StartChart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById("myChart"));
                // 绘制图表
                myChart.setOption({
                    title: {
                        
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
                    // 显示百分比
                    formatter:
                        "{b0}<br/>" +
                        '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#E6E6E6"></span>{a0}:{c0}%<br/>' +
                        '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#439FE0"></span>{a1}:{c1}%<br/>' 
                    },
                    grid: {
                    left: "2%",
                    right: "2%",
                    bottom: "3%",
                    top: "5%",
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
                        show: true, //不显示坐标轴上的文字
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
                ]
            });
                ApplyGC().then(res => {
                    console.log(res);
                })
                // AllMonitor().then(res => {
                //     // console.log(res);
                //     let timerBox = []; //横轴时间坐标
                //     let CPU_Idle = []; //CPU-Idle
                //     let CPU_System = []; //CPU-System
                //     let CPU_User = []; //CPU-User
                //     let CPU_IOWait = []; //CPU-IOWait
                //     let CPU_Other = []; //CPU-Other
                //     res.forEach((v, i) => {
                //     timerBox.unshift(v.basetime);
                //     CPU_Idle.unshift(parseFloat(v.idlecpu).toFixed(2));
                //     CPU_System.unshift(parseFloat(v.syscpu).toFixed(2));
                //     CPU_User.unshift(parseFloat(v.usercpu).toFixed(2));
                //     CPU_IOWait.unshift(parseFloat(v.waitcpu).toFixed(2));
                //     CPU_Other.unshift(
                //         (
                //         100 -
                //         Number(
                //             parseFloat(v.idlecpu) +
                //             parseFloat(v.syscpu) +
                //             parseFloat(v.usercpu) +
                //             parseFloat(v.waitcpu)
                //         ).toFixed(2)
                //         ).toFixed(2)
                //     );
                //     });
                //     this.Now_CUP = (100 - Number(parseFloat(res[0].idlecpu))).toFixed(2);
                //     myChart.setOption({
                //     xAxis: [
                //         {
                //         data: timerBox
                //         }
                //     ],
                //     series: [
                //         { name: "CPU Idle", data: CPU_Idle },
                //         { name: "CPU System", data: CPU_System },
                //         { name: "CPU User", data: CPU_User },
                //         { name: "CPU IOWait", data: CPU_IOWait },
                //         { name: "CPU Other", data: CPU_Other }
                //     ]
                //     });
                // });
            },
        },
        mounted() {
            this.StartChart();
        },
    }
</script>

<style lang="scss" scoped>

</style>