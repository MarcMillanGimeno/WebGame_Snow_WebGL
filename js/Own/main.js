var renderer, camera, scene, controls; //Componentes principales apra el funcionamiento.

var end = 0; //Variable que controla el mode del jugo (jugando-0/Game Over-1)

var playerPosition = 0;
var player;

var cameraControl;

//Inicializacion de las clases expeciales propias
var clock = new THREE.Clock();
var	scene = new THREE.Scene();
var spawner = new Spawner();
var loader = new Loader();

var elapsedTime = 0, frameCount = 0, lastTime = 0;

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

//infinite loop
function render(){
	//Si el jugador no ha perdido:
	if (!end){
		var delta = clock.getDelta();

		controls.movementSpeed = 10;
		if (player != undefined){
			playerPosition = controls.update(player, delta, playerPosition);
		}

		//Una vez cargados los obstaculos (árboles) comenzamos a enviar las oleadas de árboles
		if (loader.assets.length > 0){
			spawner.createWave(loader.assets);
		}

		end = spawner.updateMovement(playerPosition); //Controlamos las colisiones y el movimiento de los árboles

		level(spawner.level); //Mostramos por pantalla en nivel actual

		renderer.render (scene, camera);;

		requestAnimationFrame(render, moveSnow());
	}

	//Si el jugador ha perdido
	else {
		controls.dispose(); //Eliminamos los controles de juego
		controls.endGameController(); //Añadimos el botón ESC para reiniciar la partida.

		//Eliminamos de pantalla el contador de tiempo y el marcador de nivel
		var node = document.getElementById("overlay");
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
		document.getElementById("endMessage").style.display = "block";

		var element = document.getElementById("levelFinal");
		if (element != undefined){
			element.textContent = spawner.level;
		}
	}
}

//CREATE RENDERER
function createRenderer(){
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000, 1.0);
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
	renderer.shadowMap.enabled = true;
}

//CREATE CAMERA
function createCamera(){
	camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		0.1, 1000);
	camera.position.x = 0;
	camera.position.y = 10;
	camera.position.z = 80;
	camera.lookAt(scene.position);
}

//CREATE LIGHT
function createLight(){

	var directionalLight = new THREE.DirectionalLight (0xffffff, 4);
	directionalLight.position.set (0, 50, 40);
	directionalLight.name = 'directional';
	scene.add(directionalLight);

	var ambientLight = new THREE.AmbientLight(0x111111);
	scene.add(ambientLight);
}

//Creación del plano de la nieve (el suelo)
function createPlane(){
	var planeGeometry = new THREE.PlaneGeometry (350, 350);
	var planeMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff

	});
	var plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.receiveShadow = true;
	plane.rotation.x = -0.5 * Math.PI;

	scene.add(plane);
}

//Creación de las marcas en el suelo para ayudar al jugador
function createPlayerHelper(color_plane, xr, x, y ,z){
	var planeGeometry = new THREE.PlaneGeometry (0.25, 70);
	var planeMaterial = new THREE.MeshBasicMaterial({
		color: color_plane
	});

	var plane = new THREE.Mesh(planeGeometry,planeMaterial);
	plane.receiveShadow = true;
	plane.rotation.x = xr;
	plane.position.x = x;
	plane.position.y = y;
	plane.position.z = z;

	scene.add(plane);
}

//Creación del fondo
function createBackground(){

	// Load the background texture
    var texture = THREE.ImageUtils.loadTexture('assets/background/Mountain_Snow.jpg');
    var backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(220, 60, 0),
        new THREE.MeshBasicMaterial({
            map: texture
        })
	);
	backgroundMesh.position.y = 25;
	backgroundMesh.position.z = -40;

	scene.add(backgroundMesh);
}

//Función que modifica el nivel (número) que se muestra por pantalla
function level (level){
	var levelElement = document.getElementById("level");
	if (levelElement != undefined){
		levelElement.textContent = level;
	}
	level++;
}

//Función que controla el tiempo que se miestra pora pantalla
function timer(interval){
    var sec = 0;
    var timer = setInterval(function(){

		var timeElement = document.getElementById("time");
		if (timeElement != undefined){
			timeElement.textContent = sec;
		}
    sec++;

    }, interval);
}

//Funcion para crear la textura de una particula de nieve
function texture_from_canvas(){
	var canv = document.createElement('canvas');
	canv.width = canv.height = 32;
	var ctx = canv.getContext('2d');
	ctx.translate(10,10);
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(0, 0, 5, 0, Math.PI * 1, false);
	ctx.lineTo(0, -15);
	ctx.closePath();
	ctx.fill();
	var texture = new THREE.Texture(canv);
	texture.needsUpdate = true;

	return texture;
}

//Creamos todas las particulas de nieve
function createSnow(){

	var geometry2 = new THREE.Geometry();

	//creamos la textura
	var material2 = new THREE.ParticleBasicMaterial({
		vertexColors: false,
		size: 2,
		//Llamamos a la funcion que crea la forma de la nieva
		map: texture_from_canvas(),
		transparent: true

	});

	//Creacion de las 200 particulas que simulan la nieve
	var dx = 100, dy = 100, dz = 100;
	for (var i = 0; i < 200; i++){
		//Las posicionamos en el escenario de manera aleatorio
		var p = new THREE.Vector3(
			Math.random() * dx - dx/2,
			Math.random() * dx - dx/2,
			Math.random() * dx - dx/2
		);

		//Les otorgamos una velocidad random
		p.vy =  + Math.random() * 1.0;
		geometry2.vertices.push(p);
	}

	var colors = [];

	for (var i = 0; i < geometry2.vertices.length; i++){
		colors[i] = new THREE.Color();
		colors[i].setRGB(Math.random(), Math.random(), Math.random());
	}

	geometry2.colors = colors;

	particleSystem2 = new THREE.ParticleSystem(geometry2, material2);
	particleSystem2.sortParticles = true;
	particleSystem2.name = 'particleSystem';

	scene.add(particleSystem2);
}

//Movimiento de las particulas de nieve
function moveSnow(){

	//Actualizamos la posicion de la particula de nieve
	var vertices = scene.getObjectByName('particleSystem').geometry.vertices;
	var pSystem = scene.getObjectByName('particleSystem');
	pSystem.geometry.verticesNeedUpdate = true;

	vertices.forEach(function (p){

		//cada particula desciende en altura
		p.y = p.y - p.vy;

		//si llega a bajo de la escena, ponemos las particulas arriba
		if(p.y <= -140){
			p.y = 160;
		}
	});

}

function init(){

	//Scene Components
	createRenderer();
	createCamera();
	createLight();

	//Enviroment Components
	createBackground();
	createSnow(); //Particulas de nieve

	createPlane();//Plano del suelo
	//Marcas de colores en el suelo para ayudar al jugador
	createPlayerHelper(0xff0000, -0.5 * Math.PI, -14, 0.01, 30);
	createPlayerHelper(0x0000ff, -0.5 * Math.PI, -7, 0.01, 30);
	createPlayerHelper(0xfdcf89, -0.5 * Math.PI, 0, 0.01, 30);
	createPlayerHelper(0xd600ff, -0.5 * Math.PI, 7, 0.01, 30);
	createPlayerHelper(0x00ff38, -0.5 * Math.PI, 14, 0.01, 30);

	loader.createEnviroment(); //Cargamos todos los assets

	controls = new Movement(); //Inicio del controlador de teclas
	controls.movementSpeed = 1000;
	controls.domElement = renderer.domElement

	timer(1000); //Inicio del timer

	document.body.appendChild(renderer.domElement)

	render();
}

init();
