/**
 * @author Sanguchi.
 */

//Declaracion de variables globales.
var canvas = document.getElementById('tetris');
var pen = canvas.getContext('2d');
var entidades = [];
var _UP = 0;
var _RIGHT = 1;
var _DOWN = 2;
var _LEFT = 3;
var running = false;
var ignoreReturn = false;
var clock;
var loops = 0;
var tanks = 0;
var maxTanks = 5;
var spawnDelay = 50;
var level = 0;
var kills = 0;
var vidas = 4;
var moveDelay = 5;
var lastLevel = false;
var time = 600;
var lockLevel = true;

//Arrays para graficar los tanques.
var tup = [[0, 1, 0], [1, 1, 1], [1, 0, 1]];
var tright = [[1, 1, 0], [0, 1, 1], [1, 1, 0]];
var tdown = [[1, 0, 1], [1, 1, 1], [0, 1, 0]];
var tleft = [[0, 1, 1], [1, 1, 0], [0, 1, 1]];

//Declaracion del jugador.
var player = new Player(50, 100);

//Captura de teclado.
onkeydown = function(e)
{
	//alert("EV = " + e.keyCode); //descomentar para testear el teclado.
	//W key
	var wkey = 87;
	//S key
	var skey = 83;
	//A key
	var akey = 65;
	//D key
	var dkey = 68;
	//X key
	var xkey = 88;
	//Z key
	var zkey = 90;
	//P key
	var pkey = 80;
        //left key
        var left = 37;
	//up key
	var up = 38;
	//right key
	var right = 39;
	//down key
	var down = 40;
	//space key
	var space = 32;
	if (running)
	{
		switch (e.keyCode)
		{
			case up:
				player.up();
				break;
			case wkey:
				player.up();
				break;
			// 10px arriba

			case down:
				player.down();
				break;
			case skey:
				player.down();
				break;
			// 10px abajo
			case left:
				player.left();
				break;
			case akey:
				player.left();
				break;
			// 10px izquierda
			case right:
				player.right();
				break;
			case dkey:
				player.right();
				break;
			// 10px derecha
			case pkey:
				player.shot();
				break;
			case space:
				player.shot();
				break;
			// disparar
		}
		draw();
	}
};
//TANK enemigos.
function Tank(xa, ya)
{
	this.x = xa;
	this.y = ya;
	this.face = _UP;
	this.pix = [];
	entidades.push(this);
	tanks++;
	this.counter = 0;
}

Tank.prototype.update = function()
{
	if (this.counter == moveDelay)
	{
		this.counter = 0;
		if (getRandomBoolean())
		{
			switch(this.face)
			{
				case _UP:
					this.up();
					break;
				case _RIGHT:
					this.right();
					break;
				case _DOWN:
					this.down();
					break;
				case _LEFT:
					this.left();
					break;
			}
			if (!ignoreReturn)
				return;
		}
		var r = Math.floor(Math.random() * 10);
		//alert("R = " + r);
		if (r == 0 || r == 1)
			this.up();
		if (r == 2 || r == 3)
			this.left();
		if (r == 4 || r == 5)
			this.down();
		if (r == 6 || r == 7)
			this.right();
		if (r == 8 || r == 9)
			this.shot();
	}
	this.counter++;
};

Tank.prototype.draw = function()
{
	this.pix = getPixels(this.face, this.x, this.y);
	if (canvas.getContext)
	{
		for (var i = 0; i < this.pix.length; i++)
		{
			this.pix[i].draw("#24392A");
		}
	}
	this.check();
};
Tank.prototype.shot = function()
{
	var xa = this.x;
	var ya = this.y;
	switch(this.face)
	{
		case _UP:
			xa += 10;
			ya -= 10;
			break;
		case _RIGHT:
			xa += 30;
			ya += 10;
			break;
		case _DOWN:
			xa += 10;
			ya += 30;
			break;
		case _LEFT:
			xa -= 10;
			ya += 10;
			break;
	}
	new Shot(xa, ya, this.face, this);
};

Tank.prototype.up = function()
{
	if (this.y > 0 && this.face == _UP)
		this.y -= 10;
	else
		this.face = _UP;
};

Tank.prototype.right = function()
{
	if (this.x < 80 && this.face == _RIGHT)
		this.x += 10;
	else
		this.face = _RIGHT;
};

