<template>
  <div class="common">
    <Header></Header>
    <SideBar></SideBar>
    <div class="content">
      <Tags/>
      <div class="show_router">
        <div>
          <!-- <keep-alive>
            <router-view v-show="$route.meta.isCache"></router-view>
          </keep-alive>
          <router-view v-show="!$route.meta.isCache"></router-view> -->
          <router-view></router-view>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import Tags from '@/components/Tags.vue'
export default {
  components: {
    Header,
    SideBar,
    Tags
  },
  methods: {
    
  },
  created(){
    this.$globalEventBus .$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        })
    }
  }

</script>

<style lang="scss">
.common{
  width:100%;
  height:100%;
  background:#F1F4F5;
}
.content{
  display: flex;
  flex-direction: column;
  position: absolute;
  left:230px;
  top:50px;
  bottom:0;
  right:0;
  overflow: auto;
}
.el-breadcrumb{
  width:100%;
  height:50px;
  background:#EFF2F7;
  line-height: 50px !important;
  padding-left: 30px;
  box-sizing: border-box;
}
.show_router{
  flex:1;
  padding:15px;
  box-sizing: border-box;
  background:#F1F4F5;
  display: flex;
  justify-content: center;
  overflow: auto;
  >div{
    width:100%;
    padding:20px;  
    background: white;
    overflow: auto;
    border:1px solid #EBEEF5;
    border-radius: 5px;
  }
}
</style>