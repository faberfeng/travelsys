<template>
    <div id="configmap" >
        <div class="topHeader" v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
            <div id="item-box-file">
                <!-- <router-link :to="'/Cost/management'" class="label-item">  
                    成本概览  
                </router-link>
                <router-link :to="'/Cost/goujianList'"  class="label-item ">  
                    构件量清单  
                </router-link>
                <router-link :to="'/Cost/quantities'"  class="label-item label-item-active">  
                    工程量清单  
                </router-link>
                <router-link :to="'/Cost/inventory'" class=" label-item">  
                    物料量清单  
                </router-link> -->
                 <router-link v-for="(item,index) in routerList" :key="index" :to="item.routerLink" v-text="item.webName?item.webName:item.moduleName" :class="['label-item',{'label-item-active':item.isShow}]">        
                </router-link>
            </div>
            <div v-if="showMain">
                <div id="containerMessage">
                    <p class="antsLine">
                        成本管理<i class="icon-sanjiao-right"></i>
                        <span class="backTo"  @click="back()" v-text="title"></span>
                        <i class="icon-sanjiao-right"></i>
                        <span class="strong">配置工程映射</span>
                    </p>
                </div>
                <div class="project">
                    <div class="selectSetion">
                        <div style="float:left">
                            <label>单体</label>
                            <el-select v-model="singleValue" @change="selectChange">
                                <el-option v-for="(item,index) in singleData" :key="index" :label="item.label" :value="item.value">

                                </el-option>
                            </el-select>
                            <label class="secT">分区</label>
                            <el-select v-model="sperateValue">
                                <el-option v-for="(item,index) in sperateAreaData" :key="index" :label="item.label" :value="item.value">
                                    
                                </el-option>
                            </el-select>
                            <button class="refreGouJian" @click="refreshGouJian">刷新构件集合</button>
                        </div>
                        <button class="refreall" @click="refreshAllGouJian">全部重新应用</button>
                    </div>
                    <div >
                        <zk-table 
                            index-text="序号"
                            :data="mappingData" :columns="columns" :tree-type="props.treeType"
                            :expand-type="props.expandType" :show-index="props.showIndex" :selection-type="props.selectionType" 
                            :border="props.border" empty-text="暂无数据...">
                            <template slot="action" slot-scope="scope">
                                <div v-if="scope.row.level == 2">
                                    <div v-if="scope.row.unmappingEntity == 0">
                                        <button class="refreshBtn actionBtn"  title="重新应用" @click="refreshEntityMapping(scope)"></button>
                                        <button class="editBtn actionBtn" title="添加映射" @click="addMapping(scope)"></button>
                                    </div>
                                    <div v-else>
                                        <button class="refreshBtn actionBtn"  title="重新应用" @click="refreshEntityMapping(scope)"></button>
                                        <button class="detailBtn actionBtn" title="未被映射" @click="unmappingEntityList(scope)"></button>
                                        <button class="editBtn actionBtn" title="添加映射" @click="addMapping(scope)"></button>
                                    </div>
                                </div>
                                <button class="listBtn actionBtn" v-if="scope.row._level == 4" title="构件列表" @click="entityList(scope)"></button>
                                <button class="detailBtn actionBtn" v-if="scope.row._level == 4" title="编辑映射" @click="editMapping(scope)"></button>
                            </template> 
                        </zk-table>
                    </div>
                </div>
            </div>
            
            <!--构件列表-->
            <div v-if="!showMain">
                <mapping-project :projData='entityObj' :entityNumber='entityNumber' :isMapped="isMapping" @back="backToMappingConfig"></mapping-project>
            </div>
        </div>
        <div id="ProjectTotalNumber">
            <el-dialog  title="工程量映射" :visible.sync="addProjectMapped.show" :before-close="addProjectMappedCancel">
                <div class="editBody">
                    <div class="projectTitle">
                        <label  class="TitleText">工程量条目 : </label>
                        <label class="TitleNumber" >{{projectNumber}}</label>
                    </div>
                    <div class="projectSelect">
                        <span class="projectSpan">
                             <select class="editSelect " v-model="firstSelectTitle" @change="firstSelectTitleChange">
                                <option v-for="(item,index) in firstSelectData" :key="index" :value="item.classifyCode">{{item.classifyCode.substr(0,2)+'-'+item.classifyName}}</option>
                            </select>
                            <i class="icon-down icon-downOne"></i>
                        </span>
                        <span class="projectSpan">
                            <select class="editSelect" v-model="secondSelectTitle" @change="secondSelectTitleChange">
                                <option v-for="(item,index) in secondSelectData" :key="index" :value="item.classifyCode">{{item.classifyCode.substr(2,2)+'-'+item.classifyName}}</option>
                            </select>
                            <i class="icon-down icon-downTwo"></i>
                        </span>
                        <span class="projectSpan">
                            <select class="editSelect" v-model="thirdSelectTitle" @change="thirdSelectTitleChange">
                                <option v-for="(item,index) in thirdSelectData" :key="index" :value="item.classifyCode">{{item.classifyCode.substr(4,2)+'-'+item.classifyName}}</option>
                            </select>
                            <i class="icon-down icon-downThree"></i>
                        </span>
                        <span class="projectSpan  projectSpanLast">
                            <select class="editSelect" v-model="fourthSelectTitle" @change="fourthSelectTitleChange">
                                <option v-for="(item,index) in fourthSelectData" :key="index" :value="item.classifyCode">{{item.classifyCode.substr(6,3)+'-'+item.classifyName}}</option>
                            </select>
                            <i class="icon-downFour icon-down"></i>
                        </span>
                    </div>
                    <div class="calculate" >
                        <div class="calculateLeft" style="overflow:hidden">
                            <span class="calculateResult">计量条件 : 结果为 <label>是/否</label></span>
                            <div>
                                <input class="calculateInp" placeholder="请输入" v-model="jiLiangCondition"/>
                                <button class="calculateBtn" @click="showConvenience(10000)">...</button>
                            </div>
                        </div>
                        <div class="calculateRight" style="overflow:hidden">
                            <span class="calculateResult">计量公式 : 结果为 <label>{{calculateResultFinall}}</label></span>
                            <div>
                                <input class="calculateInp" placeholder="请输入" v-model="jiLiangResult"/>
                                <button class="calculateBtn" @click="showConvenience(20000)">...</button>
                            </div>
                        </div>
                    </div>
                    <div class="symbolYingshe">特征映射 : </div>
                    <div class="tableInputClass">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width:287px;">特征</th>
                                    <th style="width:86px;">值类型</th>
                                    <th>公式</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in addProjectMappingData" :key="index">
                                    <td>
                                        {{item.characterName}}
                                    </td>
                                    <td>
                                        {{item.valueType_}}
                                    </td>
                                    <td>
                                        <input type="text" class="TextInput" value="@" v-model="item.formula_"/>
                                        <button class="textAndBtn" style="margin-right:10px" @click="showConvenience(index)">...</button>
                                    </td>    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="addProjectMappedSure">确定</button>
                    <button class="editBtnC" @click="addProjectMappedCancel">取消</button>
                </div>
            </el-dialog>
            <!--编辑工程量映射-->
            <el-dialog  title="工程量映射" :visible.sync="editProjectMapped.show" :before-close="editProjectMappedCancel">
                <div class="editBody">
                    <div class="projectTitle">
                        <label  class="TitleText">工程量条目 : </label>
                        <label class="TitleNumber" >{{projectNumber}}</label>
                    </div>
                    <div class="projectSelect">
                        <span class="projectSpan">
                            <input v-model="firstSelectTitle" class="editSelect" disabled style="background:none;"/>
                            <i class="icon-down icon-downOne"></i>
                        </span>
                        <span class="projectSpan">
                            <input v-model="secondSelectTitle" class="editSelect" disabled style="background:none;"/>
                            <i class="icon-down icon-downTwo"></i>
                        </span>
                        <span class="projectSpan">
                            <input v-model="thirdSelectTitle" class="editSelect" disabled style="background:none;"/>
                            <i class="icon-down icon-downThree"></i>
                        </span>
                        <span class="projectSpan  projectSpanLast">
                            <input v-model="fourthSelectTitle" class="editSelect" disabled style="background:none;"/>
                            <i class="icon-downFour icon-down"></i>
                        </span>
                    </div>
                    <div class="calculate" >
                        <div class="calculateLeft" style="overflow:hidden">
                            <span class="calculateResult">计量条件 : 结果为 <label>是/否</label></span>
                            <div>
                                <input class="calculateInp" placeholder="请输入" v-model="jiLiangCondition"/>
                                <button class="calculateBtn" @click="showConvenience(10000)">...</button>
                            </div>
                        </div>
                        <div class="calculateRight" style="overflow:hidden">
                            <span class="calculateResult">计量公式 : 结果为 <label>{{calculateResultFinall}}</label></span>
                            <div>
                                <input class="calculateInp" placeholder="请输入" v-model="jiLiangResult"/>
                                <button class="calculateBtn" @click="showConvenience(20000)">...</button>
                            </div>
                        </div>
                    </div>
                    <div class="symbolYingshe">特征映射 : </div>
                    <div class="tableInputClass">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width:287px;">特征</th>
                                    <th style="width:86px;">值类型</th>
                                    <th>公式</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in addProjectMappingData" :key="index">
                                    <td>
                                        {{item.characterName}}
                                    </td>
                                    <td>
                                        {{item.valueType_}}
                                    </td>
                                    <td>
                                        <input  type="text" class="TextInput" value="@"  v-model="item.formula_"/>
                                        <button class="textAndBtn" style="margin-right:10px" @click="showConvenience(index)">...</button>
                                    </td>    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <button class="editBtnS" @click="editProjectMappedSure">确定</button>
                    <button class="editBtnC" @click="editProjectMappedCancel">取消</button>
                </div>
            </el-dialog>
            <div id="CInput" ref="convenienceInp">
                <el-dialog  title="表达式快捷输入面板" :visible.sync="convenientInput" :before-close="cancelConveient"  :key="0">
                    <div class="editBody">
                        <div class="InputBody">
                            <div class="InputBodyLeft">
                                <div class="InputBodyTitle">
                                    <span>构件属性</span>
                                </div>
                                <select class="multipleSelectA" multiple="multiple" v-model="inputGouJianType">
                                    <option v-for="(item,index) in goujianProperty" :key="index">{{item.code}}({{item.classifyName}})</option>
                                </select>
                            </div>
                            <div class="InputBodyMiddle">
                                <div class="InputBodyTitle">
                                    <span>运算符</span>
                                </div>
                                <select class="multipleSelectB" multiple="multiple"  v-model="inputGouJianCalculate">
                                    <option>+(加)</option>
                                    <option>-(减)</option>
                                    <option>*(乘)</option>
                                    <option>/(除)</option>
                                    <option>==(等于)</option>
                                    <option>！=(不等于)</option>
                                    <option>&lt;(小于)</option>
                                    <option>&le;(小于等于)</option>
                                    <option>&gt;(大于)</option>
                                    <option>&ge;(大于等于)</option>
                                    <option>&&(且)</option>
                                    <option>||(或)</option>
                                    <option>!(非)</option>
                                </select>
                            </div>
                            <div class="InputBodyRight">
                                <div class="InputBodyTitle">
                                    <span>函数</span>
                                </div>
                                <select class="multipleSelectC" multiple="multiple" v-model="inputGouJianFunction">
                                    <option>()</option>
                                    <option>IF(A,B,C)</option>
                                    <option>SUB(A,B)</option>
                                </select>
                            </div>
                            <div class="InputBodyLast">
                                <div class="InputBodyTitle">
                                    <span>可取值</span>
                                </div>
                                <select multiple="multiple" class="multipleSelectD" v-model="inputGouJianValue">
                                    <option>true</option>
                                    <option>false</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                    <option>100</option>
                                    <option>1000</option>
                                    <option>10000</option>
                                </select>
                            </div>
                        </div>
                    </div>   
                    <div slot="footer" class="dialog-footer">
                        <button class="editBtnS" @click="saveConvenient">保存</button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import './js/jquery-1.4.4.min.js';
