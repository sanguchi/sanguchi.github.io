/**
 * @author SevenDemons
 */

//Declaracion de variables globales.
var canvas = document.getElementById('race');
var pen = canvas.getContext('2d');
var entidades = [];
var running = false;
var clock;
var loops = 0;
var spawnDelay = 10;
var level = 0;
var cars = 0;
var vidas = 4;
var lockLevel = true;
var fastLock = false;
var delay = 200;

//Arrays para graficar los autos.
var cup = [[0, 1, 0], [1, 1, 1], [0, 1, 0], [1, 0, 1]];
var cdown = [[1, 0, 1], [0, 1, 0], [1, 1, 1], [0, 1, 0]];

//Declaracion del jugador.
var player = new Player();

var wall1 = new Pared(0);
var wall2 = new Pared(100);

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
			//derecha - D
			case dkey:
				player.right();
				break;
			//derecha
			case right:
				player.right();
				break;
			//izquierda
			case left:
				player.left();
				break;
			//izquierda - A
			case akey:
				player.left();
				break;
			//acelerar - W
			case wkey:
				if (!fastLock)
				{
					setFastMode();
					fastLock = true;
				}
				break;
			//acelerar - Space
			case space:
				if (!fastLock)
				{
					setFastMode();
					fastLock = true;
				}
				break;
		}
		draw();
	}
};

onkeyup = function(e)
{
	//space key
	var space = 32;
	//P key
	var pkey = 80;
	//W key
	var wkey = 87;

	if (running)
	{
		switch (e.keyCode)
		{
			//acelerar - W
			case wkey:
				setNormalMode();
				fastLock = false;
				break;
			//acelerar - Space
			case space:
				setNormalMode();
				fastLock = false;
				break;
		}
	}
};

//CAR
function Auto(xa, ya)
{
	this.x = xa;
	this.y = ya;
	this.pix = cup;
	entidades.push(this);

}

Auto.prototype.down = function()
{
	this.y += 10;
};

Auto.prototype.update = function()
{
	this.down();
	if (this.y == 220)
	{
		this.remove();
		cars++;
		lockLevel = false;
	}
};
Auto.prototype.draw = function()
{
	this.pix = getPixels(cup, this.x, this.y, this);
	if (canvas.getContext)
	{
		for (var i = 0; i < this.pix.length; i++)
		{
			this.pix[i].draw("black");
		}
	}
};

Auto.prototype.remove = function()
{
	var e = entidades.indexOf(this);
	entidades.splice(e, 1);
};
//PLAYER

function Player()
{
	this.x = 40;
	this.y = 220 - 40;
	this.pix = [];
	entidades.push(this);
	this.dead = false;
	this.downDelay = 4;
	this.upDelay = 4;
}

Player.prototype.right = function()
{
	if (this.x < 70)
		this.x += 30;
};

Player.prototype.left = function()
{
	if (this.x > 10)
		this.x -= 30;
};

Player.prototype.down = function()
{
	this.y += 10;
};

Player.prototype.up = function()
{
	this.y -= 10;
};
Player.prototype.update = function()
{
	if (!this.dead)
		this.check();
	if (this.dead)
	{
		if (this.downDelay > 0)
		{
			this.down();
			this.downDelay--;
		}
		if (this.downDelay == 0)
		{
			this.up();
			this.upDelay--;
		}
		if (this.downDelay == 0 && this.upDelay == 0)
		{
			this.downDelay = 4;
			this.upDelay = 4;
			this.dead = false;
			vidas--;
		}
	}

	if (vidas == 0)
	{
		alert("Game Over :v\nPuntos = " + cars);
		reset();
		draw();
		stop();
	}
};

Player.prototype.check = function()
{
	var c = this.pix;
	for (var i = 0; i < c.length; i++)
	{
		var p = c[i];
		var t = checkAt(p.x, p.y - 30);
		if ( t instanceof Auto)
		{
			this.dead = true;
		}
	}
};

Player.prototype.draw = function()
{
	this.pix = getPixels(cup, this.x, this.y);
	if (canvas.getContext)
	{
		for (var i = 0; i < this.pix.length; i++)
		{
			this.pix[i].draw("silver");
		}
	}
	this.check();
};

//PARED
function Pared(xa)
{
	this.x = xa;
	this.color = "black";
	this.pix = [];
	fill(this);
	entidades.push(this);
}

function fill(p)
{
	var ya = 0;
	var xa = p.x;
	while (ya < 22)
	{
		for (var yy = 0; yy < 3; yy++)
		{
			for (var yyy = 0; yyy < 3; yyy++)
			{
				p.pix.push(new Pixel(xa, ya * 10));
				ya++;
			}
			ya += 2;
		}
	}
	return ya;
	for (var i = 0; i < p.pix.length; i++)
	{
		if (p.pix[i].y > 240)
		{
			var e = p.indexOf(p.pix[i]);
			p.pix.splice(e, 1);
		}

	}
}

