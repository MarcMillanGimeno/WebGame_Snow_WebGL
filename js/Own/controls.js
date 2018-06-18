
/*
*    Controla el correcto funcionamiento de las teclas y el control del juego
*/

function bind( scope, fn ) {
	return function () {

		fn.apply( scope, arguments );

	};

}

Movement = function (domElement){
	this.position = 0;

	this.domElement = ( domElement !== undefined ) ? domElement : document;
	if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

	//this.movementSpeed = 1.0f;
	this.moveVector = new THREE.Vector3(0,0,0);
	this.moveState = { left: 0, right: 0};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.keydown = function ( event ) {

		if ( event.altKey ) {

			return;

		}

		switch ( event.keyCode ) {

			case 65: /*A*/
				this.position--;
				if (this.position < -2){
					this.position = -2;
				}
				break;
			case 68: /*D*/
				this.position++;
				if (this.position > 2){
					this.position = 2;
				}
			break;

			case 37: /*left*/
				this.position--;
				if (this.position < -2){
					this.position = -2;
				}
			break;

			case 39: /*right*/
				this.position++;
				if (this.position > 2){
					this.position = 2;
				}
			break;

		}

		this.updateMovementVector();

	};

	this.spacedown = function ( event ) {
		if ( event.altKey ) {
			return;
		}

		if (event.keyCode == 27) /*ESC*/ location.reload(true);

	};


	this.keyup = function ( event ) {

		switch ( event.keyCode ) {

			case 65: /*A*/ this.moveState.left = 0; break;
			case 68: /*D*/ this.moveState.right = 0; break;


			case 37: /*left*/ this.moveState.left = 0; break;
			case 39: /*right*/ this.moveState.right = 0; break;

		}

		this.updateMovementVector();

	};

	this.update = function (player_obj, delta) {
		player_obj.position.x = 7 * this.position;

		return this.position;
	};

	this.updateMovementVector = function () {
		this.moveVector.x = ( - this.moveState.left + this.moveState.right );
	};

	this.dispose = function () {

		window.removeEventListener( 'keydown', _keydown, false );

	};

	this.endGameController = function (){
		var _spacedown= bind( this, this.spacedown );
		window.addEventListener( 'keydown', _spacedown, false );
	}

	var _keydown = bind( this, this.keydown );


	window.addEventListener( 'keydown', _keydown, false );


	this.updateMovementVector();
}
