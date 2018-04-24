
<template>
    <div class="wrapper" id="designCooridate">
        <div class="borderRight">
            <div class="designNavigation">
                <span class="label-item">
                    <router-link :to="{path:'/home/design'}">设计协调</router-link>
                </span>
                <span class="label-item">
                    <router-link :to="{path:'/home/goujian'}">属性管理</router-link>
                </span>
                <span class="label-item">
                    <router-link :to="{path:'/home/designversion'}">设计版本</router-link>
                </span>
            </div>
            <div class="mainBody">
                <div style="overflow:hidden">
                    <span class="designText">设计协同</span>
                    <button class="addNewSubject">+ 新建主题</button>
                </div>
                <div class="filterInput">
                    <span class="item-fliter">筛选条件</span>
                    <div class="fliter-condition">
                        <span class="fliter-condition-text">单体</span>
                        <select class="fliter-condition-select">
                            <option>1</option>
                            <option>2</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="bodyLeft">
            122
        </div>
    </div>
</template>
<script>
export default {
    name:'Design',
    data(){
        return{
            
        }
    }
}
</script>
<style lang="less">
    #designCooridate{
        box-sizing: content-box;
        .borderRight{
            float: left;
            width: 922px;
            min-height: 500px;
            border-right: 1px solid #ccc;
        }
        .designNavigation{
            height: 49px;
            width: 922px;
            border-bottom: 1px solid #e6e6e6;
            background: #fafbfc;
            .label-item{
                line-height: 30px;
                cursor: pointer;
                border-top: 3px solid #fafbfc;
                float: left;
                height: 32px;
                width: 110px;
                a{
                    text-decoration: none;
                    color: #999;
                    font-size: 14px;
                    font-weight: normal;
                }
            }
        }
        .mainBody{
            margin: 0 5px 0 30px;
            overflow: hidden;
            line-height: 54px;
            font-size: 14px;
            .designText{
                color: #fc3439;
                font-weight: bold;
                float: left;
            }
            .addNewSubject{
                width: 106px;
                height:26px;
                border: none;
                float: right;
                background: #fc3439;
                color: #fff;
                margin: 14px 0;
                cursor: pointer;
                border-radius: 2px;
            }
        }
        .filterInput{
            width: 885px;
            height: 38px;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            overflow: hidden;
            .item-fliter{
                width: 96px;
                height: 38px;
                line-height: 38px;
                background: #fafafa;
                color: #999;
                font-weight: normal;
                float: left;
            }
            .fliter-condition{
                float: left;
                height: 38px;
                line-height: 38px;
            }
            .fliter-condition-text{
                display: inline-block;
                margin: 0 14px 0 30px;
            }
            .fliter-condition-select{
                border: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                width: 72px;
                height: 38px;
            }
        }
        .bodyLeft{
            width: 250px;
            min-height: 500px;
            float: right;
        }
    }
</style>

