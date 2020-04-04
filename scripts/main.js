var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var object;

init();


function init() {


    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 15;
    
    
    scene = new THREE.Scene();
    scene.add( camera );


    // wall

    var geometry = new THREE.PlaneGeometry( 100, 100, 32 );
    var material = new THREE.MeshPhongMaterial( {color: 'black', side: THREE.DoubleSide, shininess: 12, roughness: 55} );
    var wall = new THREE.Mesh( geometry, material );
    wall.position.z = -15;
    scene.add( wall );


    // Instantiate a loader
var loader = new THREE.GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( './scripts/draco/' );
loader.setDRACOLoader( dracoLoader );

// Load a glTF resource
loader.load(
	// resource URL
	'../objects/3graces_compressed.glb',
	// called when the resource is loaded
	function ( statue ) {

		scene.add( statue.scene );

		statue.animations; // Array<THREE.AnimationClip>
		statue.scene; // THREE.Group
		statue.scenes; // Array<THREE.Group>
		statue.cameras; // Array<THREE.Camera>
        statue.asset; // Object
        statue.scene.matrixAutoUpdate = false;
        object = statue.scene;
        statue.scene.traverse( child => {

            if ( child.material ) {
                child.material.shininess = 100
                // child.material.roughness = 100
                // child.material.emissive = null
                child.material.metalness = .5
                child.material.fog = true

            }
        
        } );
            statue.scene.scale.x = .25
            statue.scene.scale.y = .25
            statue.scene.scale.z = .25

            statue.scene.position.y -= 24;
            statue.scene.position.x += 1;
            statue.scene.position.z = -8;
            
            statue.scene.rotation.y += .1;

            statue.scene.rotation.x -= 0;


	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

// light
var ambientLight = new THREE.AmbientLight( 0xcccccc, 0, 2000 );
scene.add( ambientLight );
let mouse = {}
var directionalLight = new THREE.PointLight( 'red', 1.5, 20);
directionalLight.castShadow= true



document.addEventListener("mousemove", function(event) {

    // Update the mouse variable
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    // Make the sphere follow the mouse
    var vector = new THREE.Vector3(mouse.x, mouse.y, .5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.z / dir.z * 3 ;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    //mouseMesh.position.copy(pos);
    if (object) {
        object.updateMatrix() 
        camera.position.x += dir.x / 200
        camera.position.z -= (dir.y) / 800


    
    }
    directionalLight.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 9));
    render()

  });
  var isDistant = false;
  document.addEventListener("touchmove", function(event) {

    // Update the mouse variable
    if (!isDistant) {
        object.position.y += 2
        object.position.z -= 5
        directionalLight.distance = 25

        isDistant = true
    }
    event.preventDefault();
    console.log(event.touches[0].clientX)
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  
    // Make the sphere follow the mouse
    var vector = new THREE.Vector3(mouse.x, mouse.y, .5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.z / dir.z * 3 ;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    //mouseMesh.position.copy(pos);
    if (object) {
        object.updateMatrix() 
        camera.position.x += dir.x / 200
        camera.position.z -= (dir.y) / 800
    
    }
    directionalLight.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 5));
    render()

  });
camera.add( directionalLight );


    function onProgress( xhr ) {

        if ( xhr.lengthComputable ) {

            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

        }

    }

    function onError(e) {console.log(e)}


   

    //
    const container = document.getElementById( 'three' );

    // create your renderer
   // scene
    renderer = new THREE.WebGLRenderer({powerPreference: "high-performance", physicallyCorrectLights: true});
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


function render() {

    
    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}

