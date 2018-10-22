<template>
    <div id="walkThrough">
        <div class="project">
            <p class="antsLine">
                施工现场<i class="icon-sanjiao-right"></i><span @click="back()" style="cursor:pointer">安全监测</span><i class="icon-sanjiao-right"></i>
                <span class="strong">现场巡视记录</span>
            </p>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
export default Vue.component('walkThrough',{
    props:[],
    name:'walkThrough',
    data(){
        return{

        }

    },
    watch:{


    },
    created(){

    },
    filters:{

    },
    methods:{
        back(){
            var vm = this
            vm.$emit('back')
        },
    },

}
)
</script>
<style lang="less">
#walkThrough{
    margin: 0 20px 20px!important;
    .project{
        width: 100%;
        max-height: 800px;
        .antsLine{
                padding: 10px 10px 15px 0px;
                font-size: 12px;
                line-height: 12px;
                color: #999999;
                text-align: left;
                .icon-sanjiao-right{
                    display: inline-block;
                    width: 7px;
                    height: 10px;
                    margin: 2px 7px 0;
                    background-image:url('../ManageCost/images/sanjiaoright.png');
                    background-size: 100% 100%;
                }
                .strong{
                    cursor: pointer;
                    color: #333333;
                    font-weight: bold;
                    &:last-of-type .icon-sanjiao-right{
                        display: none;
                    }
                }    
        }
    }
}

</style>

