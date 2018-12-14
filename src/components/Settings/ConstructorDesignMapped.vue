<template>
  <div class="wrapper" id="ShejiGoujian">
    <h4 class="title"><span>设计构件分类映射</span></h4>
    <div class="manageWorktool">
        <span class="worktooltitle">分类映射</span>
        <button class="btn" @click="addYingshe"><i class="el-icon-plus"></i>添加</button>
        <div class="worktable">
            <div style="padding:0;box-sizing: border-box;">
                <table class="UserList" border="1" width='100%'>
                    <thead>
                        <tr  class="userList-thead">
                            <th width="10%">序号</th>
                            <th width="12%">Revit族类别</th>
                            <th width="12%">Revit族类别</th>
                            <th width="10%;">关键字类型</th>
                            <th width="10%">关键字</th>
                            <th width="12%;">T31编码</th>
                            <th width="12%">T31标题</th>
                            <th width="10%">来源</th>
                            <th width="12%">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in constructorData" :key="index">
                            <td v-text="index"></td>
                            <td v-text="item.revitCategory"></td>
                            <td v-text="item.chsCategory"></td>
                            <td v-text="item.name"></td>
                            <td v-text="item.keyWord"></td>
                            <td v-text="item.genieClassCode"></td>
                            <td v-text="item.genieClassName"></td>
                            <td v-text="item.criterion == '0' ? '企业标准':'工程标准'"></td>
                            <td>
                                <span v-if="item.criterion!=0"
                                    class="editIcon" @click="editUser(index)"></span>
                                <span v-if="item.criterion!=0"
                                class="deleteIcon" @click="deleteUser(index)"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 分页 -->
            <div class="datagrid-pager pagination">
               <table cellspacing="0" cellpadding="0" border="0">
                   <tbody>
                       <tr>
                           <td>
                               <select class="pagination-page-list" @change="pagePerNumChange" v-model="pageDetial.pagePerNum">
                               <option value="10">10</option>
                               <option value="20">20</option>
                               <option value="30">30</option>
                               <option value="40">40</option>
                               <option value="50">50</option>
                               </select>
                            </td>
                            <td>
                                  <div class="pagination-btn-separator"></div>
                            </td>
                            <td>
                                <a href="javascript:void(0)" class="btn-left0 btn-TAB" @click="changePage(0)"></a>
                            </td>
                            <td>
                                <a href="javascript:void(0)" class="btn-left1 btn-TAB" @click="changePage(-1)"></a>
                            </td>
                            <td>
                                  <div class="pagination-btn-separator"></div>
                            </td>
                            <td>
                                 <span  class="pagination-title" style="padding-left:5px;">第</span>
                            </td>
                            <td>
                                  <input class="pagination-num" type="text" v-model="pageDetial.currentPage">
                            </td>
                            <td>
                                 <span  class="pagination-title" style="padding-right:5px;">共{{Math.ceil(this.pageDetial.total/this.pageDetial.pagePerNum)}}页</span>
                            </td>
                            <td>
                                 <div class="pagination-btn-separator"></div>
                            </td>
                             <td>
                                <a href="javascript:void(0)" class="btn-right1 btn-TAB" @click="changePage(1)"></a>
                            </td>
                            <td>
                                <a href="javascript:void(0)" class="btn-right0 btn-TAB"  @click="changePage(2)"></a>
                            </td>
                            <td>
                                  <div class="pagination-btn-separator"></div>
                            </td>
                            <td>
                                 <a href="javascript:void(0)" @click="getInfo" class="btn-refresh btn-TAB"></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination-info pagination-title" v-text="'显示1到'+pageDetial.pagePerNum+',共'+pageDetial.total+'记录'"></div>
                <div style="clear:both;"></div>
            </div>
        </div>
    </div>
    <!--编辑弹窗-->
    <div id="edit">
        <el-dialog title="修改映射" :visible.sync="editListShow" :before-close="listClose">
            <div class="editBody">
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">Revit族类别 :</label>
                    <select  @change="revitChange" class="editSelect" disabled v-model="revitCategory">
                        <option >{{revitCategory}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">关键字类型 :</label>
                    <select class="editSelect" v-model="keyTypeVal">
                        <option v-for="(item,index) in keyTypeData" :key="index">{{item.name}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">包含关键字 :</label><input class="editSelect" placeholder="请输入" v-model="keyWord"/></div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">映射类型 :</label><label class="classifyYingshe">分类映射</label></div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">设计专业 :</label>
                    <select @change="designChange" v-model="designValue" class="editSelect">
                        <option v-for="(item,index) in geniceClassJson" :key="index">{{item.title}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">逻辑系统 :</label>
                    <select @change="logicSystemChange"  v-model="logicSystemValue" class="editSelect">
                        <option v-for="(item,index) in logicSystenData" :key="index">{{item.title}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">构件类别 :</label>
                    <select class="editSelect" v-model="goujianType" @change="goujianTypeChange">
                        <option v-for="(item,index) in categoryData" :key="index">{{item.title}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">类型编码 :</label><input class="editSelect" v-model="categoryBase" disabled/></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="editListSure">确定</button>
                <button class="editBtnC" @click="listClose">取消</button>
            </div>
        </el-dialog>
        <el-dialog title="添加映射" :visible.sync="addListShow" :before-close="addlistClose">
            <div class="editBody">
                <div class="editBodyone edit-item clearfix"><label class="editInpText">Revit族类别 :</label>
                    <select v-model="revitCategory" @change="revitChange" class="editSelect">
                        <option v-for="(item,index) in retiveData" :key="index">{{item.revitName}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo editBodyone edit-item clearfix"><label class="editInpText">关键字类型 :</label>
                    <select class="editSelect"  v-model="keyTypeVal">
                        <option v-for="(item,index) in keyTypeData" :key="index" >{{item.name}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">包含关键字 :</label><input class="editSelect" placeholder="请输入" v-model="keyWord"/></div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">映射类型 :</label><label class="classifyYingshe">分类映射</label></div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">设计专业 :</label>
                    <select @change="designChange" v-model="designValue" class="editSelect">
                        <option v-for="(item,index) in geniceClassJson" :key="index">{{item.title}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">逻辑系统 :</label>
                    <select @change="logicSystemChange"  v-model="logicSystemValue" class="editSelect">
                        <option v-for="(item,index) in logicSystenData" :key="index">{{item.title}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">构件类别 :</label>
                    <select class="editSelect" v-model="goujianType" @change="goujianTypeChange">
                        <option v-for="(item,index) in categoryData" :key="index">{{item.title}}</option>
                    </select>
                    <i class="icon-sanjiao"></i>
                </div>
                <div class="editBodytwo edit-item clearfix"><label class="editInpText">类型编码 :</label><input class="editSelect" placeholder="" v-model="categoryBase" disabled/></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <button class="editBtnS" @click="addListSure">确定</button>
                <button class="editBtnC" @click="addlistClose">取消</button>
            </div>
        </el-dialog>
    </div>
    <!-- 删除确定按钮 -->
    <div id="inital">
            <el-dialog  :visible.sync="deleteDialog" width="398px" :before-close="deletelistClose">
                <div class="deleteDialogImg"><img src="../../assets/warning.png"/></div>
                <p class="deleteDialogWarning">删除提醒</p>
                <p class="deleteDialogText">你确定删除本条分类映射?</p>
                <div slot="footer" class="dialog-footer">
                    <button class="deleteBtn" @click="deleteMakeSure">删除</button>
                    <button class="cancelBtn" @click="deletelistClose">取消</button>
                </div>
            </el-dialog>
        </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
    name:'ConstructorDesignMapped',
    data(){
        return {
            token:'',
            projId:'',
            BDMSUrl:'',
            constructorData:[],
            retiveData:[],//retive族值
            keyTypeData:[],//关键字类型
            geniceClassJson:[],
            logicSystenData:[],//逻辑系统
            categoryData:[],//构件类型
            pageDetial:{
              pagePerNum:20,//一页几份数据
              currentPage:1,//初始查询页数 第一页
              total:'',//所有数据
          },
          editListShow:false,
          addListShow:false,
          revitCategory:'',//retive族类别
          chsCategory:'',
          keyType:'',
          keyWord:'',
          genieClassCode:'',
          designValue:'',
          criterion:'',
          genieClassName:'',
          logicSystemValue:'',
          categoryBase:'',//类型编码
          keyTypeVal:'',
          goujianType:'',//构件类别
          editUserNum:'',
          deleteNum:'',
          oldFamilyNameKeyWord:'',//旧关键字值
          deleteDialog:false,//删除确定按钮
          totalConstructorData:[],//总的信息

        }
    },
    created(){
        var vm = this
        this.token = localStorage.getItem('token');
        this.projId = localStorage.getItem('projId');
        vm.BDMSUrl = vm.$store.state.BDMSUrl+'project2/'
        this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum);
        this.getGeniceClassMapJson();
        this.getGeniceClassJson();
        this.firstGetGeniceClassMapItem();
    },
    watch:{
        'pageDetial.currentPage':function(newVal,oldVal){//不能使用箭头函数
            this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum);
        }
    },
    methods:{
        //第一次加载获取总的数据量
        firstGetGeniceClassMapItem(){
            axios({
                method:'post',
                url:this.BDMSUrl+'Config/getGenieClassMapItem',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    page:1,
                    rows:20
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.pageDetial.total = response.data.rt.total;
                }else{
                    alert(response.data.msg)
                }
            }).then(()=>{
                this.getTotalGeniceClassMapItem();
            })
        },
        //获取分类映射信息
        getGeniceClassMapItem(index,num){
            axios({
                method:'post',
                url:this.BDMSUrl+'Config/getGenieClassMapItem',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    page:index,
                    rows:num
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.constructorData = response.data.rt.rows;
                    this.pageDetial.total = response.data.rt.total;
                    this.constructorData.forEach((item,index,arr)=>{
                        if(item.keyType=='0'){
                            arr[index].name = '族名称';
                        }else if(item.keyType == '1'){
                            arr[index].name = '类型名称';
                        }else if(item.keyType == '2'){
                            arr[index].name = '系统名称';
                        }
                    })
                }else {
                    alert(response.data.msg)
                }
            })
        },
        //获取总的分类映射信息
        getTotalGeniceClassMapItem(){
            axios({
                method:'post',
                url:this.BDMSUrl+'Config/getGenieClassMapItem',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId,
                    page:1,
                    rows:this.pageDetial.total
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.totalConstructorData = response.data.rt.rows;
                    console.log(this.totalConstructorData)
                }else{
                    alert(response.data.msg);
                }
            })
        },
        //获取设计构件分类
        getGeniceClassJson(){
            axios({
                method:'post',
                url:this.BDMSUrl+'Config/getGenieClassJson',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == 0){
                    this.geniceClassJson = response.data.rt;
                }else {
                    alert(response.data.msg)
                }
            })
        },
        //获取revit族类别
        getGeniceClassMapJson(){
            axios({
                method:'post',
                url:this.BDMSUrl+'Config/getGenieClassMapJson',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.retiveData = response.data.rt;
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //刷新表格
        getInfo(){
            this.pageDetial.currentPage = 1;
            this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum);
        },
        //表格页码改变时
        changePage(val){
            if(val == 1){
                if(this.pageDetial.currentPage<this.pageDetial.total/this.pageDetial.pagePerNum){
                    this.pageDetial.currentPage= Math.floor(this.pageDetial.currentPage)+1;
                    this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum)
                }else{
                    alert('已经是最后一页');
                }
            }else if(val == -1){
                if(this.pageDetial.currentPage>1){
                    this.pageDetial.currentPage= Math.floor(this.pageDetial.currentPage)-1;
                    this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum)
                }else{
                    alert('已经是第一页');
                }
            }else if (val == '2'){
                this.pageDetial.currentPage = Math.ceil(this.pageDetial.total/this.pageDetial.pagePerNum);
                this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum);
            }else if(val == '0'){
                this.getInfo();
            }
        },
        //页码改变
        pagePerNumChange(){
            this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum);
        },
        //编辑功能
        editUser(num){
            this.editUserNum = num;
            var number = ''
            this.oldFamilyNameKeyWord = this.constructorData[num].keyWord;//获取旧关键字值
            this.revitCategory = this.constructorData[num].chsCategory;//Revit族类别
            //先获取Revit族类别，在获取关键字类型集合
            this.retiveData.forEach((item,index,arr)=>{
                if(item.revitName == this.revitCategory){
                    number = index;
                }
            })
            this.getKeyTypeData(this.retiveData[number].revitCategory);

            this.keyTypeVal = this.constructorData[num].keyType;//关键字类型

            if( this.constructorData[num].keyType== '0'){
                this.keyTypeVal = '族名称';
            }else if(this.constructorData[num].keyType == '1'){
                this.keyTypeVal ='类型名称';
            }else if(this.constructorData[num].keyType == '2'){
                this.keyTypeVal='系统名称';
            }
            this.categoryBase = this.constructorData[num].genieClassCode//类型编码
            this.geniceClassJson.forEach((item,index,arr)=>{

                if(item.number.split('')[0] == this.categoryBase.split('')[0] && item.number.split('')[1] == this.categoryBase.split('')[1]){
                    this.designValue = item.title;//设计专业
                    this.logicSystenData = this.geniceClassJson[index].children;
                }
            });
            this.logicSystenData.forEach((item,index)=>{
                if(item.number.split('')[0] == this.categoryBase.split('')[0] && item.number.split('')[1] == this.categoryBase.split('')[1]&& item.number.split('')[2] == this.categoryBase.split('')[2]){
                    this.logicSystemValue = item.title;//逻辑系统
                    this.categoryData = this.logicSystenData[index].children;
                }
            })
            this.keyWord = this.constructorData[num].keyWord;//包含关键字
            this.goujianType = this.constructorData[num].genieClassName;//构件类别
            this.editListShow = true;
        },
        //编辑确定
        editListSure(){
            var keyTypeName = 0;
            if( this.keyTypeVal == '族名称'){
                keyTypeName = 0;
            }else if(this.keyTypeVal == '类型名称'){
                keyTypeName = 1;
            }else if(this.keyTypeVal == '系统名称'){
                keyTypeName = 2;
            }
            if(this.keyTypeVal == ''){
                alert('关键字类型不能为空!');
            }else{
                if(this.keyWord == ''){
                    alert('包含关键字不能为空!');
                }else{
                    if(this.designValue == ''){
                        alert('至少选择设计专业!')
                    }else{
                        //编辑时，不对自己做检验
                        var totalObject = this.totalConstructorData;
                        //var numIndex = this.pageDetial.pagePerNum*(this.pageDetial.currentPage-1)+this.editUserNum;
                        totalObject.forEach((item,index)=>{
                            if(item.pkId == this.constructorData[this.editUserNum].pkId){
                                totalObject.splice(index,1);
                            }
                        })
                        // var keyword = totalObject.some(item=>{
                        //     if(item.keyWord == this.keyWord || item.keyWord.includes(this.keyWord) || this.keyWord.includes(item.keyWord)){
                        //         return true;
                        //     }else{
                        //         return false;
                        //     }
                        // })
                        // if(keyword){
                        //     alert('关键字已存在或关键字与已存在关键字有包含关系，不能添加！');
                        // }else{
                            axios({
                                method:'post',
                                url:this.BDMSUrl+'Config/updateGenieClassMap',
                                headers:{
                                    token:this.token
                                },
                                params:{
                                    projId:this.projId
                                },
                                data:{
                                    familyNameKeyWord:this.keyWord,
                                    familyTypeKeyWord:keyTypeName,
                                    genieClassCode:this.categoryBase,
                                    id:this.constructorData[this.editUserNum].pkId,
                                    oldFamilyNameKeyWord:this.oldFamilyNameKeyWord,
                                    revitCategory:this.constructorData[this.editUserNum].revitCategory,
                                    revitName:this.revitCategory
                                }
                            }).then(response=>{
                                if(response.data.cd=='0'){
                                    this.editListShow = false;
                                    this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum);
                                    this.revitCategory = '';
                                    this.keyTypeVal = '';
                                    this.keyWord = '';
                                    this.designValue = '';
                                    this.oldFamilyNameKeyWord = '';
                                    this.logicSystemValue = '';
                                    this.goujianType = '';
                                    this.categoryBase = '';
                                    this.editListShow = false;
                                }else {
                                    alert(response.data.msg);
                                }
                            })
                        //}
                    }
                }
            }
        },
        listClose(){
            this.editListShow = false;
            this.revitCategory = '';
            this.keyTypeVal = '';
            this.keyWord = '';
            this.designValue = '';
            this.oldFamilyNameKeyWord = '';
            this.logicSystemValue = '';
            this.goujianType = '';
            this.categoryBase = '';
        },
        //添加
        addYingshe(){
            this.addListShow = true;
        },
        addListSure(){
           //Revit族类别 revitCategory 关键字类型 keyTypeVal 关键字 keyword
            if(this.revitCategory == ''){
                alert('请选择Revit族类别！');
            }else{
                if(this.keyTypeVal == ''){
                    alert('请选择关键字类型！');
                }else{
                    if(this.keyWord == ''){
                        alert('请输入关键字！');
                    }else{
                        if(this.designValue == ''){
                            alert('请至少选择设计专业！');
                        }else{
                            var value = '';
                            if(this.keyTypeVal == '族名称'){
                                value = 0;
                            }else if(this.keyTypeVal == '类型名称'){
                                value = 1;
                            }else if(this.keyTypeVal == '系统名称'){
                                value = 2;
                            }
                            //需要添加映射toDoList
                            var revitCa =''
                            if(this.revitCategory == '安全设备'){
                                revitCa = "SecurityDevices";
                            }else if(this.revitCategory == '常规模型'){
                                revitCa = "GenericModel";
                            }
                            else if(this.revitCategory == '场地构件'){
                                revitCa = "Site";
                            }else if(this.revitCategory == '厨柜'){
                                revitCa = "Casework";
                            }else if(this.revitCategory == '窗'){
                                revitCa = "Windows";
                            }else if(this.revitCategory == '道路'){
                                revitCa = "Roads";
                            }else if(this.revitCategory == '灯具装饰'){
                                revitCa = "LightingFixtures";
                            }else if(this.revitCategory == '地形'){
                                revitCa = "Topography";
                            }else if(this.revitCategory == '电气设备'){
                                revitCa = "ElectricalEquipment";
                            }else if(this.revitCategory == '电缆桥架'){
                                revitCa = "CableTray";
                            }else if(this.revitCategory == '电话设备'){
                                revitCa = "TelephoneDevices";
                            }else if(this.revitCategory == '电话设备'){
                                revitCa = "TelephoneDevices";
                            }else if(this.revitCategory == '电气装置'){
                                revitCa = "ElectricalFixtures";
                            }else if(this.revitCategory == '电缆桥架配件'){
                                revitCa = "CableTrayFitting";
                            }else if(this.revitCategory == '叠层墙'){
                                revitCa = "StackedWalls";
                            }else if(this.revitCategory == '风管管件'){
                                revitCa = "DuctFitting";
                            }else if(this.revitCategory == '封檐带'){
                                revitCa = "Fascia";
                            }else if(this.revitCategory == '风管附件'){
                                revitCa = "DuctAccessory";
                            }else if(this.revitCategory == '风管'){
                                revitCa = "DuctCurves";
                            }else if(this.revitCategory == '管道'){
                                revitCa = "PipeCurves";
                            }else if(this.revitCategory == '管件'){
                                revitCa = "PipeFitting";
                            }else if(this.revitCategory == '管路附件'){
                                revitCa = "PipeAccessory";
                            }else if(this.revitCategory == '护理呼叫设备'){
                                revitCa = "NurseCallDevices";
                            }else if(this.revitCategory == '环境元素'){
                                revitCa = "Entourage";
                            }else if(this.revitCategory == '火警设备'){
                                revitCa = "FireAlarmDevices";
                            }else if(this.revitCategory == '机械设备'){
                                revitCa = "MechanicalEquipment";
                            }else if(this.revitCategory == '家具'){
                                revitCa = "Furniture";
                            }else if(this.revitCategory == '建筑柱'){
                                revitCa = "Columns";
                            }else if(this.revitCategory == '建筑地坪'){
                                revitCa = "BuildingPad";
                            }else if(this.revitCategory == '结构加强版'){
                                revitCa = "StructuralFraming";
                            }else if(this.revitCategory == '结构框架'){
                                revitCa = "StructuralFraming";
                            }else if(this.revitCategory == '结构连接'){
                                revitCa = "StructConnections";
                            }else if(this.revitCategory == '结构柱'){
                                revitCa = "StructuralColumns";
                            }else if(this.revitCategory == '结构基础'){
                                revitCa = "StructuralFoundation";
                            }else if(this.revitCategory == '栏杆'){
                                revitCa = "StairsRailing";
                            }else if(this.revitCategory == '楼板'){
                                revitCa = "Floors";
                            }else if(this.revitCategory == '楼梯'){
                                revitCa = "Stairs";
                            }else if(this.revitCategory == '门'){
                                revitCa = "Doors";
                            }else if(this.revitCategory == '幕墙竖梃'){
                                revitCa = "CurtainWallMullions";
                            }else if(this.revitCategory == '幕墙嵌板'){
                                revitCa = "CurtainWallPanels";
                            }else if(this.revitCategory == '喷头'){
                                revitCa = "CurtainWallPanels";
                            }else if(this.revitCategory == '坡道'){
                                revitCa = "Ramps";
                            }else if(this.revitCategory == '幕墙嵌板'){
                                revitCa = "CurtainWallPanels";
                            }else if(this.revitCategory == '喷头'){
                                revitCa = "Sprinklers	";
                            }else if(this.revitCategory == '墙'){
                                revitCa = "Walls";
                            }else if(this.revitCategory == '墙饰条'){
                                revitCa = "Cornices";
                            }else if(this.revitCategory == '软管'){
                                revitCa = "FlexPipeCurves";
                            }else if(this.revitCategory == '软风管'){
                                revitCa = "FlexDuctCurves";
                            }else if(this.revitCategory == '数据设备'){
                                revitCa = "DataDevices";
                            }else if(this.revitCategory == '体量'){
                                revitCa = "Mass";
                            }else if(this.revitCategory == '天花板'){
                                revitCa = "Ceilings";
                            }else if(this.revitCategory == '停车场'){
                                revitCa = "Parking";
                            }else if(this.revitCategory == '卫浴装置'){
                                revitCa = "PlumbingFixtures";
                            }else if(this.revitCategory == '通迅设备'){
                                revitCa = "CommunicationDevices";
                            }else if(this.revitCategory == '屋檐底板'){
                                revitCa = "RoofSoffit";
                            }else if(this.revitCategory == '屋面'){
                                revitCa = "Roofs";
                            }else if(this.revitCategory == '线管'){
                                revitCa = "Conduit";
                            }else if(this.revitCategory == '线管配件'){
                                revitCa = "ConduitFitting";
                            }else if(this.revitCategory == '檐沟'){
                                revitCa = "Gutter";
                            }else if(this.revitCategory == '照明设备'){
                                revitCa = "LightingDevices";
                            }else if(this.revitCategory == '专用设备'){
                                revitCa = "SpecialityEquipment";
                            }else if(this.revitCategory == '植物'){
                                revitCa = "Planting";
                            }else if(this.revitCategory == '风道末端'){
                                revitCa = "DuctTerminal";
                            }else if(this.revitCategory == '楼板边缘'){
                                revitCa = "EdgeSlab";
                            }else if(this.revitCategory == '灯具装置'){
                                revitCa = "LightingFixtures";
                            }else if(this.revitCategory == '喷头'){
                                revitCa = "Sprinklers";
                            }else if(this.revitCategory == '结构加强版'){
                                revitCa = "StructuralStiffener";
                            }else if(this.revitCategory == 'MEP预置管道'){
                                revitCa = "FabricationPipework";
                            }
                            // var keyword = this.totalConstructorData.some(item=>{
                            //     if(item.keyWord == this.keyWord || item.keyWord.includes(this.keyWord) || this.keyWord.includes(item.keyWord)){
                            //         return true;
                            //     }else{
                            //         return false;
                            //     }
                            // })
                            // if(keyword){
                            //     alert('关键字已存在或关键字与已存在关键字有包含关系，不能添加！')
                            // }else{
                                axios({
                                    method:'post',
                                    url:this.BDMSUrl+'Config/addGenieClassMap',
                                    headers:{
                                        token:this.token
                                    },
                                    params:{
                                        projId:this.projId
                                    },
                                    data:{
                                        familyNameKeyWord:this.keyWord,
                                        familyTypeKeyWord:value,
                                        genieClassCode:this.categoryBase,
                                        revitCategory:revitCa,
                                        revitName:this.revitCategory
                                    }
                                }).then(response=>{
                                    if(response.data.cd == '0'){
                                        this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum);
                                        this.firstGetGeniceClassMapItem();
                                        this.keyWord='';
                                        this.categoryBase ='';
                                        this.revitCategory ='';
                                        this.keyTypeVal ='';
                                        this.revitCategory = '';
                                        this.designValue = '';
                                        this.logicSystemValue = '';
                                        this.goujianType = '';
                                        this.addListShow = false;
                                    }else {
                                        alert(response.data.msg)
                                    }
                                })
                            //}
                        }
                    }
                }
            }




        },
        addlistClose(){
            this.keyWord='';
            this.categoryBase ='';
            this.revitCategory ='';
            this.keyTypeVal ='';
            this.revitCategory = '';
            this.designValue = '';
            this.logicSystemValue = '';
            this.goujianType = '';
            this.addListShow = false;

        },
        //删除
        deleteUser(num){
            this.deleteNum = num;
            this.deleteDialog = true;
        },
        //删除确定按钮
        deleteMakeSure(){
            axios({
                method:'post',
                url:this.BDMSUrl+'Config/deleteGenieClassMap',
                headers:{
                    token:this.token
                },
                params:{
                    projId:this.projId
                },
                data:{
                    id:this.constructorData[this.deleteNum].pkId
                }
            }).then(response=>{
                if(response.data.cd == '0'){
                    this.getGeniceClassMapItem(this.pageDetial.currentPage,this.pageDetial.pagePerNum);
                    this.firstGetGeniceClassMapItem();
                    this.deleteDialog = false;
                }else{
                    alert(response.data.msg)
                }
            })
        },
        //删除按钮取消
        deletelistClose(){
            this.deleteDialog = false;
            this.keyWord='';
            this.categoryBase ='';
            this.revitCategory ='';
            this.keyTypeVal ='';
            this.revitCategory = '';
            this.designValue = '';
        },
        //retive族改变
        revitChange(){
            var number = ''
            this.retiveData.forEach((item,index,arr)=>{
                if(item.revitName == this.revitCategory){
                    number = index;
                }
            })
           this.getKeyTypeData(this.retiveData[number].revitCategory);
        },
        //根据族 获取关键词类型
        getKeyTypeData(rev,id){
            this.keyTypeData = [];
            axios({
                method:'post',
                url:this.BDMSUrl+'Config/getKeyWordsTypeByRevitCategory',
                headers:{
                    token:this.token
                },
                params:{
                    revitCategory:rev,
                }
            }).then((response)=>{
                var obj = response.data.rt;
                for(let item of Object.values(obj)){
                    this.keyTypeData.push({
                       name:item
                    });
                }
            })
        },
        //设计专业改变
        designChange(){
            this.geniceClassJson.forEach((item,index,arr)=>{
                if(item.title == this.designValue){
                    this.categoryBase = item.number;
                    this.logicSystenData = this.geniceClassJson[index].children;
                    this.categoryData = [];
                }
            })
        },
        //逻辑系统改变
        logicSystemChange(){
            this.logicSystenData.forEach((item,index)=>{
                if(item.title == this.logicSystemValue){
                    this.categoryBase = item.number;
                    this.categoryData = this.logicSystenData[index].children;
                }
            })
        },
        //构件类别改变
        goujianTypeChange(){
            this.categoryData.forEach(item=>{
                if(item.title == this.goujianType){
                    this.categoryBase = item.number;
                }
            })
        }
    }
}
</script>
<style scoped>
   .wrapper{
        width: 100%;
    }
    .title{
        border-bottom:1px solid #ccc;
        margin: 0 ;
        text-align: left;
    }
    .title span{
        display: inline-block;
        margin-left: 15px;
        color: #fc343a;
        font-size: 18px;
        line-height: 18px;
        font-weight: bold;
        margin: 22px 0 12px 15px;
    }
    .manageWorktool{
        margin: 0 20px 0 15px;
        text-align: left;
    }
    .worktooltitle{
        color:#fc3439;
        display: inline-block;
        width: 50%;
        text-align: left;
        font-size: 16px;
        line-height: 16px;
        font-weight: bold;
        margin: 0;
        text-align: left;
        margin: 30px 0 20px;
    }
    .btn{
        width: 96px;
        height: 32px;
        border: none;
        border-radius: 2px;
        float: right;
        margin: 22px 0 12px 0;
        cursor: pointer;
        background: #fc3439;
        color: #fff;
        font-size: 14px;
        font-weight: normal;
    }
    .btn:hover{
        background: #ff5257
    }
    .btn i{
        margin-right: 10px;
    }
    #edit .editBody{
        margin: 0 30px;
        overflow: hidden;
    }
    #edit .editInpText{
        width: 100px;
        line-height: 40px;
    }
    #edit .editSelect{
        width: 435px;
        padding: 0 0 0 10px;
        box-sizing: content-box;
    }
    #edit .inp{
        height: 38px;
        border: 1px solid #ccc;
        box-sizing: content-box;
        width: 435px;
        padding-left: 10px;
    }
    #edit .classifyYingshe{
        width: 447px;
        text-align: left;
        float: left;
        height: 40px;
        line-height: 40px;
    }
    /*删除弹框*/
    .deleteDialogImg{
        height: 50px;
    }
    .deleteDialogWarning{
        font-size: 18px;
        line-height: 18px;
        font-family: 'MicrosoftYahei';
        color: #fc3439;
        font-weight: bold;
        margin:20px 0 0 0;
    }
    .deleteDialogText{
        color: #333333;
        font-size: 14px;
        line-height: 14px;
        font-family: 'MicrosoftYahei';
        font-weight: normal;
        margin: 16px 0 0 0;
    }
