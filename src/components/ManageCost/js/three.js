    var source= QJFileManageSystemURL + $('#panorama_file_path').val();
    var camera, scene, renderer;
    var isUserInteracting = false,
            onMouseDownMouseX = 0, onMouseDownMouseY = 0,
            lon = 0, onMouseDownLon = 0,
            lat = 0, onMouseDownLat = 0,
            phi = 0, theta = 0;

    init(source);

    function init(source) {

        var container, mesh;

        container = document.getElementById( 'container' );

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
        renderer.setSize(window.innerWidth,window.innerHeight);
        container.appendChild( renderer.domElement );
        renderer.setClearColor(0xFFFFFF, 1.0);
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'wheel', onDocumentMouseWheel, false );

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

        window.addEventListener( 'resize', onWindowResize, false );

        animate();
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight  );

    }

    function onDocumentMouseDown( event ) {

        event.preventDefault();

        isUserInteracting = true;

        onMouseDownMouseX = event.clientX;
        onMouseDownMouseY = event.clientY;

        onMouseDownLon = lon;
        onMouseDownLat = lat;

    }

    function onDocumentMouseMove( event ) {

        if ( isUserInteracting === true ) {

            lon = ( onMouseDownMouseX - event.clientX ) * 0.1 + onMouseDownLon;
            lat = ( event.clientY - onMouseDownMouseY ) * 0.1 + onMouseDownLat;

        }

    }

    function onDocumentMouseUp() {

        isUserInteracting = false;

    }

    function onDocumentMouseWheel( event ) {

//            camera.fov += event.deltaY * 0.05;
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

    }

    function animate() {

        requestAnimationFrame( animate );//动画
        update();

    }

    function update() {

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
