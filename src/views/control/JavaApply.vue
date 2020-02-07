<template>
	<div>
	  <el-row :gutter="10">
      <el-col :xs="16" :sm="7" :md="6" :lg="4" :xl="5">
        <div class="grid-content bg-purple">
          <el-input placeholder="应用名称"></el-input>
        </div>
      </el-col>
      <el-col :xs="8" :sm="5" :md="4" :lg="2" :xl="5">
        <div class="grid-content bg-purple-light">
          <el-button class="primary btns" @click="search">查询</el-button>
        </div>
      </el-col>
      
    </el-row>
			<!-- table -->
		<el-table :data="AliData" border style="width: 100%;margin-top:20px" :header-cell-style="{background:'#F5F7FA'}">
			<el-table-column label="应用名称" width="200" prop="name">
        <template slot-scope="scope" >
            <div style="display:flex;justify-content:center;align-items:center;cursor: pointer" @click="ToMsg(scope.$index,scope.row)">
                <span style="margin-left:10px">{{scope.row.name}}</span>
            </div>
        </template>
      </el-table-column>
			<el-table-column prop="HealthDegree" label="健康度"></el-table-column> 
				<!--健康度=(总请求数-耗时超出500ms的请求个数/2-耗时超出1000ms的请求个数)/总请求数-->
			<el-table-column prop="reqNumber" label="请求数" ></el-table-column>
			<el-table-column prop="error" label="错误数"></el-table-column>
			<el-table-column prop="resTime" label="响应时间" ></el-table-column>
			<el-table-column prop="state" label="状态" ></el-table-column>
			<el-table-column prop="longState" label="最近30分钟响应状态" ></el-table-column>
			<el-table-column label="操作"  width="180"  align="center" fixed="right">                      
        <template slot-scope="scope" >
          <el-button type="danger" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>             
      </el-table-column>
		</el-table>   
	</div>
</template>

<script>
   
export default {
	data(){
		return{
			AliData:[
					{
						id:"001",
						name:"专有网络@华南 1",
						HealthDegree:"10%",
						reqNumber:"20",
						error:"10",
						resTime:'20s',
						state:'良好',
						longState:'良好'
					},
					{
						id:"002",
						name:"A_Win2008_HN1",
						HealthDegree:"10%",
						reqNumber:"20",
						error:"10",
						resTime:'20s',
						state:'良好',
						longState:'良好'
					}
			]
		}
	},
	methods:{
		ToMsg(index,scoped){
        this.$router.push(`/control/apply/${scoped.id}`);
      },
		handleEdit(){

		},
		handleDelete(){

		},
		add(){

		},
		search(){

		}
	}
}
</script>

<style lang="scss" scoped>

</style>