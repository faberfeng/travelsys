<template>
<div class="box">
      <div id="panoramicView">

      </div>
      <div id="info_panoramicView">
         <p class="headTitle">点位位置</p>
          <div  id="planeDIV">
              <img :src="imgdetial.path" id="planeFigure">
              <span :class="['round']"   :style="{'top':imgdetial.y+'px','left':imgdetial.x+'px'}">
              </span>
          </div>
          <!-- <p class="headTitle">历史版本</p> -->
          <!-- <ul>
            <li :class="['item-version',{'active':item.checked}]" v-for="(item,index) in QJ.imageBackground" :key="index+'_version'" @click="change(index)">
              <p v-text="'版本'+(index+1)" class="title"></p>
               <p v-text="item.fileName" class="info"></p>
              <p v-text="initData(item.uploadTime)+'由'+item.uploadUserName+'上传'" class="info" style="margin-top:8px;"></p>
              <i class="icon-goujian icon-download" @click="downLoad(item.filePath)"></i>
            </li>
          </ul> -->
      </div>
</div>
</template>
 <style lang="less" scoped>
      *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
        /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
    width:15px;
     height: 15px;
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
      canvas {
          width: 100%;
          height: 100%;
      }
      .box{
          display: block;
      }
      #panoramicView{
        display: block;
           position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 380px;
          overflow: hidden;
      }
      #info_panoramicView{
        width: 380px;
        float: right;
        .headTitle{
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #cccccc;
          color: #333333;
          font-size: 16px;
          font-weight: bold;
          background: #f1f1f1;

        }
        #planeDIV{
          display: block;
          height: 400px;
          overflow: auto;
          position: relative;
             .round{
                display: block;
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                width: 24px;
                height: 32px;
                background: url('./images/site.png')no-repeat 0 0;
            }
            .active{
                background: url('./images/site1.png')no-repeat 0 0;
            }
        }
        >ul{
          display: block;
          position: fixed;
          top: 480px;
          right: 0;
          width: 380px;
          bottom: 0;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .item-version{
          display: block;
          padding: 20px 30px 20px 20px;
          position: relative;
          .title{
            font-size: 14px;
            line-height: 14px;
            color: #333333;
            font-weight: bold;
            text-align: left;
          }
          .info{
            font-size: 14px;
            line-height: 14px;
            color: #666666;
            font-weight: normal;
            margin-top:15px; 
            text-align: left;
          }
          .icon-goujian{
                display: block;
                width: 16px;
                height: 16px;
                position: absolute;
                right: 30px;
                top: 20px;
                cursor: pointer;
            }
            .icon-download{
                background: url('./images/download.png')no-repeat 0 0;
                &:hover{
                    background: url('./images/download1.png')no-repeat 0 0;
                }
            }
            &:hover{
              background: #f6f6f6;
            }
        }
        .active{
              background: #f6f6f6;
        }
      }
  </style>
