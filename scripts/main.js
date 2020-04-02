var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var object;

init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 5;

    // scene

    scene = new THREE.Scene();
    

    scene.add( camera );


    // wall

    var geometry = new THREE.PlaneGeometry( 20, 20, 32 );
    var material = new THREE.MeshPhongMaterial( {color: 'black', side: THREE.DoubleSide, shininess: 7, roughness: 25} );
    var wall = new THREE.Mesh( geometry, material );
    wall.position.z = -2;
    scene.add( wall );

    var texture = new THREE.TextureLoader().load( '../objects/textures/marble.jpg' );
    // manager
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl( "../objects/" );
    mtlLoader.setPath(  "../objects/"  );
    mtlLoader.load( "kissing.mtl", function( materials ) {
        console.log(materials)
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath(  "../objects/"  );
        
        objLoader.load("kissing.obj", function ( object ) {
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                  
                    console.log(child.material)
                    child.material.specular = {r: 0.02, g: 0.02, b: 0.02}
                    child.material.ambient = null
                    child.material.shininess = 2;
                    child.material.map = texture;}
            } );
    
            object.position.y -= 1.8;
            object.position.x -= .1;
            object.position.z = -1;
            object.rotation.y -= 725;
            


            scene.add(object);
        }, onProgress, onError );
    });
    

// light
var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.05, 2000 );
scene.add( ambientLight );
let mouse = {}
var directionalLight = new THREE.PointLight( 0xffffff, 1, 2000);
directionalLight.castShadow= true

var targetObject = new THREE.Object3D();
targetObject.position.x +=25
scene.add(targetObject);

directionalLight.target = targetObject;

document.addEventListener("mousemove", function(event) {

    // Update the mouse variable
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    // Make the sphere follow the mouse
    var vector = new THREE.Vector3(mouse.x, mouse.y, .5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.z * 2 / dir.z * 1.2 ;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    //mouseMesh.position.copy(pos);
  
    directionalLight.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 2));
  });
camera.add( directionalLight );


    // texture

 

    // model

    function onProgress( xhr ) {

        if ( xhr.lengthComputable ) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

        }

    }

    function onError() {}


   

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {


    
    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}

