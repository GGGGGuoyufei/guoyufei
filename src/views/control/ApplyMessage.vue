<template>
  <div id="apply-wrapp">
    <div class="apply-title">
      <ul>
        <li>
         <p>总请求量</p>
         <p style="font-weight:bold;font-size: 24px;">3.07K</p>
         <p>周同比
          <i class="el-icon-top"></i>
          <span>20%</span>
         </p>
         <p>日同比
          <i class="el-icon-top"></i>
          <span>20%</span>
         </p>
        </li>
        <li>
         <p>平均响应时间</p>
         <p style="font-weight:bold;font-size: 24px;">3.07K</p>
         <p>周同比
          <i class="el-icon-bottom"></i>
          <span>20%</span>
         </p>
         <p>日同比
          <i class="el-icon-bottom"></i>
          <span>20%</span>
         </p>
        </li>
        <li>
         <p>请求数</p>
         <p style="font-weight:bold;font-size: 24px;">3.07K</p>
         <p>周同比
          <i class="el-icon-top"></i>
          <span>20%</span>
         </p>
         <p>日同比
          <i class="el-icon-top"></i>
          <span>20%</span>
         </p>
        </li>
        <li>
         <p>错误数</p>
         <p style="font-weight:bold;font-size: 24px;">3.07K</p>
         <p>周同比
          <i class="el-icon-bottom"></i>
          <span>20%</span>
         </p>
         <p>日同比
          <i class="el-icon-bottom"></i>
          <span>20%</span>
         </p>
        </li>
        <li>
         <p>异常</p>
         <p style="font-weight:bold;font-size: 24px;">3.07K</p>
         <p>周同比
          <i class="el-icon-top"></i>
          <span>20%</span>
         </p>
         <p>日同比
          <i class="el-icon-top"></i>
          <span>20%</span>
         </p>
        </li>
      </ul>
    </div>
    <el-card class="box-card" style="width:400px;height:380px;" >
			<div slot="header" class="clearfix">
				<span>总览层</span>
				<el-button style="float: right; padding: 3px 0" type="text">
					<i class="el-icon-s-tools"></i>
				</el-button>
				<span style="float: right;color:#409EFF;cursor: pointer " @click="$router.push('/control/ApplyDetail/002')">详情</span>
			</div>
			<div class="text item">
			  <span >请求数:</span>
				<span>错误数:</span>
				<span>响应时间:</span>
				<div id="lineChart" style="width:400px; height:300px;margin-top:20px;"></div>
			</div>
		</el-card>
    <el-card class="box-card" style="width:400px;height:380px;" >
			<div slot="header" class="clearfix">
				<span>服务层</span>
				<el-button style="float: right; padding: 3px 0" type="text">
					<i class="el-icon-s-tools"></i>
				</el-button>
				
			</div>
			<div class="text item">
			  <span >请求数:</span>
				<span>错误数:</span>
				<span>响应时间:</span>
				<div id="ServeChart" style="width:400px; height:300px;margin-top:20px;"></div>
			</div>
		</el-card>
    <el-card class="box-card" style="width:400px;height:380px;" >
			<div slot="header" class="clearfix">
				<span>应用层</span>
				<el-button style="float: right; padding: 3px 0" type="text">
					<i class="el-icon-s-tools"></i>
				</el-button>
				
			</div>
			<div class="text item">
			  <span >请求数:</span>
				<span>错误数:</span>
				<span>响应时间:</span>
				<div id="ApplyChart" style="width:400px; height:300px;margin-top:20px;"></div>
			</div>
		</el-card>
    <el-card class="box-card" style="width:400px;height:380px;" >
			<div slot="header" class="clearfix">
				<span>主机层</span>
				<el-button style="float: right; padding: 3px 0" type="text">
					<i class="el-icon-s-tools"></i>
				</el-button>
				
			</div>
			<div class="text item">
			  <span >请求数:</span>
				<span>错误数:</span>
				<span>响应时间:</span>
				<div id="HostChart" style="width:400px; height:300px;margin-top:20px;"></div>
			</div>
		</el-card>
  </div>
</template>

<script>
export default{
  mounted(){
    this.drawLine();
  },
	methods: {
    drawLine(){
			// 基于准备好的dom，初始化echarts实例
			let myChart = this.$echarts.init(document.getElementById('lineChart'))
      let ServeChart = this.$echarts.init(document.getElementById('ServeChart'))
      let ApplyChart = this.$echarts.init(document.getElementById('ApplyChart'))
      let HostChart = this.$echarts.init(document.getElementById('HostChart'))
			// 总览层
			myChart.setOption({
					title: { text: '总览层' },
					tooltip: {},
					xAxis: {
							type: 'category',	
					},
					yAxis: {
							type: 'value'
					},
					series: [{
							data: [820, 932, 901, 934, 1290, 1330, 1320],
							type: 'line'
					}]
			});
      // 服务层
			ServeChart.setOption({
          title: { text: '服务层' },
					xAxis: {},
          yAxis: {},
          series: [{
              symbolSize: 20,
              data: [
                  [10.0, 8.04],
                  [8.0, 6.95],
                  [13.0, 7.58],
                  [9.0, 8.81],
                  [11.0, 8.33],
                  [14.0, 9.96],
                  [6.0, 7.24],
                  [4.0, 4.26],
                  [12.0, 10.84],
                  [7.0, 4.82],
                  [5.0, 5.68]
              ],
              type: 'scatter'
          }]
			});
      // 应用层
			ApplyChart.setOption({
				title: { text: '应用层' },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
        ]
			});
      // 主机层
			HostChart.setOption({
          title: { text: '主机层' },
					xAxis: {},
          yAxis: {},
          series: [{
              symbolSize: 20,
              data: [
                  [10.0, 8.04],
                  [8.0, 6.95],
                  [13.0, 7.58],
                  [9.0, 8.81],
                  [11.0, 8.33],
                  [14.0, 9.96],
                  [6.0, 7.24],
                  [4.0, 4.26],
                  [12.0, 10.84],
                  [7.0, 4.82],
                  [5.0, 5.68]
              ],
              type: 'scatter'
          }]
			});
      
    },
		
  }
}
</script>

<style lang="scss" scoped>

span{
	margin:0px 30px 20px 10px;
}
.apply-title{
  width:100%;
  height:200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  padding:10px 20px;
}
ul{
  display:flex;
  li{
    margin:0px 24px;
    p{
      margin:15px 0px;
      font-size:17px;
    }
    
  }
}
.el-icon-top{
  color: green;
  font-size: 22px;
  font-weight: bold;
}
.el-icon-bottom{
  color: red;
  font-size: 22px;
  font-weight: bold;
}
.box-card{
  display:inline-block;
  margin:20px 40px;;
}
</style>