import mappingproject from './MappingProjecttwo.vue';
import dataJs from '../Settings/js/date.js'
export default {
    name:'ConfigMapTwo',
    data(){
        return{
            routerList:'',
            moduleList:'',
            title:'工程量清单',
            mappingData:[],
            token:'',
            showMain:true,
            BDMSUrl:'',
            loading:false,
            singleValue:'',//单体值
            sperateValue:'',//分区的值
            columns: [
                {
                    label: '模板名称',
                    prop: 'name',
                    minWidth: '260px',
                },
                {
                    label: '工程量编码',
                    prop: 'componentNumber',
                    align:"center",
                    headerAlign:"center"  
                },
                {
                    label: '工程量条目',
                    prop: 'entityCount',
                    align:"center",
                    headerAlign:"center" ,
                    width: '205px', 
                },
                {
                    label: '计量条件',
                    prop: 'calCondition',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label: '构件数量',
                    prop: 'entityCount',
                    align:"center",
                    headerAlign:"center" 
                },
                {
                    label:'操作',
                    prop:'operator',
                    type: 'template',
                    template: 'action',
                    minWidth:'125px',
                    align:"center",
                    headerAlign:"center" 
                }
            ],
            props: {
                stripe: true,
                border: true,
                showHeader: true,
                showSummary: false,
                showRowHover: true,
                showIndex: false,
                treeType: true,
                isFold: true,
                expandType: false,
                selectionType: false,
            }, 
            singleData:[{
                value:'OVERALL_FIELD',
                label:'[总体场地]'
            },{
                value:'ALL',
                label:'全部'
            }],
            sperateAreaData:[{
                value:'NONE',
                label:'无'
            }],
            addProjectMapped:{//新增映射
                show:false,
            },
            addMappingData:{},//添加映射获得的行数据
            firstSelectData:[],
            firstSelectTitle:'',
            projectNumber:'',
            secondSelectData:[],
            secondSelectTitle:'',
            thirdSelectTitle:'',
            thirdSelectData:[],
            fourthSelectTitle:'',
            fourthSelectData:[],
            jiLiangCondition:'',//计量条件
            jiLiangResult:'',//计量结果
            calculateResultFinall:'',//计算结果
            addProjectMappingData:[],
            convenientInput:false,//显示快捷输入面板
            inputGouJianType:[],
            inputGouJianCalculate:[],
            inputGouJianFunction:[],
            inputGouJianValue:[],
            showConvenienceType:'',
            showConvenienceObject:{},
            goujianProperty:[],//构件属性
            editProjectMapped:{
                show:false
            },//编辑映射
            editMappingData:{},//拿到编辑映射行
            entityNumber:'',
        }
    },
    created(){
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        this.BDMSUrl = this.$store.state.BDMSUrl;
        this.singleValue = 'OVERALL_FIELD';
        this.sperateValue = 'NONE';
        vm.moduleList=JSON.parse(localStorage.getItem('moduleList'));
        vm.loadingTitle();
        this.findSubProject();
    },
    methods:{
         loadingTitle(){
            var vn=this;
            vn.routerList=vn.getSecondGradeList(vn.moduleList,'012','01202','/Cost/goujianList','01203','/Cost/quantities','01201','/Cost/management','01204','/Cost/inventory');
            // console.log(vn.routerList,'vn.routerList')
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
        back(){
            this.$router.push('/Cost/quantities');
        },
        //
        findSubProject(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/findSubProject/'+this.projId,
                headers:{
                    token:this.token
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    if(response.data.rt.rows!=null && response.data.rt.rows.length != 0){
                        response.data.rt.rows.forEach(item=>{
                            this.singleData.push({
                                value:item.ID,
                                label:item.Name
                            })
                        })
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        selectChange(){
            this.sperateAreaData = [{
                value:'NONE',
                label:'无'
            }];
            this.sperateAreaData.push({
                value:'-1',
                label:'全部分区及内部楼层'
            });
            if(this.singleValue!='-1' && this.singleValue!='0'){
                axios({
                    method:'get',
                    url:this.BDMSUrl+'project2/Config/findDistrictByBuild',
                    headers:{
                        token:this.token
                    },
                    params:{
                        projId:this.projId,
                        build:this.singleValue
                    }
                }).then(response=>{
                    if(response.data.cd ==0){
                        if(response.data.rt!=null && response.data.rt.length!=0){
                            response.data.rt.forEach(item=>{
                                this.sperateAreaData.push({
                                    value:item.ID,
                                    label:item.Name+'及内部楼层'
                                })
                            })
                        }
                    }else{
                        alert(response.data.msg);
                    }
                })
            }
            
        },
        //刷新构件集合
        refreshGouJian(){
            this.loading = true;
            let setting = {
                data: {
                    key:{
                        name: "authName",
                        children:'children'
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentID",
                        rootPId: 0
                    }
                }
            };
            let setting1 = {
                data: {
                    key:{
                        name: "authName",
                        children:'children'
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentID",
                        rootPId: 0
                    }
                }
            };
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/report/getTemplateEntityMappingInfo',
                headers:{
                    token:this.token
                },
                params:{
                    buildInfo:this.singleValue+'__'+this.sperateValue,
                    projectId:this.projId,
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.loading = false;
                    if(response.data.rt !=null){
                        let componentList = response.data.rt.componentList;
                        let templateList0 = response.data.rt.templateList0;
                        let templateList1 = response.data.rt.templateList1;
                        let templateList2 = response.data.rt.templateList2;
                        componentList.forEach(item=>{
                            Object.assign(item,{
                                _level:4,
                                entityCount_:`${item.entityCount}(${item.unMappingCount})`
                            })
                        })
                        templateList0.forEach(item=>{
                            Object.assign(item,{
                                entityCount_:`${item.entityCount}(${item.unMappingCount})`
                            })
                        })
                        templateList1.forEach(item=>{
                            Object.assign(item,{
                                entityCount_:`${item.entityCount}(${item.unMappingCount})`
                            })
                        })
                        templateList2.forEach(item=>{
                            Object.assign(item,{
                                entityCount_:`${item.entityCount}(${item.unMappingCount})`
                            })
                        })
                        let aData = [...templateList0,...templateList1,...templateList2];
                        for (var i = 0; i < templateList2.length;i++){
                            for (var j = 0; j < componentList.length; j++) {
                                if (templateList2[i].id == componentList[j].templateId) {
                                    if (typeof (templateList2[i].children) == "undefined") {
                                        var array = new Array();
                                        templateList2[i].children = array;

                                    }
                                    templateList2[i].children.push(componentList[j]);
                                }
                            }
                        }
                        for (var i = 0; i < templateList1.length; i++) {
                            for (var j = 0; j < templateList2.length; j++) {
                                if (templateList1[i].id == templateList2[j].parentID) {
                                    if (typeof (templateList1[i].children) == "undefined") {
                                        var array = new Array();
                                        templateList1[i].children = array;

                                    }
                                    templateList1[i].children.push(templateList2[j]);
                                }
                            }
                        }
                        for (var i = 0; i < templateList0.length; i++) {
                            for (var j = 0; j < templateList1.length; j++) {
                                if (templateList0[i].id == templateList1[j].parentID) {
                                    if (typeof (templateList0[i].children) == "undefined") {
                                        var array = new Array();
                                        templateList0[i].children = array;

                                    }
                                    templateList0[i].children.push(templateList1[j]);
                                }
                            }
                        }
                        this.mappingData = templateList0;
                    }
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //全部重新应用
        refreshAllGouJian(){
            this.refreshGouJian();
        },
        //重新应用
        refreshEntityMapping(scope){
            let rowData = scope.row;
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/report/refreshEntityMapping',
                headers:{
                    token:this.token
                },
                data:{
                    cacheId:rowData.unmappingUuid,
                    projId:this.projId,
                    no:rowData.no
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.refreshGouJian();
                }else{
                    alert(response.data.msg);
                }
            })
        },
        /**添加映射 
        */
        addMapping(scope){
            this.addMappingData = scope.row;
            this.addProjectMapped.show = true;
            this.loadFirstSelectData();
        },
        //加载第一个下拉框
        loadFirstSelectData(){
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/loadLevelXGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    obscureCode:'__0000',
                    codeLength:6,
                    tableNo:'t32',
                    projId:this.projId,
                    type:2
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.firstSelectData = response.data.rt;
                    this.firstSelectTitle = this.firstSelectData[0].classifyCode;
                    this.loadSecondSelectData(this.firstSelectTitle.substr(0,2));
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }) 
        },
        //加载第二个下拉框
        loadSecondSelectData(oCode){
            var vm = this
            axios({
                method:'get',
                url:vm.BDMSUrl+'project2/Config/loadLevelXGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    obscureCode:oCode+'__00',
                    codeLength:6,
                    tableNo:'t32',
                    projId:this.projId,
                    type:2
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.secondSelectData = response.data.rt;
                    this.secondSelectData.splice(0,1);
                    this.secondSelectTitle = this.secondSelectData[0].classifyCode;
                    this.loadThirdSelectData(this.secondSelectTitle.substr(0,4));
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }) 
        },
        //加载第三个下拉框
        loadThirdSelectData(oCode){
            var vm = this
            axios({
                method:'get',
                url:vm.BDMSUrl+'project2/Config/loadLevelXGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    obscureCode:oCode+'__',
                    codeLength:6,
                    tableNo:'t32',
                    projId:this.projId,
                    type:2
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.thirdSelectData = response.data.rt;
                    this.thirdSelectData.splice(0,1);
                    this.thirdSelectTitle = this.thirdSelectData[0].classifyCode;
                    this.loadFourthSelectData(this.thirdSelectTitle.substr(0,6));
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }) 
        },
        //加载第四个下拉框
        loadFourthSelectData(oCode){
            var vm = this
            axios({
                method:'get',
                url:vm.BDMSUrl+'project2/Config/loadLevelXGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    obscureCode:oCode+'%',
                    codeLength:9,
                    tableNo:'t32',
                    projId:this.projId,
                    type:2
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.fourthSelectData = response.data.rt;
                    this.fourthSelectTitle = this.fourthSelectData[0].classifyCode;
                    this.projectNumber = this.fourthSelectTitle;
                    this.getEngineeringInfo();
                    this.getGenieclassCriterion();
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }) 
        },
        //第一个下拉框改变
        firstSelectTitleChange(){
            var code = this.firstSelectTitle.substr(0,2);
            this.loadSecondSelectData(code);
        },
        //第二个下拉框改变
        secondSelectTitleChange(){
            var code = this.secondSelectTitle.substr(0,4);
            this.loadThirdSelectData(code);
        },
        //第三个下拉框改变
        thirdSelectTitleChange(){
            var code = this.thirdSelectTitle.substr(0,6);
            this.loadFourthSelectData(code);
        },
        //第四个下拉框改变
        fourthSelectTitleChange(){
            this.projectNumber = this.fourthSelectTitle;
            this.getEngineeringInfo();
        },
        //获取工程量特性映射
        getEngineeringInfo(){
            var vm = this;
            axios({
                method:'post',
                url:vm.BDMSUrl+'project2/report/getCharacterValue',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    templateId:encodeURIComponent(this.addMappingData.id),
                    number:this.projectNumber,
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    if(response.data.rt.rows){
                        this.addProjectMappingData = response.data.rt.rows;
                        this.addProjectMappingData.forEach(item=>{
                            item = Object.assign(item,{
                                valueType_:this.judgeValueType(item.valueType),
                                formula_:item.formula===null? '@':item.formula
                            })
                        })
                    }
                }else if (response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //判断值类型
        judgeValueType(value){
            if (value == 0) {
                    return "数值";
            } else if (value == 1) {
                return "文本";
            } else if (value == 2) {
                return "是否";
            } else if (value == 3) {
                return "时间";
            }
        },
        //获取分类编码信息
        getGenieclassCriterion(){
            var vm = this
            axios({
                method:'get',
                url:vm.BDMSUrl+'project2/Config/getGenieclassCriterion',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    classifyCode:this.projectNumber,
                    tableNo:'t32'
                }
            }).then(response=>{
                if(response.data.cd  == '0'){
                    if(response.data.rt!=null){
                        this.calculateResultFinall = response.data.rt.other;
                    }
                }else if (response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
        //显示快捷输入面板
        showConvenience(scope){
            this.showConvenienceObject = scope;
            this.showConvenienceType = scope;
            this.convenientInput = true;
        },
        //保存快捷输入面板
        saveConvenient(){
            if(this.inputGouJianType.length != 0){
                this.inputGouJianType = this.inputGouJianType[0].split('(')[0];
            }else {
                this.inputGouJianType = '';
            }
            if(this.inputGouJianCalculate.length != 0){
                this.inputGouJianCalculate = this.inputGouJianCalculate[0].split('(')[0];
            }else{
                this.inputGouJianCalculate = '';
            }
            if(this.inputGouJianFunction.length != 0){
                this.inputGouJianFunction = this.inputGouJianFunction[0];
            }else{
                this.inputGouJianFunction = '';
            }
            if(this.inputGouJianValue.length != 0){
                this.inputGouJianValue = this.inputGouJianValue[0];
            }else{
                this.inputGouJianValue = '';
            }
            if(this.showConvenienceType == 10000){
                this.jiLiangCondition += this.inputGouJianType+this.inputGouJianCalculate+this.inputGouJianFunction+this.inputGouJianValue;
            }else if(this.showConvenienceType == 20000){
                this.jiLiangResult += this.inputGouJianType+this.inputGouJianCalculate+this.inputGouJianFunction+this.inputGouJianValue;
            }else{
                var str = this.addProjectMappingData[this.showConvenienceObject].formula_+this.inputGouJianType+this.inputGouJianCalculate+this.inputGouJianFunction+this.inputGouJianValue; 
                this.addProjectMappingData.forEach((item,index)=>{
                    if(index == this.showConvenienceObject){
                        item = Object.assign(item,{
                            formula_:str
                        })
                    }
                })
            }
            this.inputGouJianType = [];
            this.inputGouJianCalculate = [];
            this.inputGouJianFunction = [];
            this.inputGouJianValue = [];
            this.convenientInput = false;
        },
        //关闭快捷输入面板
        cancelConveient(){
            this.convenientInput = false;
            this.inputGouJianType = [];
            this.inputGouJianCalculate = [];
            this.inputGouJianFunction = [];
            this.inputGouJianValue = [];
        },
        //确认添加工程量映射
        addProjectMappedSure(){
            var arr = [];
            var vm = this
            this.addProjectMappingData.forEach((item,index)=>{
                arr.push({
                    id:item.id,
                    formula:$('.TextInput')[index].value
                })
            })
            if(this.jiLiangCondition == '' || this.jiLiangResult == ''){
                alert('请输入完整表单');
            }else{
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'project2/report/addDesignMapping',
                    headers:{
                        token:this.token
                    },
                    data:{
                        projId:this.projId,
                        condition:this.jiLiangResult,
                        engineeringNumber:this.projectNumber,
                        templateId:this.addMappingData.id,
                        formula:this.jiLiangCondition,
                        mappings:arr,
                        projId:this.projId
                    },
                    params:{
                        projectId:this.projId
                    }
                }).then(response=>{
                    if(response.data.cd == '0'){
                        this.addProjectMapped.show = false;
                        this.jiLiangCondition = '';
                        this.jiLiangResult = '';
                        this.refreshGouJian();
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        //取消添加工程量映射
        addProjectMappedCancel(){
            this.addProjectMapped.show = false;
            this.jiLiangCondition = '';
            this.jiLiangResult = '';
        },
        //获取entityNumber
        getEntityNumber(transformData,num){
            for(let i=0;i<transformData.length;i++){
                if(transformData[i].level == num-1){
                    this.entityNumber = transformData[i].classifyCode.split('-')[1];
                }
                if(transformData[i].children!=null && transformData[i].children.length!=0){
                    return this.getEntityNumber(transformData[i].children,num);
                }
            }
        },
        /**编辑映射 
        */
       editMapping(scope){
            this.editProjectMapped.show = true;
            this.editMappingData = scope.row;
            this.jiLiangCondition = scope.row.calCondition;
            this.jiLiangResult = scope.row.formula;
            this.projectNumber = scope.row.componentNumber.split('-')[1];
            this.fourthSelectTitle = this.projectNumber.substr(6,3)+'-'+scope.row.name;
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/loadLevelXGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    obscureCode:'__0000',
                    codeLength:6,
                    tableNo:'t32',
                    projId:this.projId,
                    type:2
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    if(response.data.rt){
                        response.data.rt.forEach(item=>{
                            if(item.classifyCode.substr(0,2) == this.projectNumber.substr(0,2)){
                                this.firstSelectTitle = item.classifyCode.substr(0,2)+'-'+item.classifyName;
                            }
                        })
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }) 
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/loadLevelXGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    obscureCode:this.projectNumber.substr(0,2)+'__00',
                    codeLength:6,
                    tableNo:'t32',
                    projId:this.projId,
                    type:2
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    if(response.data.rt){
                        response.data.rt.forEach(item=>{
                            if(item.classifyCode.substr(2,2) == this.projectNumber.substr(2,2)){
                                this.secondSelectTitle = item.classifyCode.substr(2,2)+'-'+item.classifyName;
                            }
                        })
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }) 
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/loadLevelXGenieClass',
                headers:{
                    token:this.token
                },
                params:{
                    obscureCode:this.projectNumber.substr(0,4)+'__',
                    codeLength:6,
                    tableNo:'t32',
                    projId:this.projId,
                    type:2
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    if(response.data.rt){
                        response.data.rt.forEach(item=>{
                            if(item.classifyCode.substr(4,2) == this.projectNumber.substr(4,2)){
                                this.thirdSelectTitle = item.classifyCode.substr(4,2)+'-'+item.classifyName;
                            }
                        })
                    }
                }else if(response.data.cd == '-1'){
                    alert(response.data.msg);
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            }) 
            axios({
                method:'post',
                url:this.BDMSUrl+'project2/Config/getEngineeringInfo',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    classifyCode:this.projectNumber,
                    tableNo:'t32',
                    entityNumber:this.entityNumber
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.addProjectMappingData = response.data.rt.rows;
                        this.addProjectMappingData.forEach(item=>{
                            item = Object.assign(item,{
                                valueType_:this.judgeValueType(item.valueType),
                                formula_:item.formula===null? '@':item.formula
                            })
                        })
                }else if(response.data.cd  == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
            axios({
                method:'get',
                url:this.BDMSUrl+'project2/Config/getGenieclassCriterion',
                headers:{
                    token:this.token
                },
                params:{
                    projectId:this.projId,
                    classifyCode:this.projectNumber,
                    tableNo:'t32'
                }
            }).then(response=>{
                if(response.data.cd  == '0'){
                    this.calculateResultFinall = response.data.rt.other;
                }else if (response.data.cd == '-1'){
                    alert(response.data.msg)
                }else{
                    this.$router.push({
                        path:'/login'
                    })
                }
            })
        },
       //确定编辑
        editProjectMappedSure(){
            var arr = [];
            var vm = this
            this.addProjectMappingData.forEach((item,index)=>{
                arr.push({
                    id:item.id,
                    formula:$('.TextInput')[index].value
                })
            })
            if(this.jiLiangCondition == '' || this.jiLiangResult == ''){
                alert('请输入完整表单');
            }else{
                axios({
                    method:'post',
                    url:vm.BDMSUrl+'project2/report/editDesignMapping',
                    headers:{
                        token:this.token
                    },
                    data:{
                        projId:this.projId,
                        condition:this.jiLiangResult,
                        engineeringNumber:this.projectNumber,
                        templateId:this.editMappingData.templateId,
                        formula:this.jiLiangCondition,
                        mappings:arr,
                    },
                    params:{
                        projectId:this.projId,
                    }
                }).then(response=>{
                    if(response.data.cd == '0'){
                        this.addProjectMappedShow = false;
                        this.jiLiangCondition = '';
                        this.jiLiangResult = '';
                        this.editProjectMapped.show = false;
                        this.refreshGouJian();
                    }else if(response.data.cd == '-1'){
                        alert(response.data.msg)
                    }else{
                        this.$router.push({
                            path:'/login'
                        })
                    }
                })
            }
        },
        //取消编辑
        editProjectMappedCancel(){
            this.editProjectMapped.show = false;
            this.jiLiangCondition = '';
            this.jiLiangResult = '';
        },
        /**
        *构件列表
        */
        entityList(scope){
            this.getEntityNumber(this.mappingData,scope.row.level);
            this.entityObj = scope.row;
            this.isMapping = true;
            if(scope.row.entityNum == 0){
                alert('当前工程量分类下没有符合计量条件的构件数据');
            }else{
                this.showMain = false;
            }
        },
        /**
        *未被映射
        */
        unmappingEntityList(scope){
            this.entityObj = scope.row;
            this.isMapping = false;
            if(scope.row.unmappingEntity == 0){
                alert('当前分类编码下的所有构件都已成功映射');
            }else{
                this.showMain = false;
            }
        },
        //子组件触发的函数
        backToMappingConfig(){
            this.showMain = true;
        }
    }
}
</script>
<style lang="less">
#configmap{
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .el-dialog{
        margin: 15vh auto!important;
    }
    .el-dialog__body{
        margin-top: 21px;
    }
    .topHeader{
        box-sizing: border-box;
        position: fixed;
        top: 116px;
        left: 26px;
        bottom:0;
        right: 0;
        overflow: auto;
    }
    //导航模块
    #item-box-file {
        display: block;
        border-bottom: 1px solid #e6e6e6;
        height: 49px;
        padding-top: 16px;
        padding-left: 20px;
        background: #fafbfc;
        position: relative;
        .label-item {
            float: left;
            height: 34px;
            font-size: 14px;
            width: 106px;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
            border-top: 3px solid #fafbfc;
            color: #999999;
            text-decoration: none;
        }
        .label-item-active {
            color: #fc3439;
            font-weight: bold;
            border-top: 3px solid #fc3439;
            border-left: 1px solid #e6e6e6;
            border-right: 1px solid #e6e6e6;
            border-bottom: 1px solid #fff;
            background: #ffffff;
        }
        .header {
            position: absolute;
            display: block;
            top: 13px;
            right: 50px;
            overflow: hidden;
            .singelOne {
            float: left;
            color: #999;
            font-size: 12px;
            height: 30px;
            line-height: 30px;
            margin-right: 10px;
            }
        }
    }
    #containerMessage{
        padding-left:20px; 
        margin-right: 25px;
        .antsLine {
            padding: 10px 10px 22px 0px;
            font-size: 12px;
            line-height: 12px;
            color: #999999;
            text-align: left;
            .backTo{
                cursor: pointer;
            }
            .backTo:hover{
                color: #fc3439;
            }
            .icon-sanjiao-right {
                display: inline-block;
                width: 7px;
                height: 10px;
                margin: 2px 7px 0;
                background-image: url('../ManageCost/images/sanjiaoright.png');
                background-size: 100% 100%;
            }
            .strong {
                cursor: pointer;
                color: #333333;
                font-weight: bold;
                &:last-of-type .icon-sanjiao-right {
                display: none;
                }
            }
        }
    }
    .project{
        margin: 0 20px;
        // height: 36px;
        .selectSetion{
             overflow: hidden;
             margin-bottom: 20px;
            label{
                font-size:14px;
                line-height: 14px; 
                display: inline-block;
                margin-right: 10px;
                color: #999;
            }
            .secT{
                margin-left: 27px;
            }
            .refreGouJian{
                width: 124px;
                border: none;
                height: 36px;
                background: #fc3439;
                color: #fff;
                margin-left: 27px;
                cursor: pointer;
                border-radius: 1px;
            }
            .refreall{
                width: 124px;
                border: none;
                height: 36px;
                background: #fff;
                color: #fc3439;
                float: right;
                border-radius: 34px;
                border: 1px solid #fc3439;
                cursor: pointer;
                outline: none;
            }
        }
        .el-input{
            width: 186px;
            height: 36px;
            display: inline-block;
        }
        .el-input__inner{
            height: 34px!important;
            color: #333;
            padding-left: 11px;
        }
        //zk-table组件样式
        .zk-table{
            color: #333333;
        }
        .zk-table--tree-icon{
            position: relative;
            width: 40px;
            display: inline-block;
            z-index: 10;
            background: #ffffff;
        }
        .zk-table--row-hover .zk-table--tree-icon{
            background: #ebf7ff;
        }
        .zk-table--tree-icon::after {
            display: block;
            position: absolute;
            top: 6px;
            left: 20px;
            width: 15px;
            height: 12px;
            background:url('./images/folder_1.png')no-repeat 0 0; 
            content: '';
        }
        .zk-icon-minus-square-o::after{
            background:url('./images/folder.png')no-repeat 0 0; 
        }
        .zk-table__body-row>td:first-of-type{
            width: 45px;
        }
        .zk-table--level-4-cell,.zk-table--level-3-cell,.zk-table--level-2-cell,.zk-table--level-1-cell,.zk-table--level-5-cell{
            position: relative;
        }
        .zk-table--level-4-cell::before,.zk-table--level-3-cell::before,.zk-table--level-2-cell::before,.zk-table--level-1-cell::before,.zk-table--level-5-cell::before{
            display: block;
            position: absolute;
            top: 2px;
            left: 2px;
            width: 12px;
            height: 14px;
            background:url('./images/file.png')no-repeat 0 0; 
            content: '';
            z-index: 1;
        }
        //按钮样式
        .actionBtn{
            width: 16px;
            height: 17px;
            border: none;
            cursor: pointer;
            margin-right: 10px;
        }
        .editBtn{
            background: url('../../assets/edit.png') no-repeat;
        }
        .detailBtn{
            background: url('./images/details.png') no-repeat;
        }
        .listBtn{
            background: url('./images/list.png') no-repeat;
        }
        .refreshBtn{
            background: url('./images/refresh.png') no-repeat;
        }
    }
    #ProjectTotalNumber {
        .tableInputClass{
            margin: 0 30px;
            table{
                width: 598px;
                border: 1px solid #ccc;
                text-align: left;
                border-collapse:collapse;
            }
            tr{
                margin: 0;
            }
            td{
                height: 42px;
                margin: 0;
                padding: 0 0 0 10px;
                border: 1px solid #ccc;
                color: #333;
            }
            tr:nth-child(2n){
                background: #f2f2f2;
            }
            tr:nth-child(2n) .TextInput{
                background: #f2f2f2;
            }
            th{
                height: 42px;
                background: #f2f2f2;
                margin: 0 ;
                padding: 0 0 0 10px;
                border: 1px solid #ccc;
                color: #666666;
            }
            .TextInput{
                height: 28px;
                margin-left: 10px;
                border: none;
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .textAndBtn{
                width: 60px;
                height: 28px;
                background: #fc3439;
                border: none;
                cursor: pointer;
                color: #fff;
                float: right;
                margin-right: 10px;
            }
            .TextInput::-moz-placeholder{
                color: #ccc;
            }
            .TextInput::-webkit-placeholder{
                color: #ccc;
            }
        }
        .el-dialog {
            width: 660px !important;
            border-radius: 2px;
        }
        .calculateBtn {
            width: 85px;
            height: 32px;
            color: #fff;
            background: #fc3439;
            border: none;
            cursor: pointer;
            margin-left: 10px;
            float: left;
        }
        .symbolYingshe {
            color: #999;
            font-size: 14px;
            line-height: 14px;
            margin-left: 30px;
            margin-bottom: 10px;
            display: block;
            text-align: left;
        }
        .zk-table {
            width: 600px;
            display: block;
            margin: 0 30px 0 30px;
        }
        .editBtnS,
        .editBtnC {
            width: 111px;
            height: 36px;
            border: none;
            padding: 0;
            cursor: pointer;
            border-radius: 2px;
        }
        .editBtnS {
            background: #fc3439;
            margin-right: 20px;
            color: #fff;
            font-size: 14px;
            font-weight: normal;
        }
        .editBtnS:hover {
            background: #ff5257;
        }
        .editBtnC {
            color: #666;
            background: #fff;
            border: 1px solid #ccc;
        }
        .editBtnC:hover {
            background: #e6e6e6;
            color: #666;
        }
        .el-dialog__footer {
            margin: 30px auto 39px;
        }
        .calculate {
            overflow: hidden;
            margin: 21px 30px 20px 30px;
        }
        .calculateLeft {
            float: left;
            text-align: left;
        }
        .calculateRight {
            float: left;
            text-align: left;
            margin-left: 20px;
        }
        .calculateResult {
            color: #999;
            font-size: 14px;
            line-height: 14px;
            display: inline-block;
            margin-bottom: 10px;
        }
        .calculateInp {
            height: 30px;
            border: 1px solid #ccc;
            width: 183px;
            padding-left: 10px;
            border-radius: 2px;
            box-sizing: content-box;
            float: left;
        }
        .el-dialog__title {
            color: #fc3439;
            font-size: 18px;
            line-height: 18px;
            font-weight: bold;
            font-family: 'MicrosoftYaHei';
            display: inline-block;
            margin: 34px 0 15px 30px;
        }
        .el-dialog__header {
            height: 67px;
            padding: 0;
            border-bottom: 2px solid #e6e6e6;
            text-align: left;
        }
        .projectTitle {
            color: #999;
            font-size: 14px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        .TitleText {
            font-size: 14px;
            line-height: 14px;
            float: left;
            margin-left: 30px;
        }
        .TitleNumber {
            font-size: 14px;
            line-height: 14px;
            float: left;
            margin-left: 7px;
        }
        .projectSelect {
            width: 598px;
            height: 30px;
            border: 1px solid #ccc;
            margin: 0 30px;
            line-height: 30px;
            position: relative;
            border-radius: 2px;
            box-sizing: content-box;
        }
        .editSelect {
            border: none;
            font-size: 14px;
            height: 20px;
            line-height: 20px;
            -moz-appearance: none;
            -webkit-appearance: none;
            color: #333;
            width: 100px;
            float: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
        }
        .editSelectLast {
            border: none;
        }
        .editSelect:focus {
            outline: none;
        }
        .icon-down {
            display: block;
            position: absolute;
            width: 12px;
            height: 7px;
            background-image: url('./images/sanjiao.png');
            background-size: 100% 100%;
            content: '';
            top: 12px;
        }
        .icon-downOne {
            left: 125px;
        }
        .icon-downTwo {
            left: 270px;
        }
        .icon-downThree {
            right: 175px;
        }
        .icon-downFour {
            right: 22px;
        }
        .projectSpan {
            height: 20px;
            line-height: 20px;
            width: 149px;
            border-right: 1px solid #ccc;
            float: left;
            margin-top: 5px;
            text-align: left;
            padding-left: 13px;
        }
        .projectSpanLast {
            border-right: none;
        }
        .zk-table--level-1-cell::before {
            background: none !important;
        }
    }
    #CInput {
        .el-dialog {
            width: 586px !important;
            margin-left: -693px;
        }
        .multipleSelectA {
            border: none;
            width: 159px;
            height: 336px;
            overflow: hidden;
        }
        .multipleSelectA:focus {
            border: none;
        }
        .multipleSelectA option {
            height: 26px;
            line-height: 26px;
            cursor: pointer;
            padding: 6px 0 6px 10px;
        }
        .multipleSelectB {
            border: none;
            width: 121px;
            height: 336px;
            overflow: hidden;
        }
        .multipleSelectB:focus {
            border: none;
        }
        .multipleSelectB option {
            height: 26px;
            line-height: 26px;
            cursor: pointer;
            padding: 6px 0 6px 10px;
        }
        .multipleSelectC {
            border: none;
            width: 118px;
            height: 336px;
            overflow: hidden;
        }
        .multipleSelectC:focus {
            border: none;
        }
        .multipleSelectC option {
            height: 26px;
            line-height: 26px;
            cursor: pointer;
            padding: 6px 0 6px 10px;
        }
        .multipleSelectD {
            border: none;
            width: 122px;
            height: 336px;
        }
        .multipleSelectD:focus {
            border: none;
        }
        .multipleSelectD option {
            height: 26px;
            line-height: 26px;
            cursor: pointer;
            padding: 6px 0 6px 10px;
        }
        .editBtnS,
        .editBtnC {
            width: 111px;
            height: 36px;
            border: none;
            padding: 0;
            cursor: pointer;
            border-radius: 2px;
        }
        .editBtnS {
            background: #fc3439;
            margin-right: 20px;
            color: #fff;
            font-size: 14px;
            font-weight: normal;
        }
        .editBtnS:hover {
            background: #ff5257;
        }
        .editBtnC {
            color: #666;
            background: #fff;
            border: 1px solid #ccc;
        }
        .editBtnC:hover {
            background: #e6e6e6;
            color: #666;
        }
        .el-dialog__footer {
            margin: 30px auto 39px;
        }
        .el-dialog__title {
            color: #fc3439;
            font-size: 18px;
            line-height: 18px;
            font-weight: bold;
            font-family: 'MicrosoftYaHei';
            display: inline-block;
            margin: 34px 0 15px 30px;
        }
        .el-dialog__header {
            height: 67px;
            padding: 0;
            border-bottom: 2px solid #e6e6e6;
            text-align: left;
        }
        .InputBody {
            width: 525px;
            margin: 0 30px 0 30px;
            border: 1px solid #ccc;
            height: 380px;
        }
        .InputBodyLeft {
            width: 160px;
            height: 380px;
            border-right: 1px solid #ccc;
            float: left;
        }
        .InputBodyMiddle {
            width: 122px;
            height: 380px;
            border-right: 1px solid #ccc;
            float: left;
        }
        .InputBodyRight {
            width: 119px;
            height: 380px;
            border-right: 1px solid #ccc;
            float: left;
        }
        .InputBodyLast {
            height: 380px;
            width: 122px;
            float: left;
        }
        .InputBodyTitle {
            height: 42px;
            background: #f2f2f2;
            line-height: 42px;
            text-align: left;
        }
        .InputBodyTitle span {
            display: inline-block;
            margin-left: 10px;
            color: #333;
            font-size: 12px;
        }
    }
}
</style>


