<template>
    <div id="wrapper">
        <div id="item-box-file">
            <span :class="['label-item',{'label-item-active':itemShow}]" @click="controlList()">监控列表</span>
            <span :class="['label-item',{'label-item-active':!itemShow}]" @click="dangerLevel()">危险源等级</span>
            <div v-show="itemShow" class="wrapperHead" @click="buildVideo">
                <span class="el-icon-plus"></span><span class="elName">添加监控视频</span>
            </div>
            <!-- <div v-show="!itemShow" class="wrapperHead" @click="buildDangerLevel">
                <span class="el-icon-plus"></span><span class="elName">添加</span>
            </div> -->
        </div>
        <div class="itemBody">
            <ul>
                <li>

                </li>
            </ul>

        </div>
    </div>
</template>

<script>
export default {
    name:'controlVideo',
    data(){
        return{
            itemShow:true,
        }
    },
    created(){

    },
    methods:{
        buildVideo(){

        },
        buildDangerLevel(){

        },
        controlList(){
            this.itemShow=true;
        },
        dangerLevel(){
            this.itemShow=false;
        }


    }

}
</script>

<style lang="less" scoped>
*{
    margin:0px;
    padding: 0px;
}
ul,li{
    list-style: none;
}
    #wrapper{
        margin-top:51px;
        margin-right: 20px;
        #item-box-file {
            display: block;
            border: 1px solid #e6e6e6;
            height: 36px;
            padding-top: 16px;
            padding-left: 20px;
            
            background: #fafbfc;
            position: relative;
            .label-item {
                float: left;
                height: 34px;
                font-size: 14px;
                width: 106px;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
                border-top: 3px solid #fafbfc;
                color: #999999;
                text-decoration: none;
            }
            .label-item-active {
                color: #fc3439;
                font-weight: bold;
                border-top: 3px solid #fc3439;
                border-left: 1px solid #e6e6e6;
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #fff;
                background: #ffffff;
            }
            .wrapperHead{
                float: right;
                line-height: 22px;
                height: 54px;
                margin-right:15px;
                cursor: pointer;
                .el-icon-plus{
                    font-size: 16px;
                    font-weight: bold;
                    color:rgb(46,140,185);
                }
                .elName{
                    margin-left:4px;
                    font-size:16px;
                    font-weight: bold;
                    color:rgb(46,140,185);
                }
            }
        }
    }


</style>
