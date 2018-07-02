<template>
    <div id="personalCalendar">
        <div class="topHeader">
            <div id="item-box-file">
                <router-link :to="'/SchedulePlan/personalCalendar'" class="label-item">  
                个人日历  
                </router-link>
                <router-link :to="'/SchedulePlan/resourcePlan'" class="label-item label-item-active">  
                资源计划  
                </router-link>
                <router-link :to="'/SchedulePlan/taskIndex'" class="label-item">  
                工程任务  
                </router-link>
                <router-link :to="'/SchedulePlan/calendarConfig'" class="label-item">  
                更多配置  
                </router-link>
            </div>
        </div>
    </div> 
</template>
<style lang="less" scoped>
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;
    }
    #personalCalendar{
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

