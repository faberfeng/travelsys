<template>
<div>
    <headerCommon :username='header.userName' :userid='header.userId' :proname='header.projectName' :proimg='header.projectImg' :userimg='header.userImg'></headerCommon>
    <div id="getManifestDetailInfoForPage">
        <ul style="margin-bottom:30px;">
            <li v-for="(item,index) in S_Label_quantitiesList" :key="index" class="item-label clearfix">
                <span class="img_left">
                      <img  :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(item.pkId, 7)" alt="">
                </span>
                <div class="right clearfix">
                    <div class="floatitem">
                        <p class="item-list clearfix">
                            <span class="text-left">可追踪ID：</span>
                            <span class="text-right" v-text="testIfIsNull(null,null,item.dTraceId)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">构件名称：</span>
                            <span class="text-right" v-text="testIfIsNull(null,null,item.dName)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">所在单体：</span>
                            <span class="text-right" v-text="testIfIsNull(null,null,item.dBuild)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">所在分区：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,item.dDistrict)"></span>
                        </p>
                    </div>
                    <div class="floatitem">
                        <p class="item-list clearfix">
                            <span class="text-left">所在楼层：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,item.dStorey)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">构件分类：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,item.classifyName)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">构件注释：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,item.componentComments)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">构件标记：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,item.componentTag)"></span>
                        </p>
                     </div>
                </div>
            </li>
        </ul>
        <el-pagination
        background
        layout="prev, pager, next"
        v-if="pageDetial.total>0"
        :current-page.sync="pageDetial.currentPage"
            @current-change="findManifestDetailList(ee)" 
            @prev-click="findManifestDetailList()"
            @next-click="findManifestDetailList()"
        :total="pageDetial.total">
        </el-pagination>
    </div>
</div>
</template>
<script>
import axios from 'axios'
import headerCommon from '../header.vue'
export default {
    data(){
        return {
            S_Label_quantitiesList:[],
            projId:'',
            token:'',
            mId:0,
            detialid:'',
            pageDetial:{
                pagePerNum:10,//一页几份数据
                currentPage:1,//初始查询页数 第一页
                total:0,//所有数据
            },
            BDMSUrl:'',
            header:{
                 userName:'',
                 userId:'', 
                 projectName:'华建Q系列工程协同应用系统',
                 projectImg:'',
                 userImg:''
            },
            QJFileManageSystemURL:''
        }
    },
    components:{
        headerCommon
    },
    created(){
        var vm = this
        vm.token = localStorage.getItem('token')
        vm.projId = localStorage.getItem('projId')
        vm.mId = vm.$route.params.mid
        vm.detialid = vm.$route.params.detialid
        vm.BDMSUrl = vm.$store.state.BDMSUrl
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.getPJDetial()
        vm.findManifestDetailList()
  }, 
    methods:{
        getPJDetial(){
            var vm = this
            //console.log("look the proj_id")
            /*******
             * 谨记：
             * 获取路由params的写法是this.$route 不是this.$router!!!
             * ********/
            // console.log(vm.$route.params.id);
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/index?projId='+vm.projId,
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token
                },
            }).then((response)=>{
                //console.log(response);
                if(response.data.msg == "您没有登录或登录超时，请重新登录"){
                        vm.$router.push({
                        path:'/login'
                    })
                }else{
                    vm.header.projectName = response.data.rt.project?response.data.rt.project.projName:''
                    vm.header.projectImg = response.data.rt.projectImage?response.data.rt.projectImage.filePath:''
                    vm.getUserInfo()
                }
            }).catch((err)=>{
                console.log(err)
            }) 
        },
        getUserInfo(){
            var vm = this
            axios({
                method:'GET',
                url:vm.BDMSUrl+'project2/getOnlineInfo',
                params:{
                    refresh:Math.random()/*IE11浏览器会默认从缓存里取数据*/
                },
                headers:{
                    'accept':'application/json;charset=UTF-8',
                    'token':vm.token,
                },
            }).then((response)=>{
               // console.log('getUserInfo获取用户的姓名和项目权限')
                vm.header.userName = response.data.rt.onlineInfo.userName
                vm.header.userId = response.data.rt.onlineInfo.userId
                vm.header.userImg = response.data.rt.onlineInfo.imgUuid !=null?vm.QJFileManageSystemURL+response.data.rt.onlineInfo.imgUuid:''
            })
         },
          findManifestDetailList(){
            var vm = this
            var showType = 1
            var page = vm.pageDetial.currentPage
            var rows = vm.pageDetial.pagePerNum
            if(!vm.mId)return false
            axios({
                method:'POST',
                url:vm.BDMSUrl+'manifest2/findManifestDetailList',
                headers:{
                    token:vm.token
                },
                params:{
                    projectId:vm.projId,
                    manifestId:vm.mId,
                    page:page,
                    rows:rows,
                    showType:showType,//显示类型 1 逐个显示 2 合并显示
                    currentColumns:''
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    vm.S_Label_quantitiesList = []
                    vm.pageDetial.total = 0
                    if(response.data.rt != null){
                        vm.pageDetial.total = response.data.rt.total
                        if(response.data.rt.rows != null){
                            if(vm.detialid != '0'){
                                vm.pageDetial.total = 0
                                for(var i=0;i<response.data.rt.rows.length;i++){
                                    if(response.data.rt.rows[i].pkId == vm.detialid){
                                         vm.S_Label_quantitiesList.push(response.data.rt.rows[i])
                                        break
                                    }
                                }
                            }else{
                                vm.S_Label_quantitiesList = response.data.rt.rows
                            }
                        }
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    vm.$router.push({
                        path:'/login'
                    })
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        // 补零
        addZero(num,size){
            var len = ('' + num).length;
            return (new Array(size > len ? size - len + 1 || 0 : 0).join(0) + num);
        },
        testIfIsNull(row, column, cellValue, index){
            if(cellValue == null)return '/'
            return cellValue
        },
    }
}
</script>
<style lang="less"  scoped>
#getManifestDetailInfoForPage{
    padding: 20px;
    background: #f7f8fa;
    margin-top: 68px;
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .item-label{
        border-bottom: 1px solid #ebebeb;
        background: #fff;
        padding: 28px 45px 29px;
        position: relative;
        .img_left{
            display: block;
            position: absolute;
            top: 28px;
            left: 45px;
            width: 118px;
            height: 118px;
            padding: 4px;
            border: 1px solid #e0e0e0;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .right{
            float: left;
            width: 100%;
            padding-left: 137px;
            .floatitem{
                width: 50%;
                float: left;
            }
            .item-list{
                margin-bottom: 23px;
                .text-left{
                    float: left;
                    font-size: 14px;
                    line-height: 14px;
                    width: 80px;
                    color: #666666;
                    text-align: left;
                }
                .text-right{
                    float: left;
                    width: 300px;
                    font-size: 14px;
                    line-height: 14px;
                    color: #333333;
                    text-align: left;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                &:last-of-type{
                    margin-bottom: 0px; 
                }
            }
        }
        &:last-of-type{
            border-bottom: none;
        }
    }
    .clearfix{
        clear: both;
        overflow: hidden;
        content: '';
    }
  
}
</style>