</style>
<style  lang='less'>
#ShejiGoujian{
    width: 100%;
    display: block;
    height: 800px;
    overflow-y: auto;
    overflow-x: hidden;
    *{
        box-sizing: border-box;

    }
    .edit-item{
            position: relative;
            .editSelect{
                float: left;
                width: 435px;
                height: 38px;
                // padding: 10px;
            }
            .editInpText{
                width: 100px;
                text-align: right;
                float: left;
                height: 40px;
                line-height: 40px;
            }
            .editInpTextInp{
                line-height: 40px;
                color: #333;
                float: left;
                font-size: 14px;
                font-weight: normal;
            }
            .edit-item-biaoti{
                display: block;
                font-size: 12px;
                color: #999999;
                float: left;
                line-height: 12px;
                margin-left: 120px;
                margin-top: 5px;
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        .displayColor{
            display: block;
            width: 30px;
            height: 30px;
            border: 1px solid #ccc;
            overflow: hidden;
            float: left;
            margin-left: 120px;
            margin-top: 5px;
        }

    }
    .el-button{
        width: 112px;
        height: 36px;
        line-height: 36px;
        padding: 0;
    }
        /***********设置滚动条************/
            /* 设置滚动条的样式 */
            ::-webkit-scrollbar {
            width:7px;
            }
            /* 滚动槽 */
            ::-webkit-scrollbar-track {
            box-shadow:inset 006px rgba(0, 0, 0, .5);
            -webkit-box-shadow:inset 006px rgba(0,0,0,0.3);
            border-radius:10px;
            }
            /* 滚动条滑块 */
            ::-webkit-scrollbar-thumb {
            border-radius:10px;
            background:rgba(0,0,0,0.1);
            box-shadow:inset 006px rgba(0, 0, 0, .5);
            -webkit-box-shadow:inset 006px rgba(0,0,0,0.5);
            }
            ::-webkit-scrollbar-thumb:window-inactive {
            background:rgba(255,0,0,0.4);
            }
            /*********************/
            .editIcon{
                float: left;
                width: 17px;
                height: 16px;
                background: url('../../assets/edit.png')no-repeat 0 0;
                cursor: pointer;
                margin-right: 20px;
            }
            .deleteIcon{
                float: left;
                width: 16px;
                height: 16px;
                background: url('../../assets/delete.png')no-repeat 0 0;
                cursor: pointer;
            }
            .UserList{
                border-collapse: collapse;
                border: 1px solid #e6e6e6;
                thead{
                    background: #f2f2f2;
                    th{
                        padding-left: 10px;
                        height: 36px;
                        text-align: left;
                        box-sizing: border-box;
                        border-right: 1px solid #e6e6e6;
                        font-size: 12px;
                        color: #333333;
                    }
                }
                tbody{
                    tr{
                        td{
                            padding-left: 10px;
                            height: 36px;
                            text-align: left;
                            box-sizing: border-box;
                            border-right: 1px solid #e6e6e6;
                            font-size: 12px;
                            color: #333333;
                        }
                        &:hover{
                            background: #fafafa;
                        }
                    }
                }
            }
            .pagination{
                width: 100%;
                text-align: right;
                margin-top: 10px;
                margin-right: 20px;
            }
            .el-pagination{
                padding:0;
                // margin-right: 20px;
            }
            .title-right{
                float: left;;
                width: 214px;
                height: 30px;
                margin-right: 10px;
                position: relative;
                 .title-right-icon{
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 15px;
                    border: 1px solid #e6e6e6;
                    position: relative;
                    background: #fafafa;
                    padding-left:10px;
                    padding-right:40px;
                    margin-right: 5px;
                    outline: none;
                }
                .el-icon-search{
                    position: absolute;
                    right: 10px;
                    top: 8px;
                }
            }
            .title-right-edit-icon{
                display: block;
                position: absolute;
                top: 7px;
                right: 8px;
                width: 16px;
                height: 16px;
                content: '';
                // background: url('./images/1-1.png')no-repeat 0 0;
                cursor: pointer;
                &::before{
                    color: #a5adb3;
                }
            }
            .manageWorktool .el-dialog{
                width: 586px;
                .el-dialog__header{
                    padding: 34px 0 17px 30px;
                    text-align: left;
                    border-bottom: 1px solid #cccccc;
                    .el-dialog__title{
                        font-size: 20px;
                    color: #fc3439;
                    line-height: 20px;
                    font-weight: bold;
                    }
                    .el-dialog__headerbtn{
                        top: 10px;
                        right: 10px;
                    }
                }
                .el-dialog__body{
                    padding: 22px 45px 20px;
                    .log-head{
                        margin-bottom: 7px;
                        .log-head-title{
                            width: 80px;
                            font-size: 14px;
                            color: #333333;
                            line-height: 14px;
                            font-weight: bold;
                            float: left;
                        }

                        .el-radio{
                            float: left;
                            span{
                                color: #666666;
                            }
                        }
                    }
                    .JobName{
                        display: block;
                        padding-left: 80px;
                        box-sizing: border-box;
                        input{
                           float: left;
                            width: 312px;
                            height: 32px;
                            padding: 0 10px;
                            box-sizing: border-box;
                            border-radius: 2px;
                            border:1px solid #e0e0e0;
                            background: #fafafa;
                        }
                        .btn{
                            float: left;
                            width: 95px;
                            text-align: center;
                            &::after{
                                display: none;
                            }
                        }
                    }
                    .log-body{
                        margin-top: 20px;
                        position: relative;
                        .log-head-position{
                            color: #333333;
                            font-weight: bold;
                        }
                        .position-all{
                            width: 408px;
                            height: 165px;
                            overflow-y: auto;
                            border: 1px solid #e0e0e0;
                            background: #fafafa;
                            margin-top: 4px;
                            .el-checkbox{
                                display: block;
                                margin:8px 10px;
                                .el-checkbox__label{
                                    color: #666666;
                                }
                            }
                        }
                        .log-head-title{
                            display: block;
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 80px;
                            font-size: 14px;
                            color: #333333;
                            line-height: 14px;
                            font-weight: bold;
                        }
                         .userInfo{
                            float: right;
                            width: 415px;
                            .image-user{
                                float: left;
                                width: 80px;
                                height: 80px;
                                background: url('./images/people.png')no-repeat 0 0 ;
                            }
                            .info-user{
                                float: left;
                                margin-left: 20px;
                                p{
                                    margin: 0;
                                    height: 30px;
                                    line-height: 30px;
                                    font-size: 14px;
                                    .name{
                                        color: #999999;
                                    }
                                    .detial{
                                        color: #333333;
                                        font-weight: bold;
                                    }
                                }
                            }
                        }
                        .el-tree{
                            float: left;
                            width: 414px;
                            height: 278px;
                            overflow: auto;
                            padding: 5px;
                            box-sizing: border-box;
                            border:1px solid #e0e0e0;
                        }
                    }
                    .el-dialog__footer{
                        padding: 0 0 20px;
                    }
                }

            }
            .clearfix{
                clear: both;
                overflow: hidden;
                content: '';
            }
            /**********一下是分页器的样式***************/
            .datagrid-pager {
                display: block;
                margin: 0 0 10px 0;
                height: 31px;
                width: auto;
                border:1px solid #d4d4d4;
                // padding: 3px 4px;
                box-sizing: border-box;
                background: #f5f5f5;
            }
            .pagination table {
                float: left;
                height: 30px;
                th, td {
                    min-width: 5px;
                    padding: 0px;
                    margin: 0px;
                }
            }
            .pagination-page-list {
                margin: 0px 6px;
                padding: 1px 2px;
                width: 43px;
                height: auto;
                border-width: 1px;
                border-style: solid;
            }
            .pagination .pagination-num {
                border-color: #D4D4D4;
                margin: 0 2px;
                width: 30px;
            }
            .pagination-btn-separator {
                float: left;
                height: 24px;
                border-left: 1px solid #ccc;
                border-right: 1px solid #fff;
                margin: 3px 1px;
            }
            .btn-TAB{
                display: block;
                width:26px;
                height: 26px;
                cursor: pointer;
                position: relative;
                &:hover{
                    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.5);
                    border-radius: 5px;
                }
                &::after{
                    display: block;
                    position: absolute;
                    content: '';
                    width: 10px;
                    height: 10px;
                    background-size: 100% 100%;
                    top: 8px;
                    left: 8px;
                }
            }
            .btn-left0::after{
                background-image: url('../../assets/fenye2.png');
            }
            .btn-left1::after{
                background-image: url('../../assets/fenye1.png');
            }
            .btn-right0::after{
                background-image: url('../../assets/fenye4.png');
            }
            .btn-right1::after{
                background-image: url('../../assets/fenye3.png');
            }
            .btn-refresh::after{
                background-image: url('../../assets/fenye5.png');
            }
            .pagination-title{
                font-size: 14px;
                color: #333333;
            }
            .pagination-info{
                margin-top: 5px;
            }

}
</style>
