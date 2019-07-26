<template>
    
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            groupId:'',
            projId:'',
            entId:'',
            BDMSUrl:'',
            shareUrl:'',
            token:"",
            appShareUrl:'',
        }
    },
    created(){
        var vm=this;
        // window.addEventListener("message", (evt)=>{this.callback(evt)});
        vm.projId = localStorage.getItem('projId');//获取工程编号
        vm.entId=localStorage.getItem('entId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl;
        vm.appShareUrl= vm.$store.state.appShareUrl;
        vm.token  = localStorage.getItem('token');
        vm.getUserGroup()
    },
    
    methods:{
        // token:this.token,entId:this.entId,projectId:this.projId,groupId:this.groupId,url:this.BDMSUrl
        linkVideo(){
            var vm=this;
            vm.$router.push({
              path:'/videoIndex'
            //   query: { firstView: 'Y' }
            })
            // var link=vm.appShareUrl+'/videoIndex.html?token='+this.token+'&entId='+this.entId+'&projectId='+this.projId+'&groupId='+this.groupId+'&url='+this.BDMSUrl
            // window.open(link,"_self");
        },
        getUserGroup(){
            var vm=this;
            axios({
                url:this.BDMSUrl+'userGroup/getAllGroup',
                headers:{
                    'token':vm.token
                },
                params:{
                    projectId:vm.projId
                }
            }).then((response)=>{
                if(response.data.cd==0){
                    response.data.rt.forEach((item)=>{
                        if(item.groupName=='默认群组'){
                            this.groupId=item.groupId
                        }
                    })
                    this.linkVideo();
                }
            })
        },

    }
}
</script>

<style lang="less" scoped>
*{
    margin:0px;
    padding: 0px;
}



</style>
