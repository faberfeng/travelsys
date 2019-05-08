<template>
    <div id="commonMessage">
        <div class="projectInfo">
            <p class="antsLine">
                安全教育<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全教育</span><i class="icon-sanjiao-right"></i>
            </p>
        </div>
        <div class="projectBody">
            <div style="width:50%;float:left;height:250px;">
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">活动名称:</label><input class="inp" v-model="workName"/>
                </div>
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">活动发起:</label>
                    <el-select v-model="buildPerson" placeholder="请选择">
                            <el-option
                            v-for="item in list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                    </el-select>

                </div>
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">活动负责人:</label><input class="inp" v-model="workName"/>
                </div>
            </div>
            <div style="width:50%;float:right;height:250px;">
                <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">开始时间:</label>
                     <el-date-picker
                        v-model="timeValue"
                        type="date"
                        placeholder="选择日期">         
                    </el-date-picker>
                </div>
                 <div class="bodyContent">
                    <label style="width:15%;display:inline-block;height:32px;line-height:32px;font-size:14px;color:#999;">活动名称:</label><input type="file" class="inp" style="width:280px !important" />
                    <span class="el-icon-upload"></span>
                </div>
                 <div class="bodyContent">
                    <span class="makesureBtn">确认发布</span>
                </div>

            </div>
        </div>
        <div class="projectMiddle">
            <textarea placeholder="活动内容说明"></textarea>
        </div>
    </div>
</template>
<script>
export default {
    name:'commonMessage',
    props:[],
    data(){
        return{
            workName:'',
            buildPerson:'',
            list:[{
                value:1,
                label:'名称'
            }],
            timeValue:'',
        }
    },
    created(){

    },
    methods:{
        back(){
            var vm=this;
            vm.$emit('back')
        }

    }
}
</script>
<style lang="less">
#commonMessage{
   
    .projectInfo{
         margin: 10px 20px 20px;
        .antsLine{
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
                border-bottom: 1px dashed #ccc;
                .icon-sanjiao-right{
                    display: inline-block;
                    width: 7px;
                    height: 10px;
                    margin: 2px 7px 0;
                    background-image:url('../ManageCost/images/sanjiaoright.png');
                    background-size: 100% 100%;
                }    
        }
    }
    .projectBody{
        height: 250px;
        border-bottom: 1px solid #ccc;
        .inp{
                background-color: #fff;
                background-image: none;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                color: #606266;
                display: inline-block;
                font-size: inherit;
                height: 40px;
                line-height: 1;
                outline: 0;
                padding: 0 15px;
                height: 36px;
                width: 320px;
        }
        .bodyContent{
            margin:30px 20px;
            .el-select .el-input__inner{
                width: 320px;
            }
            .el-date-editor.el-input {
                    width: 320px !important;
            }
            .el-input--prefix .el-input__inner {
                // padding-left: 30px;
                width: 320px !important;
            }
            .el-icon-upload{
                font-size: 24px;
                color:red;
                margin-left:10px;
                // line-height: 34px;
                vertical-align: center;
                cursor: pointer;
            }
            .makesureBtn{
                display: inline-block;
                height: 36px;
                width: 80px;
                border:1px solid red;
                border-radius: 4px;
                background: red;
                color:white;
                line-height: 34px;
                font-size: 14px;
                cursor: pointer;
                // margin-top:10px;
                margin-left:400px;
                margin-top:30px;
            }
                
        }
    }
    .projectMiddle{
        padding:20px;

        textarea{
            width: 96%;
            height: 200px;
            background: #fafafa;
            padding:15px;
            font-size:14px;
            color:#999;
        }
    }
}

</style>
