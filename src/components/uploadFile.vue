<template>
      <el-dialog :title="title" :visible="uploadshow" @close="upImgCancle">
        <div class="editBody">
            <div class="editBodytwo imageBody">
                <label class=" imageBodyText">文件说明 :</label>
                <input type="text" class="inp" v-model="des">
            </div>
            <div class="editBodytwo imageBody">
                <label class=" imageBodyText">上传文件 :</label>
                <span class="updataImageSpan">
                    <span @click="selectImg">
                         <button class="upImgBtn">选择文件</button>
                    </span>
                    <input class="upInput"  type="file" :accept="accept?accept:''" @change="fileChanged($event)" ref="file"  id="fileInfo" multiple="multiple">
                </span>
                <span class="upImgText">{{imageName}}</span> 
            </div>
        </div>
        <p class="err" v-show="showErr">请输入完整信息</p>
        <div slot="footer" class="dialog-footer">
            <button class="editBtnS" @click="uploadIMG">上传</button>
            <button class="editBtnC" @click="upImgCancle">取消</button>
        </div>
    </el-dialog>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
export default Vue.component('common-upload',{
    data(){
        return {
            showErr:'',//错误信息
            imageName:'未选择任何文件',
            filesList:[],
            QJFileManageSystemURL:'',
            BDMSUrl:'',
            userId:'',
            projId:'',
            token:'',
            des:'',//文件描述
        }
    },
    props:['uploadshow','dirid','fgid','isqj','title','accept','ugid'],
    mounted(){
        var vm = this

        vm.token  = localStorage.getItem('token')
        vm.userId  = localStorage.getItem('userid')
        vm.projId = localStorage.getItem('projId');
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
        vm.BDMSUrl = vm.$store.state.BDMSUrl
    },
    methods:{
        selectImg(){
             this.$refs.file.click()
        },
        fileChanged(file){
            var vm = this
            // var FileLength = vm.$refs.file.files.length
            vm.filesList = vm.$refs.file.files[0] //[]
            // for(var i= 0;i<FileLength;i++){
            //     vm.filesList.push(vm.$refs.file.files[i])
            // }
            vm.imageName = vm.filesList.name
            // if(vm.filesList.length == 1){
            //      vm.imageName = vm.filesList.name
            // }else if(vm.filesList.length > 1){
            //     vm.imageName = vm.filesList.length+'个文件'
            // }else{
            //     vm.imageName = '未选择任何文件'
            // }
        },
        upImgCancle(){
            var vm = this
            vm.$emit('hiddenupload')
        },
         latestFile(fileId,log){
            var vm = this
            axios({
                method:'POST',
                url:vm.BDMSUrl+'project2/doc/latestFile',
                headers:{
                    'token':vm.token
                },
                params:{
                    log:log,
                    userGroupId:vm.ugid,//目录id
                    projId:vm.projId
                },
                data:fileId,//文件id
            }).then((response)=>{
                if(response.data.cd == 0){
                }
            }).catch((err)=>{
                console.log(err)
            })
        },
        uploadIMG(){
            var vm = this
            /*
            isUploadPoint 0不是全景类型 1是全景类型 
            dirId 目录ID
            fgId 
            fileDesc 描述
            **/
           if(vm.filesList == null){
               vm.$message({
                   type:'error',
                   message:'请选择文件！'
               })
               return false
           }
           console.log(vm.dirid+':::'+vm.fgid+':::'+vm.des+':::'+vm.isqj)
            var returnUrl = vm.BDMSUrl+"project2/doc/uploadFile?dirId="+vm.dirid+"&fgId="+vm.fgid+"&fileDesc="+vm.des+"&isUploadPoint="+vm.isqj;
            returnUrl = encodeURIComponent(returnUrl);
            var formData = new FormData()
            formData.append('token',vm.token);
            formData.append('projId',vm.projId);
             formData.append('type',1);
            formData.append('file',vm.filesList);
            formData.append('userId',vm.userId);
            formData.append('modelCode','002');
            formData.append('returnUrl',returnUrl);
            axios({
                method:'POST',
                url:vm.QJFileManageSystemURL + 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                var fileId = []
                if(response.data.rt){
                    vm.des = ''
                    vm.imageName ='未选择任何文件'
                    vm.filesList = null
                    fileId.push(response.data.rt[0].fileId)
                    vm.latestFile(fileId,"更新了点位文件"+response.data.rt[0].fileName);
                    vm.$refs.file.value = ''
                    vm.$emit('refreshqj')
                }
            }).catch((err)=>{
                vm.des = ''
                vm.imageName ='未选择任何文件'
                vm.$emit('refreshqj')
                console.log(err)
            })
        }
    }
})
</script>
<style>

</style>


