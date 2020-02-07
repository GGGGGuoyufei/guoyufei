<template>
    <div class="design">
        <div class="head">
            <p>工作流在线流程设计编辑</p>
            <i class="el-icon-close" @click="goFlow()"></i>
        </div>
        <iframe :src="DesignUrl" frameborder="0" name="design" id="design_iframe"></iframe>
    </div>
</template>

<script>
    export default {
        name:"Design",
        data() {
            return {
                DesignUrl:"",
            }
        },
        methods: {
            goFlow(){
                this.$router.push("/flowPath/modelMag")
            }
        },
        created() {
            let id = this.$route.params.id;
            // this.DesignUrl = "http://10.152.240.107:6062/work-order/modeler.html?modelId="+id;
            // this.DesignUrl = "http://39.100.38.166:6062/work-order/modeler.html?modelId="+id;
            this.DesignUrl = "/cmp/work-order/modeler.html?modelId="+id;
        },
    }
</script>

<style lang="scss" scoped>
.head{
    width:100%;
    height:50px;
    background: white;
    font-size: 20px;
    line-height: 50px;
    border-bottom:1px solid gainsboro;
    box-sizing: border-box;
    padding: 0 20px 0 40px;
    color:#333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    i{
        font-size: 30px;
        color:#9A9A9A;
        cursor: pointer;
    }
}
.design{
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
}
#design_iframe{
    width:100%;
    flex:1;
}
</style>