<script>
var THREE = require('three');
import axios from 'axios';
import '../../utils/init-axios.js';
import './js/jquery-1.8.3.js'
import './js/date.js'
var source= '';
var camera, scene, renderer;
var isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;
export default {
    data(){
      return {
          projId:'',
          fgId:'',//全景文件ID
          QJFileManageSystemURL:'',
          QJ:{
              imageBackground:{},
              point:[]
          },
          imgdetial:{
            path:'',
            x:'',
            y:''
          },
          BDMSUrl:'',
      }
    },
    created(){
      var vm = this
      vm.projId = localStorage.getItem('projId');
      vm.QJFileManageSystemURL = vm.$store.state.QJFileManageSystemURL
      vm.BDMSUrl = vm.$store.state.BDMSUrl;
      vm.fgId = vm.$route.params.id
      var obj = JSON.parse(sessionStorage.getItem('qjInfo'))
      vm.imgdetial.path = obj.image
      vm.imgdetial.x = obj.x
      vm.imgdetial.y = obj.y
      console.log(vm.imgdetial.path,'vm.imgdetial.path');
     
      vm.getImg()
      // vm.init(source);
    },
    methods:{
      change(val){
        var vm = this
        vm.QJ.imageBackground.forEach((item,key)=>{
          if(key == val){
            vm.$set(item,'checked',true)
            source = vm.QJFileManageSystemURL+item.filePath
            vm.init(source);
          }else{
            vm.$set(item,'checked',false)
          }
        })
      },
        initData(val){
          if(!val)return ''
          var tt=new Date(val).Format('yyyy-MM-dd') 
          return tt; 
      },
       downLoad(filePath){
        //latestFile(fileId,fgId,"下载了文件"+fileName);
        var vm = this
        if(!filePath){
             vm.$message({
                type:'info',
                message:'请勾选要下载的文件'
            })
            return false
        }
        window.open(vm.QJFileManageSystemURL + filePath+'');
      },
      getImg(){
        var vm = this;
        console.log(vm.BDMSUrl+'doc/download/'+vm.fgId,'111111111');
        setTimeout(()=>{
            vm.init(vm.BDMSUrl+'doc/download/'+vm.fgId);
        },1000)
         
        //  axios({
        //     method:'POST',
        //     url:'project2/doc/getFileGroupVersionList',
        //     params:{
        //         fgId:vm.fgId,
        //     },
        // }).then((response)=>{
        //     if(response.data.cd == 0 && response.data.rt.length>0){
        //        vm.QJ.imageBackground = response.data.rt
        //         vm.QJ.imageBackground.forEach((item,key) => {
        //             if(key == 0){
        //                vm.$set(item,'checked',true)
        //             }else{
        //                 vm.$set(item,'checked',false)
        //             }
        //         });
        //         source = vm.QJFileManageSystemURL+response.data.rt[0].filePath
        //         console.log(source)
        //         vm.init(source);
        //     }
        // }).catch((err)=>{
        //     console.log(err)
        // })
      },
     init(source){
       var vm = this
        var container, mesh;

        container = document.getElementById( 'panoramicView' );

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );//相机
        camera.target = new THREE.Vector3( 0, 0, 0 );

        scene = new THREE.Scene();//场景

        var geometry = new THREE.SphereGeometry( 500, 60, 40 );//几何体
        geometry.scale( - 1, 1, 1 );

        var material = new THREE.MeshBasicMaterial( {
            map: new THREE.TextureLoader().load(source)
        } );//材质

        mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();//渲染器
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth-380,window.innerHeight-10);
        container.innerHTML = ''
        container.appendChild( renderer.domElement );
        renderer.setClearColor(0xFFFFFF, 1.0);
        document.addEventListener( 'mousedown', vm.onDocumentMouseDown, false );
        document.addEventListener( 'mousemove', vm.onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', vm.onDocumentMouseUp, false );
        document.addEventListener( 'wheel', vm.onDocumentMouseWheel, false );

        //

        document.addEventListener( 'dragover', function ( event ) {

            event.preventDefault();
            /** @namespace event.dataTransfer */
            event.dataTransfer.dropEffect = 'copy';

        }, false );

        document.addEventListener('dragenter', function () {
            document.body.style.opacity = 0.5;

        }, false );

        document.addEventListener( 'dragleave', function () {

            document.body.style.opacity = 1;

        }, false );

        document.addEventListener( 'drop', function ( event ) {

            event.preventDefault();

            var reader = new FileReader();
            reader.addEventListener( 'load', function ( event ) {

                material.map.image.src = event.target.result;
                material.map.needsUpdate = true;

            }, false );
            reader.readAsDataURL( event.dataTransfer.files[ 0 ] );

            document.body.style.opacity = 1;

        }, false );

        //

        window.addEventListener( 'resize', vm.onWindowResize, false );

        vm.animate();
    },

    onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth-380, window.innerHeight-10  );

    },

    onDocumentMouseDown( event ) {

        event.preventDefault();

        isUserInteracting = true;

        onMouseDownMouseX = event.clientX;
        onMouseDownMouseY = event.clientY;

        onMouseDownLon = lon;
        onMouseDownLat = lat;

    },

    onDocumentMouseMove( event ) {

        if ( isUserInteracting === true ) {

            lon = ( onMouseDownMouseX - event.clientX ) * 0.1 + onMouseDownLon;
            lat = ( event.clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;
        }

    },
    onDocumentMouseUp() {

        isUserInteracting = false;

    },
    onDocumentMouseWheel( event ) {
        var explorer =navigator.userAgent ;
        if (explorer.indexOf("Firefox") >= 0){
            camera.fov += event.deltaY * 1;
        } else if (explorer.indexOf("Chrome") >= 0){
            camera.fov += event.deltaY * 0.05;
        } else if (explorer.indexOf("Ie") >= 0){
            camera.fov += event.deltaY * 0.05;
        }
        if(camera.fov<10) camera.fov=10;
        if(camera.fov>130) camera.fov=130;
        camera.updateProjectionMatrix();

    },
    animate() {
        var vm = this
        requestAnimationFrame( vm.animate );//动画
        vm.update();

    },
    update() {

        /*if ( isUserInteracting === false ) {

         lon += 0.1;

         }*/

        lat = Math.max( - 85, Math.min( 85, lat ) );
        phi = THREE.Math.degToRad( 90 - lat );
        theta = THREE.Math.degToRad( lon );

        camera.target.x = 1000 * Math.sin( phi ) * Math.cos( theta );
        camera.target.y = 1000 * Math.cos( phi );
        camera.target.z = 1000 * Math.sin( phi ) * Math.sin( theta );

        camera.lookAt( camera.target );

        /*
         // distortion
         camera.position.copy( camera.target ).negate();
         */

        renderer.render( scene, camera );

    }
}
}
</script>

