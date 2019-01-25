<template>
<div>
    <headerCommon :username='header.userName' :userid='header.userId' :proname='header.projectName' :proimg='header.projectImg' :userimg='header.userImg'></headerCommon>
    <div id="getManifestDetailInfoForPage">
        <ul style="margin-bottom:30px;">
            <li  class="item-label clearfix">
                <span class="img_left">
                      <img  :src="BDMSUrl+'QRCode2/getQRimage/QR-QD-' + addZero(biaoqianInfo.pkId, 7)" alt="">
                </span>
                <div class="right clearfix">
                    <div class="floatitem">
                        <p class="item-list clearfix">
                            <span class="text-left">清单ID：</span>
                            <span class="text-right" v-text="testIfIsNull(null,null,biaoqianInfo.pkId)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">清单名称：</span>
                            <span class="text-right" v-text="testIfIsNull(null,null,biaoqianInfo.mName)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">生成方式：</span>
                            <span class="text-right" v-text="testIfIsNull(null,null,biaoqianInfo.mGSource_)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">源自业务：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,biaoqianInfo.mBSource_)"></span>
                        </p>
                    </div>
                    <div class="floatitem">
                        <p class="item-list clearfix">
                            <span class="text-left">创建用户：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,biaoqianInfo.creator)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">创建时间：</span>
                                <span class="text-right">{{new Date(biaoqianInfo.createTime).toLocaleString()}}</span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">变更版本：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,biaoqianInfo.mVersion)"></span>
                        </p>
                        <p class="item-list clearfix">
                            <span class="text-left">明细数量：</span>
                                <span class="text-right" v-text="testIfIsNull(null,null,biaoqianInfo.manifestDetailCount)"></span>
                        </p>
                     </div>
                </div>
            </li>
        </ul>
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
                QJFileManageSystemURL:'',
                biaoqianInfo:'',
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
            // vm.detialid = vm.$route.params.detialid
            vm.BDMSUrl = vm.$store.state.BDMSUrl
            vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
            // vm.getPJDetial()
            vm.getQrcode()

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
            getQrcode(){
                var vm=this;
                axios({
                    method:'post',
                    url:this.BDMSUrl+'manifest2/getManifestInfoByMId',
                    headers:{
                        token:this.token
                    },
                    params:{
                        mId:vm.mId
                    }
                }).then(response=>{
                    if(response.data.cd == 0){
                        // this.isbiaoqianshow = true;
                        this.biaoqianInfo = response.data.rt;
                        // Object.assign(this.biaoqianInfo,{
                        //     mBSource_:this.parseMBSource(this.biaoqianInfo.mBSource),
                        //     mGSource_:this.parseMGSource(this.biaoqianInfo.mGSource)
                        // })
                        console.log(this.biaoqianInfo,'this.biaoqianInfo');

                    }else{
                        alert(response.data.msg);
                    }
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
<style lang="less" scope>
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
                    line-height: 16px;
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
