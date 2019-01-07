<template>
    <div id="qualityAcceptance">
        <div class="topHeader">
                <div id="item-box-file">
                    <!-- <router-link :to="'/liveConnect/fieldConnection'" class="label-item">  
                    现场连线  
                    </router-link>
                    <router-link :to="'/liveConnect/fieldMessage'" class="label-item">  
                    现场发文  
                    </router-link>
                    <router-link :to="'/liveConnect/qualityChecking'" class="label-item">  
                    质量检查
                    </router-link>
                    <router-link :to="'/liveConnect/qualityAcceptance'" class="label-item label-item-active">  
                    质量验收  
                    </router-link> -->
                    <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                    </router-link>
                </div>
        </div>
    </div>
    
</template>

<script>
export default {
        data(){
            return{
                 routerList:'',
                moduleList:'',
            }
        },
        created(){
            var vm=this;
            vm.moduleList=JSON.parse(localStorage.getItem('moduleList'))
            this.loadingTitle()

        },
        methods:{
            loadingTitle(){
                var vn=this;
                vn.routerList=vn.getSecondGradeList(vn.moduleList,'016','01604','/liveConnect/qualityAcceptance','01603','/liveConnect/qualityChecking','01602','/liveConnect/fieldMessage','01601','/liveConnect/fieldConnection');
                console.log(vn.routerList,'vn.routerList')
            },
            //二级标题生成函数
            getSecondGradeList(itemList,oneGradeCode,Code1,routerLink1,Code2,routerLink2,Code3,routerLink3,Code4,routerLink4){
                var vm=this;
                //   console.log(vm.moduleList,'获取的东西');
                var secondList=[];
                itemList.forEach((item)=>{
                    if(item.grade==2&&item.moduleCode.substr(0,3)==oneGradeCode&&item.enableWeb==1&&(item.due==0||item.due>new Date().getTime())){
                        secondList.push(item)
                        if(item.moduleCode==Code1){
                            vm.$set(item,'isShow',true);
                            vm.$set(item,'routerLink',routerLink1);
                        }
                        if(item.moduleCode==Code2){
                            vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink2);
                        }
                        if(item.moduleCode==Code3){
                            vm.$set(item,'isShow',false);
                            vm.$set(item,'routerLink',routerLink3);
                        }
                        if(item.moduleCode==Code4){
                            vm.$set(item,'isShow',false);
                                vm.$set(item,'routerLink',routerLink4);
                        }
                    }
                })
                secondList=secondList.sort(vm.compare('sequenceNo'))
                return secondList
            },
            //排序函数
            compare(property) {
                return function(a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            },

        }
}
</script>

<style lang="less" scoped>
    #qualityAcceptance{
         .topHeader{
            box-sizing: border-box;
            float: left;
            width: 100%;
            overflow: auto;
            height: 800px;
        }
         ::-webkit-scrollbar{width:0px}
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
