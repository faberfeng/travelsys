<template>
    <div id="safetyInspection">
        <div class="GroupSelect">

        </div>
        <div class="topHeader">
            <div id="item-box-file">
                <router-link :to="'/constructionSite/fieldConnection'" class="label-item">  
                现场连线  
                </router-link>
                <router-link :to="'/constructionSite/fieldMessage'" class="label-item">  
                现场发文  
                </router-link>
                <router-link :to="'/constructionSite/qualityChecking'" class="label-item">  
                质量检查
                </router-link>
                <router-link :to="'/constructionSite/safetyChecking'" class="label-item">  
                安全检查  
                </router-link>
                <router-link :to="'/constructionSite/safetyInspection'" class="label-item label-item-active">  
                安全监测  
                </router-link>
            </div>
        </div>
        

    </div>
</template>
<script>
export default {
    name:'safetyInspection',
    data(){
        return{

        }
    },
    created(){

    },
    filters:{

    },
    watch:{

    },
    methods:{

    }
    
}
</script>
<style lang="less">
  *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    #safetyInspection{
        .clearfix {
            clear: both;
            overflow: hidden;
            content: '';
        }
        #GroupSelect {
             display: inline-block;
            float: right;
            margin-top:-40px;
            margin-right:10px;
            width: 168px;
            height: 30px;
            .inp-search {
                width: 168px;
                border-radius: 15px;
                height: 30px;
                border: 1px solid #cccccc;
                position: relative;
                background: #fafafa;
                padding-left: 10px;
                padding-right: 20px;
                box-sizing: border-box;
                margin-right: 15px;
                float: left;
                color: #333333;
                font-size: 14px;
                outline: none;
            }
            .icon-sanjiao {
                display: block;
                position: absolute;
                width: 12px;
                height: 7px;
                background-image: url('../Settings/images/sanjiao.png');
                background-size: 100% 100%;
                content: '';
                top: 19px;
                right: 18px;
            }
        }
        .topHeader{
            box-sizing: border-box;
            float: left;
            width: 100%;
            height:800px;
        }
        #item-box-file{
            display: block;
            border-bottom: 1px solid #e6e6e6;
            height: 49px;
            padding-top: 16px;
            padding-left:20px; 
            background: #fafbfc;
            position: relative;
            .label-item{
                    float: left;
                    height: 34px;
                    font-size: 14px;
                    width:106px;
                    text-align: center;
                    line-height: 30px;
                    cursor: pointer;
                    border-top: 3px solid #fafbfc;
                    color: #999999;
                    text-decoration: none;
                }
            .label-item-active{
                color: #fc3439;
                font-weight: bold;
                border-top: 3px solid #fc3439;
                border-left: 1px solid #e6e6e6;
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #fff;
                background: #ffffff;
            }
        }

    }



</style>

