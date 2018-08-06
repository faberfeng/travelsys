<template>
    <div id="safetyChecking">
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
                    <router-link :to="'/constructionSite/safetyChecking'" class="label-item label-item-active">  
                    安全检查  
                    </router-link>
                </div>
            </div>
    </div>
</template>
<script>
export default {
    name:'safetyChecking',
    data(){
        return{

        }
    }
    
}
</script>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    #safetyChecking{
         .topHeader{
            box-sizing: border-box;
            position: fixed;
            top: 116px;
            left: 26px;
            bottom:0;
            right: 0;
            overflow: auto;
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

