var Spawner = (function(){

	function Spawner(){
		this.timer = 0;
		this.nextWave = 100;

		this.waves = 5;
		this.lastWaves = 5;
		this.velocity = 0.5;
		this.level = 0;

		this.obstacles = null;
		this.obstacles = new Array();
		this.obstacles.name = 'Obstacle container';
	}

	Spawner.prototype.addObstacle = function(obstacle){
		var scope = this;
		scope.obstacles.push(obstacle);
	};

	Spawner.prototype.spawnObtacle = function (assets, path, x, z){
		var y = Math.floor((Math.random() * assets.length));
		var obstacle = assets[y].clone();
		obstacle.path = path;
		obstacle.Enabled = true;
		obstacle.position.x = x;
		obstacle.position.y = 0;
		obstacle.position.z = z;
		scene.add(obstacle);
		this.addObstacle(obstacle);
	}

	Spawner.prototype.createWave = function(assets){
		this.timer++;

		if (this.timer > this.nextWave){

			var x = Math.floor((Math.random() * 10) + 1);

			switch (x){
				case 1:
					//00-00
					this.spawnObtacle(assets, -2, -14,-40);
					this.spawnObtacle(assets, -1, -7, -40);
					this.spawnObtacle(assets, 1, 7, -40);
					this.spawnObtacle(assets, 2, 14, -40);

					break;

				case 2:
					//0-00-
					this.spawnObtacle(assets, -2, -14, -40);
					this.spawnObtacle(assets, 0, 0, -40);
					this.spawnObtacle(assets, 1, 7, -40);

					break;

				case 3:
					//-000-
					this.spawnObtacle(assets, -1, -7, -40);
					this.spawnObtacle(assets, 0, 0, -40);
					this.spawnObtacle(assets, 1, 7, -40);

					break;

				case 4:
					//--0--
					this.spawnObtacle(assets, 0, 0, -40);

					break;

				case 5:
					//-0-0-
					this.spawnObtacle(assets, -1, -7, -40);
					this.spawnObtacle(assets, 1, 7, -40);;

					break;

				case 6:
					//0-0-0
					this.spawnObtacle(assets, -2, -14, -40);
					this.spawnObtacle(assets, 0, 0, -40);
					this.spawnObtacle(assets, 2, 14, -40);

					break;

				case 7:
					//--000
					this.spawnObtacle(assets, 0, 0, -40);
					this.spawnObtacle(assets, 1, 7, -40);
					this.spawnObtacle(assets, 2, 14,-40);

					break;

				case 8:
					//000-0
					this.spawnObtacle(assets, -2, -14,-40);
					this.spawnObtacle(assets, -1, -7, -40);
					this.spawnObtacle(assets, 0, 0, -40);
					this.spawnObtacle(assets, 2, 14,-40);

					break;

				case 9:
					//0-000
					this.spawnObtacle(assets, -2, -14,-40);
					this.spawnObtacle(assets, -1, -7,-40);
					this.spawnObtacle(assets, 0, 0, -40);
					this.spawnObtacle(assets, 2, 14,-40);
					break;

				case 10:
					//0---0
					this.spawnObtacle(assets, -2, -14,-40);
					this.spawnObtacle(assets, 2, 14,-40);

					break;
			}
			this.timer = 0;
			this.waves--;
			if(this.waves <= 0){
				this.nextWave = Math.round(this.nextWave - this.nextWave*0.3);
				this.waves = this.lastWaves + 2;
				this.lastWaves = 	this.waves;
				this.velocity = this.velocity * 1.2;
				this.level++;
			}
		}
	}

	Spawner.prototype.updateMovement = function(playerPosition){
		if (this.obstacles != undefined){
		//if (1 == 2){
			for (i = 0; i < this.obstacles.length; i++){
				this.obstacles[i].position.z += this.velocity ;
				if (this.obstacles[i].scale.x < 1.5){
					this.obstacles[i].scale.x += 0.006;
					this.obstacles[i].scale.y += 0.006;
					this.obstacles[i].scale.z += 0.006;
				}

				if (this.obstacles[i].position.z > 100){
					//this.obstacles[i].Enabled = false;
					this.obstacles.splice(i, 1);
					/*
					for (j = scene.children.length-1; -1 < j;  j--){
						if (scene.children[j].Enabled == false){
							scene.children.splice (j, 1);
							break;
						}
					}
					*/
				}
			}

			for (i = 0; i < scene.children.length; i++){
				if (scene.children[i].Enabled){
					if (scene.children[i].position.z >= 48 && scene.children[i].position.z <= 52 && scene.children[i].path == playerPosition){
						return 1;
					}
				}
			}
		}
		return 0;
	};

	return Spawner;
})();
