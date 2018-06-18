/*
* Se encarga de cargar los arboles y el juegador principal
* También se encarga de almazanerlos para ser utilizados
*/

var Loader = (function(){
	var assets = []; //Almacen de los assets (los arboles)

	function Loader(){
		this.pivot = null;
		this.pivot = new THREE.Object3D();
		this.pivot.name = 'Pivot';

		scene.add( this.pivot );

		this.assets = null;
		this.assets = new Array();
		this.assets.name = 'Assets Container'
	}

	Loader.prototype.loadAsset = function (url_obj, url_mtl, name){
		var objLoader = new THREE.OBJLoader2();
		var scope = this;

		var callbackOnLoad = function ( event ) {
			var local = new THREE.Object3D();
			local.name = name;
			local.position.set( 0, 2, 50);
			local.rotation.set(0, 1.6, 0)
			var scale = 0.5;
			local.scale.set( scale, scale, scale );
			scope.assets.push(local);
			local.add( event.detail.loaderRootNode );
		};

		var onLoadMtl = function (materials) {
			objLoader.setModelName(name);
			objLoader.setMaterials( materials );
			objLoader.terminateWorkerOnLoad = false;
			objLoader.load(url_obj, callbackOnLoad, null, null, null, false );
		};
		objLoader.loadMtl(url_mtl, null, onLoadMtl );
	};

	Loader.prototype.loadPlayer = function(mtl_path, obj_path, mtl_name, obj_name){
		var scope = this;

		var objLoader = new THREE.OBJLoader2();

		var callbackOnLoad = function ( event ) {
			var local = new THREE.Object3D();
			local.name = 'player model';
			local.position.set( 0, 0, 50);
			local.castShadow = true;
			local.rotation.set(0, 3.1, 0)
			var scale = 0.5;
			local.scale.set( scale, scale, scale );
			scope.pivot.add( local );
			local.add( event.detail.loaderRootNode );
			player = local;
		};

		var onLoadMtl = function (materials) {
			objLoader.setModelName('player');
			objLoader.setMaterials( materials );
			objLoader.terminateWorkerOnLoad = false;
			objLoader.load( 'assets/Snowmobile/Snowmobile.obj', callbackOnLoad, null, null, null, false );
		};
		objLoader.loadMtl('assets/Snowmobile/Snowmobile.mtl', null, onLoadMtl );
	};

	Loader.prototype.createEnviroment = function(){
		this.loadPlayer();
		this.loadAsset('assets/arbol/snowTree.obj', 'assets/arbol/snowTree.mtl', 'snowTree');
		this.loadAsset('assets/arbol/finalTree.obj', 'assets/arbol/finalTree.mtl', 'simpleTree');
	};

	return Loader;
})();
