<template>
    <div id="personalCalendar">
        <div :class="[{'box-left-active':!screenLeft.show},'box-left-container']">
            <div style="min-width: 950px;overflow-y: auto;">
                <div id="item-box-file">
                    <router-link :to="'/SchedulePlan/personalCalendar'" class="label-item label-item-active">  
                    个人日历  
                    </router-link>
                    <router-link :to="'/SchedulePlan/resourcePlan'" class="label-item">  
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
            <el-row>
                <el-col :span="24">
                    <el-container>
                        <el-header>header</el-header>
                        <el-main>
                        <full-calendar :events="events" :config="config"></full-calendar>
                        </el-main>
                    </el-container>
                </el-col>
            </el-row>
        </div>
        <div :class="[{'box-right-active':screenLeft.show},'box-right-container']">
            <div id="center-selection">
                <div class="SH_right" @click="screenLeft.show = screenLeft.show?false:true;">
                    <i class="icon-right"></i>
                </div>
                <div :class="[screenLeft.item == 1?'active':'active-version']">
                    <span class="item-event " @click="screenLeft.item = 1;">事<br>件</span>
                    <span class="item-file " @click="screenLeft.item = 2">附<br>件</span>
                </div>
            </div>
        </div>
    </div> 
</template>
<style>

</style>
<style lang="less"  scoped>
// #calendar{
//     max-width: 1000px;
//     margin-left:10px;
// }
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-size:12px;
    }
    li{
        list-style: none;
    }
    #personalCalendar{
        
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
        .box-left-container{
            display: block;
            position: fixed;
            top: 115px;
            left: 26px;
            bottom: 0;
            right: 225px;
            // z-index: 1001;
            transition:  all ease .5s;
            overflow: auto;
        }
        .box-left-active{
            right: 0px;
            transition:  all ease .5s;
            .icon-right{
                transform: rotateZ(180deg)!important;
                transition: all ease .5s;
            }
            }
        .el-container{margin-right: 10px;}
        // 右侧
        .box-right-container{
            display: block;
            position: fixed;
            right: -225px;
            bottom: 0;
            width: 250px;
            padding-left: 25px;
            top: 116px;
            transition: all ease .5s;
            background: #ffffff;
            z-index: 10;
            overflow-y: auto;
                #center-selection{
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 25px;
                border-right: 1px solid #cccccc;
                .SH_right{
                    width: 100%;
                    height: 48px;
                    border-left: 1px solid #cccccc;
                    border-bottom: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    .icon-right{
                        display: block;
                        position: absolute;
                        top: 19px;
                        left: 6px;
                        width: 14px;
                        height: 14px;
                        background: url('./images/right.png')no-repeat 0 0;
                        transition: all ease .5s;
                        transform: rotateZ(0deg);
                    }
                }
                .item-event{
                    display: block;
                    width: 25px;
                    height: 68px;
                    background: #fafafa;
                    padding-top:15px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    border-right: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom: -9px;
                        width: 23px;
                        height: 15px;
                        background: #fafafa;
                        border-top: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                } 
                    .item-file{
                    display: block;
                    width: 25px;
                    height: 56px;
                    background: #fafafa;
                    padding-top:12px;
                    font-size: 12px;
                    color: #666666; 
                    text-align: center;
                    border-left: 1px solid #cccccc;
                    border-right: 1px solid #cccccc;
                    position: relative;
                    cursor: pointer;
                    &::after{
                        display: block;
                        position: absolute;
                        bottom:-7px;
                        width: 23px;
                        height: 13px;
                        background: #fafafa;
                        border-bottom: 1px solid #cccccc;
                        transform: skewY(30deg);
                        content: '';
                    }
                }
                    .active-version{
                    .item-file{
                        background: #fff;
                        color: #fc3439;
                        width: 25px;
                        &::after{
                            background: #fff;
                            // border-right: 1px solid #ffffff;
                        }
                    }
                    .item-event::after{
                        background: #fff;
                    }
                }
                .active{
                .item-event{
                      background: #fff;
                      color: #fc3439;
                }
                .item-event{
                   width: 25px;
                }
            } 
            }
        }
        
        .box-right-active{
            right: 0;
            transition: all ease .5s;
        }

    }
</style>
<script>
import axios from 'axios'
import 'fullcalendar/dist/locale/zh-cn'
export default {
  name:'personalCalendar',
  data(){
      return {
         screenLeft:{
             show:true,
             item:1,
         },
         events: [
            {
                title  : 'event1',
                start  : '2018-06-18',
            },
            {
                title  : 'event2',
                start  : '2018-06-18',
                end    : '2018-06-23',
            },
            {
                title  : 'event3',
                start  : '2018-06-18T12:30:00',
                allDay : false,
            },
      ],
      config:{
          locale: 'zh-cn',
          defaultView: 'month',
      },
            }
  }
    }
</script>