Tank.prototype.down = function()
{
	if (this.y < 190 && this.face == _DOWN)
		this.y += 10;
	else
		this.face = _DOWN;
};

Tank.prototype.left = function()
{
	if (this.x > 0 && this.face == _LEFT)
		this.x -= 10;
	else
		this.face = _LEFT;
};
Tank.prototype.check = function()
{
	var c = this.pix;
	for (var i = 0; i < c.length; i++)
	{
		var p = c[i];
		var t = checkAt(p.x, p.y);
		if ( t instanceof Shot && t.from instanceof Player)
		{
			//alert("SHOT");
			this.remove();
			t.remove();
		}
	}
};
Tank.prototype.remove = function()
{
	var e = entidades.indexOf(this);
	entidades.splice(e, 1);
	tanks--;
	kills++;
	lockLevel = false;
};

//SHOT disparos.
function Shot(xa, ya, d, own)
{
	this.x = xa;
	this.y = ya;
	this.dir = d;
	this.iColor = "#24392A";
	this.c = " #24392A";
	entidades.push(this);
	this.from = own || null;
}

Shot.prototype.update = function()
{
	switch(this.dir)
	{
		case _UP:
			this.y -= 10;
			break;
		case _LEFT:
			this.x -= 10;
			break;
		case _DOWN:
			this.y += 10;
			break;
		case _RIGHT:
			this.x += 10;
			break;
	}
	var tx = this.x;
	var ty = this.y;
	if (tx < 0 || tx > 110 || ty < 0 || ty > 220)
	{
		this.remove();
		//alert("e = " + e + "\nArray = " + entidades);
	}
};

Shot.prototype.draw = function()
{
	pen.fillStyle = this.c;
	pen.fillRect(this.x, this.y, 10, 10);
	pen.fillStyle = this.iColor;
	pen.fillRect(this.x + 1, this.y + 1, 8, 8);
	pen.fillStyle = this.c;
	pen.fillRect(this.x + 2, this.y + 2, 6, 6);
	this.check();
};

Shot.prototype.check = function()
{
	var xa;
	var ya;
	switch(this.dir)
	{
		case _UP:
			xa = this.x;
			ya = this.y - 10;
			break;
		case _LEFT:
			xa = this.x - 10;
			ya = this.y;
			break;
		case _DOWN:
			xa = this.x;
			ya = this.y + 10;
			break;
		case _RIGHT:
			xa = this.x + 10;
			ya = this.y;
			break;
	}
	var other = checkAt(xa, ya);
	if (other != null)
	{
		if ( other instanceof Shot)
		{
			other.remove();
			this.remove();
		}
	}
};

Shot.prototype.remove = function()
{
	var e = entidades.indexOf(this);
	entidades.splice(e, 1);
};

//PIXEL
function Pixel(xa, ya, c)
{
	this.x = xa;
	this.y = ya;
	this.iColor = "#739858";
	this.color = c || "black";
}

Pixel.prototype.draw = function(c)
{
	// shadow
	pen.fillStyle = "#6D9851";
	pen.fillRect(this.x + 2, this.y + 2, 10, 10);
	pen.fillRect(this.x + 3, this.y + 3, 8, 8);
	pen.fillRect(this.x + 4, this.y + 4, 6, 6);
	if (c != null)
		this.color = c;
	pen.fillStyle = this.color;
	pen.fillRect(this.x, this.y, 10, 10);
	pen.fillStyle = this.iColor;
	pen.fillRect(this.x + 1, this.y + 1, 8, 8);
	pen.fillStyle = this.color;
	pen.fillRect(this.x + 2, this.y + 2, 6, 6);
};

//PLAYER
function Player(ex, ey, tipo)
{
	this.x = ex || 50;
	this.y = ey || 100;
	this.face = _UP;
	this.pix = [];
	entidades.push(this);
	this.dead = false;
	this.delay = 0;
}

Player.prototype.up = function()
{
	if (this.y > 0 && this.face == _UP)
		this.y -= 10;
	else
		this.face = _UP;
};

Player.prototype.right = function()
{
	if (this.x < 80 && this.face == _RIGHT)
		this.x += 10;
	else
		this.face = _RIGHT;
};

