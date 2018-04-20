<template>
      <el-dialog :title="title" :visible="uploadshow" @close="upImgCancle">
        <div class="editBody">
            <div class="editBodytwo imageBody">
                <label class=" imageBodyText">文件说明 :</label>
                <input type="text" class="inp" v-model="des">
            </div>
            <div class="editBodytwo imageBody">
                <label class=" imageBodyText">上传图片 :</label>
                <span class="updataImageSpan">
                    <span @click="selectImg">
                         <button class="upImgBtn">选择图片</button>
                    </span>
                    <input class="upInput"  type="file" accept="image/*" @change="fileChanged($event)" ref="file"  id="fileInfo" multiple="multiple">
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
            imageName:'未选择任何图片',
            filesList:{},
            QJFileManageSystemURL:'',
            userId:'',
            projId:'',
            token:'',
            des:'',//文件描述
        }
    },
    props:['uploadshow','dirid','fgid','isqj','title'],
    mounted(){
        var vm = this

        vm.token  = localStorage.getItem('token')
        vm.userId  = localStorage.getItem('userid')
        vm.projId = localStorage.getItem('projId');
        vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
    },
    methods:{
        selectImg(){
             this.$refs.file.click()
        },
        fileChanged(file){
            var vm = this
            console.log(file)
            const list = vm.$refs.file.files
            vm.imageName = list[0].name
            vm.filesList = list[0]
        },
        upImgCancle(){
            var vm = this
            vm.$emit('hiddenupload')
        },
        uploadIMG(){
            var vm = this
            /*
            isUploadPoint 0不是全景类型 1是全景类型 
            dirId 目录ID
            fgId 
            fileDesc 描述
            **/
           console.log(vm.dirid+':::'+vm.fgid+':::'+vm.des+':::'+vm.isqj)
            var returnUrl = "http://10.252.26.240:8080/h2-bim-project/project2/doc/uploadFile?dirId="+vm.dirid+"&fgId="+vm.fgid+"&fileDesc="+vm.des+"&isUploadPoint="+vm.isqj;
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
                url:vm.QJFileManageSystemURL + 'uploading/uploadFileInfo',//vm.QJFileManageSystemURL + 'uploading/uploadFileInfo'
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                data:formData,
            }).then((response)=>{
                console.log(response)
                if(response.data.rt){
                    vm.des = ''
                    vm.imageName ='未选择任何图片'
                     vm.$emit('refreshqj')
                }
            }).catch((err)=>{
                vm.des = ''
                vm.imageName ='未选择任何图片'
                 vm.$emit('refreshqj')
                console.log(err)
            })
        }
    }
})
</script>
<style>

</style>


