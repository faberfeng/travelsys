<template>
    <el-form-item class="detail-temp">
        <div class="detail-content-temp">
            <el-form-item label="开始条件" label-width="100px">
                <div class="select-temp">
                    <el-select v-model="selectValue" placeholder="请选择" @change="startDayOnChange">
                        <el-option
                        v-if="item.ischeck === 1"
                        v-for="(item,index) in start_options"
                        :key="index"
                        :label="item.label"
                        :value="item.value" :style="item.ischeck === 1 ? '' : 'display:none'">
                        </el-option>
                    </el-select>
                </div>                     
            </el-form-item>
    
            <el-form-item label="计划开始" label-width="100px">
                <div class="select-temp detail-input-temp">
                    <p>
                        满足条件后<el-input v-model="startPlanDay" @blur="handleStart()"></el-input>个工作日内开始订货
                    </p>
                </div>                     
            </el-form-item>
            <el-form-item label="完成条件" label-width="100px">
                <div class="select-temp ">
                    <el-select v-model="endSelectValue" placeholder="请选择" @change="endDayOnChange">
                    <el-option
                    v-for="item in end_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.index">
                    </el-option>
                </el-select>
                </div>                     
            </el-form-item>
            <el-form-item label="计划完成" label-width="100px">
                <div class="select-temp detail-input-temp">
                    <p>
                        满足条件后<el-input v-model="endPlanDay" @blur="handleEnd()"></el-input>个工作日内完成订货
                    </p>
                </div>                      
            </el-form-item>
        </div>
    </el-form-item>
</template>
<script>
import axios from 'axios';
import {start_option,end_options} from "./../constants"
import { throws } from 'assert';
let start_optionTemp = start_option.map( (item)=> Object.assign({},item))
        const end_optionTemp = end_options.map( (item)=> item.map(data=>Object.assign({},data)));

export default {
    name:'Wuliao',
    props :{
        selectValueIndex:Number,
        endSelectValueIndex:Number,
        index:Number,
        startPlan:Number,
        endPlan:Number,
        checkLists_flow:Array
    },
    data() {
        console.log(this.checkLists_flow);
        this.checkLists_flow && this.checkLists_flow.map((item,index)=>{
            if(index>0){
                start_optionTemp[index-1].ischeck = item.ischeck;
            }
        });
        //this.checkLists_flow.map((item,index)=>{
          //  if(item.ischeck == 0){
            //    start_optionTemp = start_optionTemp.slice(index-1,1);
            //}
        //});
        console.log("start_optionTemp",start_optionTemp)
        const array = start_optionTemp.slice(0,this.index);
        const array1 = end_optionTemp[this.index-1];
        return {
            start_options:array,
            end_options:array1,            
            startPlanDay:'',
            endPlanDay:'',
            // startValue:'',
            // selectValue:array && array.length ? array[ this.selectValueIndex-2 ].label : "",
            selectValue:'',
            endSelectValue:"",
        }
    },
    computed:{
        list:function(){
            console.log("----")
            return this.checkLists_flow.map(item=>item.ischeck == 1 );
        }
    },
    updated(){
        console.log(1)
    },
    watch:{
        startPlan: function(val,oldVal){
            this.getStart();
        },
        endPlan: function( val,oldVal ) {
            this.getEnd();
        }
    },
    mounted(){
        this.getStart();
        this.getEnd();
        this.initEndSelectValue();
        this.initStartSelectValue();
        
    },
    methods:{
        initEndSelectValue(){
            this.end_options.map( item => {
                if(item.endCondition === this.endSelectValueIndex){ 
                    this.endSelectValue = item.label;
                }
            });
        },
        initStartSelectValue(){
            this.start_options.map( item =>{
                if( item.startCondition === this.selectValueIndex ){
                    this.selectValue = item.label;
                }
            })
        },
        endDayOnChange(val){
            if(val < this.end_options.length - 1){
                this.mustLast();
                this.initEndSelectValue();
                return;
            }
        },
        startDayOnChange(val){
            if(val < this.start_options.length - 1){
                this.mustLast();
                this.initStartSelectValue();
                return;
            }
        },
        getStart(){
            this.startPlanDay = this.startPlan;  
        },
        getEnd(){
            this.endPlanDay = this.endPlan;
        },
        handleStart(){
            let regEx = /^[0-9]*$/;
            if( !regEx.test( this.startPlanDay ) ){
                this.mustNumber();
                this.startPlanDay = this.startPlan;
                return;              
            }else {
                this.$emit("getStartPlan",{index:this.index,startPlanDay:this.startPlanDay});
            }            
        },
        handleEnd(){
            let regEx = /^[0-9]*$/;
            if( !regEx.test( this.endPlanDay || this.endPlanDay<0 ) ){
                this.mustNumber();
                this.endPlanDay = this.endPlan;
                return;             
            }else {
                this.$emit("getEndPlan",{index:this.index,endPlanDay:this.endPlanDay});
            }            
        },
        mustNumber() {
            this.$alert('工作日必须为自然数！', '', {
            confirmButtonText: '确定',
            });
        },
        mustLast() {
            this.$alert('后续操作的日期必须在前续操作的日期之后！', '', {
            confirmButtonText: '确定',
            });
         },
    }
}
</script>
<style lang="less">
#wuliao{
    .detail-temp {
        .detail-content-temp {
            width: 615px;
            border:2px solid #e6e6e6;
            padding:20px 0px 20px 20px;
            margin-top: 30px;
            .el-form-item__label, .el-form-item__content {
                line-height: 60px;
            }
            .el-form-item__label {
                padding-right: 25px;
            }
            .el-select>.el-input {
                width: 265px;
            }
            .detail-input-temp {
                .el-input {
                    display: inline-block;
                    width: 50px;
                    margin:0 10px;
                }
            }
            .select-temp {
                text-align: left;
            }
        }
    }         
}
</style>