Player.prototype.down = function()
{
	if (this.y < 190 && this.face == _DOWN)
		this.y += 10;
	else
		this.face = _DOWN;
};

Player.prototype.left = function()
{
	if (this.x > 0 && this.face == _LEFT)
		this.x -= 10;
	else
		this.face = _LEFT;
};

Player.prototype.update = function()
{
	if (this.dead)
	{
		this.delay++;
		this.x = 200;
		this.y = 400;
		if (this.delay == 20)
		{
			this.delay = 0;
			this.respawn();
		}
	}
};

Player.prototype.shot = function()
{
	var xa = this.x;
	var ya = this.y;
	switch(this.face)
	{
		case _UP:
			xa += 10;
			ya -= 10;
			break;
		case _RIGHT:
			xa += 30;
			ya += 10;
			break;
		case _DOWN:
			xa += 10;
			ya += 30;
			break;
		case _LEFT:
			xa -= 10;
			ya += 10;
			break;
	}
	new Shot(xa, ya, this.face, this);
};
Player.prototype.respawn = function()
{
	if (vidas == 0)
	{
		alert("Game Over :v\nEnemigos derrotados = " + kills);
		reset();
		draw();
		stop();
	}
	this.dead = false;
	this.x = 50;
	this.y = 100;
	vidas--;
};

Player.prototype.check = function()
{
	var c = this.pix;
	for (var i = 0; i < c.length; i++)
	{
		var p = c[i];
		var t = checkAt(p.x, p.y);
		if ( t instanceof Shot && t.from instanceof Tank)
		{
			this.dead = true;
			t.remove();
		}
	}
};

Player.prototype.draw = function()
{
	this.pix = getPixels(this.face, this.x, this.y);
	if (canvas.getContext)
	{
		for (var i = 0; i < this.pix.length; i++)
		{
			this.pix[i].draw("silver");
		}
	}
	this.check();
};

//FUNCIONES UTILES.

//getPixels(): en base al X-Y junto con la orientacion
//del Player, devuelve un array con los pixeles que
//componen el grafico/sprite del Player.
function getPixels(f, xa, ya)
{
	var p = [];
	switch(f)
	{
		case _UP:
			{
				for (var aa = 0; aa < tup.length; aa++)
				{
					for (var bb = 0; bb < tup[aa].length; bb++)
					{
						if (tup[aa][bb] != 0)
						{
							var pi = new Pixel(xa + bb * 10, ya + aa * 10);
							p.push(pi);
						}
					}
				}
			}
			break;
		case _RIGHT:
			{
				for (var aa = 0; aa < tright.length; aa++)
				{
					for (var bb = 0; bb < tright[aa].length; bb++)
					{
						if (tright[aa][bb] != 0)
						{
							var pi = new Pixel(xa + bb * 10, ya + aa * 10);
							p.push(pi);
						}
					}
				}
			}
			break;
		case _DOWN:
			{
				for (var aa = 0; aa < tdown.length; aa++)
				{
					for (var bb = 0; bb < tdown[aa].length; bb++)
					{
						if (tdown[aa][bb] != 0)
						{
							var pi = new Pixel(xa + bb * 10, ya + aa * 10);
							p.push(pi);
						}
					}
				}
			}
			break;
		case _LEFT:
			{
				for (var aa = 0; aa < tleft.length; aa++)
				{
					for (var bb = 0; bb < tleft[aa].length; bb++)
					{
						if (tleft[aa][bb] != 0)
						{
							var pi = new Pixel(xa + bb * 10, ya + aa * 10);
							p.push(pi);
						}
					}
				}
			}
			break;
	}
	return p;
}

//draw(): se encarga de invocar la funcion draw() de
//cada objeto en el array entidades[].
function draw()
{
	if (canvas.getContext)
	{
		pen.fillStyle = "#89AD6F";
		pen.fillRect(0, 0, 110, 220);
		var px = entidades.length;
		for (var i = 0; i < px; i++)
		{
			var p = entidades[i];
			if (p != undefined)
				p.draw();
		}
	}
}

//checkAt(): se fija si existe alguna entidad
//en las coordenadas que se le pasan como
//argumentos (xa , ya).
function checkAt(xa, ya)
{
	for (var i = 0; i < entidades.length; i++)
	{
		var c = entidades[i];
		if (c.x == xa && c.y == ya)
			return c;
	}
	return null;
}

