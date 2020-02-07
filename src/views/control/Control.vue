<template>
  <div>
    <!-- 选择其它服务 -->
    <el-select v-model="NowSelected" placeholder="请选择服务" @change="handleChange">
      <el-option
        v-for="item in selectData"
        :key="item.value"
        :label="item.label"
        :value="item.label"
      ></el-option>
    </el-select>
    <!-- <el-button type="primary" @click="tell()">按钮</el-button> -->
    <!-- 展示区 -->
    <el-table :data="AliData" border style="width: 100%;margin-top:20px" :header-cell-style="{background:'#F5F7FA'}">
      <el-table-column label="名称" width="200" prop="name">
        <template slot-scope="scope" >
            <div style="display:flex;justify-content:center;align-items:center;cursor: pointer" @click="ToMsg(scope.$index,scope.row)">
                <img src="@/assets/control/web.png" alt="" width="30px" height="30px">
                <span style="margin-left:10px">{{scope.row.name}}</span>
            </div>
        </template>
      </el-table-column>
      <el-table-column prop="publicIP" label="公网IP" width="200"></el-table-column>
      <el-table-column prop="homeIP" label="内网IP" width="200"></el-table-column>
      <el-table-column prop="type" label="接入方式"></el-table-column>
      <el-table-column prop="passtime" label="过期时间" width="200"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Control",
  data() {
    return {
      selectData: [
        {
          value: "1",
          label: "专有网络@华南 1"
        },
        {
          value: "2",
          label: "专有网络@华南 2"
        }
      ],
      NowSelected: null,//目前选中查看的服务
      AliData:[
          {
            id:"001",
            name:"专有网络@华南 1",
            publicIP:"120.76.126.93",
            homeIP:"172.18.11.166",
            type:"Web 桌面",
            passtime:"2020-01-23"  
          },
          {
            id:"002",
            name:"A_Win2008_HN1",
            publicIP:"120.24.68.29",
            homeIP:"172.18.11.167",
            type:"Web 桌面",
            passtime:"2020-01-23"  
          }
      ],//开始阿里数据
      Msg:"",
    };
  },
  methods: {
      ToMsg(index,scoped){
        this.Msg = scoped.name;
        this.$router.push(`/control/host/${scoped.id}`);
      },
      handleChange(a,b){
        // console.log(a,b);  进行请求改变selectorData

      },
  },
  created() {
    
  },
};
</script>

<style lang="scss" scoped>

</style>