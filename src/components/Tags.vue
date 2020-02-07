<template>
  <div class="tags" v-if="showTags">
      <ul>
          <li class="homing">
              <!-- <i class="el-icon-s-home"></i> -->
              <!-- <router-link to="/"> -->
                  <i class="el-icon-s-home"></i>
              <!-- </router-link> -->
          </li>
          <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}"  :key="index">
            <router-link :to="item.path" class="tags-li-title">
                {{item.title}}
            </router-link>
            <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
          </li>
      </ul>
      <div class="tags-close-box">
        <el-dropdown @command="handleTags">
            <!-- <el-button size="mini" type="primary">
                标签选项<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button> -->
            <div class="down"><i class="el-icon-arrow-down"></i></div>
            <el-dropdown-menu size="small" slot="dropdown">
                <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                <el-dropdown-item command="all">关闭所有</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            tagsList: []
        }
    },
    methods:{
        //类名
        isActive(path) {
            return path === this.$route.fullPath;
        },
        // 关闭单个标签
        closeTags(index){
            const delItem = this.tagsList.splice(index,1)[0]//
            const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
            if(item){
                delItem.path === this.$route.fullPath && this.$router.push(item.path)
            }else{
                this.$router.push('/')
            }
        },
        // 关闭全部标签
        closeAll(){
            this.tagsList = [];
            this.$router.push('/');
        },
        // 关闭其他标签
        closeOther(){
            const curItem = this.tagsList.filter(item => {
                return item.path === this.$route.fullPath;
            })
            this.tagsList = curItem;
        },
        //
        handleTags(command){
            command === 'other' ? this.closeOther() : this.closeAll();
        },
        // 设置标签
        setTags(route){
            const isExist = this.tagsList.some(item => {
                return item.path === route.fullPath;
            })
            if(!isExist){
                if(this.tagsList.length >= 8){
                    this.tagsList.shift();
                }
                this.tagsList.push({
                    title: route.name,
                    path: route.fullPath,
                    name: route.matched[1].components.default.name
                })
            }
            this.$globalEventBus.$emit('tags', this.tagsList);
        }
    },
    computed: {
        showTags() {
            return this.tagsList.length > 0;
        }
    },
    watch:{
        $route(newValue){
            this.setTags(newValue);
            
        }
    },
    created(){
        this.setTags(this.$route);
        this.$globalEventBus.$on('close_current_tags', () => {
            for (let i = 0, len = this.tagsList.length; i < len; i++) {
                const item = this.tagsList[i];
                if(item.path === this.$route.fullPath){
                    if(i < len - 1){
                        this.$router.push(this.tagsList[i+1].path);
                    }else if(i > 0){
                        this.$router.push(this.tagsList[i-1].path);
                    }else{
                        this.$router.push('/');
                    }
                    this.tagsList.splice(i, 1);
                    break;
                }
            }
        })
    }
}
</script>

<style>
.homing{
    float: left;
    padding:0 15px;
    line-height: 40px;
    margin-left: 20px;
    background: #fff;
    border-bottom: none;
    box-sizing: border-box;
    height: 100%;
    color:none;
    cursor: pointer;
}
.homing:not(.active):hover {
    background: #F5F7FA;
    border-bottom:1.5px solid #17B3A3;
}
.homing.active {
    color: #17B3A3;
    background:#F5F7FA; 
    border-bottom:1.5px solid #17B3A3;
}
    .tags {
        position: relative;
        height: 40px;
        background: #fff;
        padding-right: 120px;
        overflow: auto;
    }
    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
    .tags-li {
        float: left;
        margin:0 1px;
        font-size: 14px;
        overflow: hidden;
        cursor: pointer;
        height: 40px;
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,"\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;;
        line-height: 40px;
        border-bottom:none;
        box-sizing: border-box;
        /* border: 1px solid #e9eaec; */
        background: #fff;
        padding: 0 10px 0 15px;
        vertical-align: middle;
        color: #9095A6;
    }

    .tags-li:not(.active):hover {
        background: #F5F7FA;
        border-bottom:1.5px solid #17B3A3;
    }

    .tags-li.active {
        color: #333;
        background:#F5F7FA; 
        border-bottom:1.5px solid #17B3A3;
    }

    .tags-li-title {
        float: left;
        /* max-width: 80px; */
        /* overflow: hidden; */
        /* white-space: nowrap; */
        /* text-overflow: ellipsis; */
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: #fff;
        
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 40px;
        height: 40px;
        background: white;
        text-align: center;
        line-height: 39px;
        z-index: 10;
        background:#F5F7FA
    }
    .tags-li.active .tags-li-title{
        color: black;
    }
    .down{
        font-size: 20px;
        outline: none;
    }
</style>