//crea un Tank{} enemigo en un lugar aleatorio.
function spawnRandomTank()
{
	var xa;
	var ya;
	var r = Math.floor(Math.random() * 10);
	while (!(r <= 5))
	r = Math.floor(Math.random() * 10);
	switch(r)
	{
		case 0:
			xa = 0;
			ya = 0;
			break;
		case 1:
			xa = 80;
			ya = 0;
			break;
		case 2:
			xa = 0;
			ya = 90;
			break;
		case 3:
			xa = 80;
			ya = 90;
			break;
		case 4:
			xa = 0;
			ya = 190;
			break;
		case 5:
			xa = 80;
			ya = 190;
			break;
	}
	if (tanks < maxTanks)
		new Tank(xa, ya);
}

//devuelve true/false de forma aleatoria.
function getRandomBoolean()
{
	return Math.random() < 0.5;
}

function levelUp()
{
	if (!lastLevel)
	{
		level++;
		if (level == 1)
		{
			moveDelay = 3;
			spawnDelay = 30;
		}
		if (level == 2)
			moveDelay = 2;
		if (level == 3)
			spawnDelay = 20;
		if (level == 4)
			moveDelay = 2;
		if (level == 5)
		{
			maxTanks = 8;
			spawnDelay = 10;
		}
		if (level == 6)
		{
			ignoreReturn = true;
			moveDelay = 3;
		}
		if (level == 7)
		{
			for (var i = 0; i < entidades.length; i++)
			{
				var t = entidades[i];
				if ( t instanceof Tank)
					t.remove();

			}
			stop();
			alert("Preparate para el ultimo nivel! \nDebes sobrevivir 60 segundos para ganar...\nVuelve a presionar el boton Start para empezar :v");

			spawnDelay = 5;
			ignoreReturn = true;
			moveDelay = 1;
			maxTanks = 4;
			lastLevel = true;
			document.getElementById("ltime").style.display = "block";
		}
	}
}

//update(): invoca el metodo update() en cada objeto
//del array entidades[] y luego hace un draw().
function update()
{
	loops++;
	var px = entidades.length;
	for (var i = 0; i < px; i++)
	{
		var p = entidades[i];
		if (p != undefined)
			p.update();
	}
	draw();
	if (loops >= spawnDelay)
	{
		loops = 0;
		if (level == 0)
		{
			spawnRandomTank();
			spawnRandomTank();
		}
		if (level == 1 || level == 2)
			spawnRandomTank();
		spawnRandomTank();
	}
	if (kills % 15 == 0 && !lockLevel)
	{
		levelUp();
		lockLevel = true;
	}
	if (lastLevel)
	{
		if (time == 0)
		{
			alert("HAS GANADO!!! \nBueno, no es que te vaya a dar un premio e.e\nPor cierto, hiciste " + kills + " puntos o:");
			reset();
			stop();
			return;
		}
		time--;
	}
	var k = document.getElementById("kills");
	var v = document.getElementById("lives");
	var l = document.getElementById("level");
	var t = document.getElementById("time");
	k.innerHTML = kills;
	v.innerHTML = vidas;
	l.innerHTML = level;
	t.innerHTML = time;
}

//start(): Obviamente, inicia el juego, y deshabilita
//el boton START para evitar bugs. Tambien habilita
//el boton STOP para pausar la partida.
function start()
{
	running = true;
	document.getElementById('stop').disabled = false;
	document.getElementById('start').disabled = true;
	//esto ejecuta update() cada 0.1 segundos.
	clock = setInterval(function()
	{
		update();
	}, 100);
}

//stop(): hace lo contrario que start() :v
function stop()
{
	running = false;
	clearInterval(clock);
	document.getElementById('stop').disabled = true;
	document.getElementById('start').disabled = false;
}

function reset()
{
	entidades = null;
	entidades = [];
	lastLevel = false;
	ignoreReturn = false;
	lockLevel = true;
	moveDelay = 5;
	spawnDelay = 50;
	vidas = 5;
	tanks = 0;
	level = 0;
	kills = 0;
	loops = 0;
	time = 600;
	document.getElementById("ltime").style.display = "none";
	player = new Player(50, 100);
}
