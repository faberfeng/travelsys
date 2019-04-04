<template>
    <ul class="treeMain" >
        <li class="treeOne" v-for="(item,index) in treeData" :key="index">
            <div class="treeOne_name" v-if="item.children.length>0"><i style="cursor:pointer;margin-right:2px;color:black" @click="clickIcon(item)" :class="[{'el-icon-arrow-right':!item.disabled},{'el-icon-arrow-down':item.disabled}]"></i><span>{{item.name}}</span></div>
            <ul class="treeOne_main" v-if="item.children&&item.children.length>0&&item.disabled">
                <li class="treeOne_mainLi" v-for="(item1,index1) in item.children" :key="index1">
                    <el-checkbox id="name" @change="clickCheck(item1)"  v-model="item1.spotNum" ></el-checkbox><label for="name">{{item1.name}}</label>
                </li>
            </ul>
        </li>
    </ul>
    
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
export default Vue.component('fileTree', {
    name:'fileTree',
    props:['treeData','flodShow','clickId'],
    data(){
        return{
            // treeData:'',
            downShow:false,
            // flodShow:true,

        }
    },
    methods:{
        clickIcon(item){
            this.$emit('clickIcon',item)
        },
        clickCheck(item){
            this.$emit('clickCheck',item)
        }

    },
    
    }
)
</script>

<style lang="less" >
    .treeMain{
        font-size:16px;
        font-weight: 700;
        color:red;
        text-align: left;
        .treeOne{
            .treeOne_name{
                padding:4px;

            }
            .treeOne_main{
                margin-left:20px;
                // input {
                //     position: absolute;
                //     clip: rect(0, 0, 0, 0);
                // }
                // input[type="checkbox"] + label::before {
                //     content: "\a0";  /*不换行空格*/
                //     display: inline-block;
                //     // vertical-align: .2em;
                //     width: 1em;
                //     height: 1em;
                //     margin-right: .4em;
                //     margin-top: .2em;
                //     border-radius: .2em;
                //     border:1px solid #ccc;;
                //     background-color: white;
                //     // text-indent: .15em;
                //     // line-height: .65;  /*行高不加单位，子元素将继承数字乘以自身字体尺寸而非父元素行高*/
                // }
                // input[type="checkbox"]:checked + label::before {
                //     // content: "\2713";
                //     background-color: red;

                // }
                .treeOne_mainLi{
                    margin:4px;
                    #name{
                        margin-right: 5px;
                    }
                }
            }

        }

    }


</style>
