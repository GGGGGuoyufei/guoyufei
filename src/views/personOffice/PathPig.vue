<template>
    <div>
        <!-- <el-form :model="Handle" status-icon :rules="rules" ref="Handle" label-width="100px" class="demo-ruleForm">
            <el-form-item label="业务KEY" prop="pass">
                <el-input v-model="Handle.apply" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="任务名称" prop="pass">
                <el-input v-model="Handle.apply" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="流程名称" prop="pass">
                <el-input v-model="Handle.apply" autocomplete="off"></el-input>
            </el-form-item>
            <div class="timer">
                <el-form-item label="流程开始时间" prop="startTime">
                    <el-date-picker
                    v-model="Handle.startTime"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </div>
            <el-form-item label="工作成绩" prop="age">
                <el-input type="textarea" v-model="Handle.gride"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="Pass()">通过</el-button>
            </el-form-item>
        </el-form> -->
        <div class="flow_table">
            <p>流程图</p>
            <img :src="url" alt="">
            <!-- <p>流转详情</p>
            <el-table
                :data="pathDetail"
                border
                style="width: 100%"
                :header-cell-style="{background:'#F5F7FA'}">
                <el-table-column
                prop="date"
                label="任务名称"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="处理人"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="任务开始时间"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="任务结束时间"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="审核意见"
                width="180">
                </el-table-column>
                <el-table-column
                prop="lang"
                label="任务时长">
                </el-table-column>
            </el-table> -->
        </div>
    </div>
</template>

<script>
    export default {
        name:"PathPig",
        data() {
            return {
                Handle:{
                    apply:null,
                    startTime:null,
                    endTime:null,
                    content:null,
                    gride:null
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    }]
                },
                rules:{
                    // pass: [
                    //     { validator: validatePass, trigger: 'blur' }
                    // ],
                },
                pathDetail:[],
                url:null,
            }
        },
        methods: {
            
        },
        created() {
            var taskID = this.$route.params.id;
            this.taskID = taskID;
            this.url = `/cmp/work-order/actHistory/getHighLightImg/${taskID}`
            // this.url = `http://39.100.38.166:6062/work-order/actHistory/getHighLightImg/${taskID}`
            // this.url = `http://10.152.240.107:6062/work-order/actHistory/getHighLightImg/${taskID}`
        },
    }
</script>

<style lang="scss" scoped>
.timer{
    display: flex;
    justify-content: space-between;
    .el-form-item{
        width:50%;
    }
    .el-input{
        width:100%;
    }
}
.flow_table{
    width:100%;
    height:auto;
    border:1px solid #EBEEF5;
    border-radius: 5px;
    padding:20px;
    box-sizing: border-box;
    >p{
        font-weight: bold;
        font-family: 微软雅黑;
        margin-bottom:20px;
    }
    >img{
        margin:0 auto;
        display: block;
        margin-bottom:40px;
    }
}
</style>