Pared.prototype.update = function()
{
	for (var i = 0; i < this.pix.length; i++)
	{
		this.pix[i].y += 10;
		if (this.pix[i].y == 240)
			this.pix[i].y = 0;
	}

};
Pared.prototype.draw = function()
{
	if (canvas.getContext)
	{
		for (var i = 0; i < this.pix.length; i++)
		{
			this.pix[i].draw(this.color);
		}
	}
};

//PIXEL
function Pixel(xa, ya, c, own)
{
	this.x = xa;
	this.y = ya;
	this.iColor = "#739858";
	this.color = c || "black";
	this.from = own;
}

Pixel.prototype.draw = function(c)
{
	if (c != null)
		this.color = c;
	pen.fillStyle = this.color;
	pen.fillRect(this.x, this.y, 10, 10);
	pen.fillStyle = this.iColor;
	pen.fillRect(this.x + 1, this.y + 1, 8, 8);
	pen.fillStyle = this.color;
	pen.fillRect(this.x + 2, this.y + 2, 6, 6);
};

//FUNCIONES UTILES.

//getPixels(): en base al X-Y junto con la orientacion
//del Player, devuelve un array con los pixeles que
//componen el grafico/sprite del Player.
function getPixels(array, xa, ya, owner)
{
	var p = [];
	var f = array;

	for (var aa = 0; aa < f.length; aa++)
	{
		for (var bb = 0; bb < f[aa].length; bb++)
		{
			if (f[aa][bb] != 0)
			{
				var pi = new Pixel(xa + bb * 10, ya + aa * 10);
				p.push(pi);

			}
		}
	}
	return p;
}

//draw(): se encarga de invocar la funcion draw() de
//cada objeto en el array entidades[].
function draw()
{
	if (canvas.getContext)
	{
		pen.fillStyle = "rgba(115, 152, 88, 0.9)";
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

//devuelve true/false de forma aleatoria.
function getRandomBoolean()
{
	return Math.random() < 0.5;
}

//update(): invoca el metodo update() en cada objeto
//del array entidades[] y luego hace un draw().
function update()
{
	loops++;
	spawnDelay--;
	var px = entidades.length;
	for (var i = 0; i < px; i++)
	{
		var p = entidades[i];
		if (p != undefined)
			p.update();
	}
	draw();
	if (cars % 10 == 0 && !lockLevel)
	{
		levelUp();
		lockLevel = true;
	}
	if (spawnDelay <= 0)
	{
		spawnDelay = 10;
		spawnCar();
	}
	var c = document.getElementById("cars");
	var v = document.getElementById("lives");
	var l = document.getElementById("level");

	c.innerHTML = cars;
	v.innerHTML = vidas;
	l.innerHTML = level;
}

function spawnCar()
{
	var _LEFT = 10;
	var _CENTER = 40;
	var _RIGHT = 70;
	var xa;
	var ya = -40;
	var r = Math.floor(Math.random() * 10);
	while (!(r <= 2))
	r = Math.floor(Math.random() * 10);
	var r2 = Math.floor(Math.random() * 10);
	while (!(r2 <= 2) && (r2 != r))
	r2 = Math.floor(Math.random() * 10);
	//alert("r = " + r + "\nr2 = " + r2);
	switch(r)
	{
		case 0:
			xa = _LEFT;
			break;
		case 1:
			xa = _CENTER;
			break;
		case 2:
			xa = _RIGHT;
			break;
	}
	if (r == r2)
	{
		new Auto(xa, ya);
		return;
	}
	new Auto(xa, ya);
	switch(r2)
	{
		case 0:
			xa = _LEFT;
			break;
		case 1:
			xa = _CENTER;
			break;
		case 2:
			xa = _RIGHT;
			break;
	}
	new Auto(xa, ya);
}

function levelUp()
{
	level++;
	if (delay > 30)
		delay -= 10;
}

function setFastMode()
{
	clearInterval(clock);
	clock = setInterval(function()
	{
		update();
	}, 20);
}

function setNormalMode()
{
	clearInterval(clock);
	clock = setInterval(function()
	{
		update();
	}, delay);
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
	}, delay);
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
	lockLevel = true;
	vidas = 5;
	level = 0;
	cars = 0;
	loops = 0;
	delay = 200;
	player = new Player(40, 180);
	wall1 = new Pared(0);
	wall2 = new Pared(100);
}