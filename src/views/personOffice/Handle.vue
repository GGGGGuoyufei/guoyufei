<template>
    <div>
        <el-form :model="Handle" status-icon :rules="rules" ref="Handle" label-width="100px" class="demo-ruleForm">
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
        </el-form>
    </div>
</template>

<script>
    export default {
        name:"Handle",
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
            }
        },
        methods: {
            //通过
            Pass(){

            }
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
}
</style>