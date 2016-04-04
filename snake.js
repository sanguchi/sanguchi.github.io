/**
 * @author SevenDemons
 */

//Declaracion de variables globales.
var canvas = document.getElementById('snake');
var pen = canvas.getContext('2d');
var entidades = [];
var running = false;
var clock;
var loops = 0;
var level = 0;
var vidas = 4;
var puntos = 0;
var delay = 500;
var _UP = 0;
var _RIGHT = 1;
var _DOWN = 2;
var _LEFT = 3;
var canMove = false;

//Declaracion del jugador.
var player = new Player();
var apple = new Punto();
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
			//arriba
			case up:
				player.up();
				break;
			//arriba - W
			case wkey:
				player.up();
				break;
			//derecha - D
			case dkey:
				player.right();
				break;
			//derecha
			case right:
				player.right();
				break;
			//abajo
			case down:
				player.down();
				break;
			//abajo - S
			case skey:
				player.down();
				break;
			//izquierda
			case left:
				player.left();
				break;
			//izquierda - A
			case akey:
				player.left();
				break;
		}
		draw();
		update();
	}
};

//PUNTOS
function Punto(xa, ya)
{
	this.x = xa || 50;
	this.y = ya || 100;
	entidades.push(this);
	this.pix = new Pixel(this.x, this.y);
	this.delay = 5;
}

Punto.prototype.up = function()
{
	if (this.y > 0)
		this.y -= 10;
};

Punto.prototype.right = function()
{
	if (this.x < 100)
		this.x += 10;
};

Punto.prototype.down = function()
{
	if (this.y < 210)
		this.y += 10;
};

Punto.prototype.left = function()
{
	if (this.x > 0)
		this.x -= 10;
};

Punto.prototype.update = function()
{
	var t = checkAt(this.x, this.y);
	if (t != null)
		if ( t instanceof Player)
		{
			t.grow();
			this.remove();
		}
	if (canMove)
	{
		if (this.delay <= 0)
		{
			this.delay = 5;
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
		}
		else
			this.delay--;
	}
};

Punto.prototype.draw = function()
{
	this.pix = new Pixel(this.x, this.y);
	if (canvas.getContext)
	{
		this.pix.draw("red");
	}
};

Punto.prototype.remove = function()
{
	puntos++;
	var xa = Math.floor(Math.random() * 10);
	if (xa == 0)
		xa++;
	var ya = Math.floor(Math.random() * 20);
	if (ya == 0)
		ya++;
	this.x = xa * 10;
	this.y = ya * 10;
	//alert("x = " + this.x + "\ny = " + this.y);
	this.pix = null;
	this.pix = [];
	this.pix.push(new Pixel(this.x, this.y));
	lockLevel = false;
	levelUp();
};
//PLAYER

function Player()
{
	this.x = 40;
	this.y = 220 - 40;
	this.pix = [];
	entidades.push(this);
	this.dead = false;
	this.body = [];
	this.pix.push(new Pixel(this.x, this.y));
	this.pix.push(new Pixel(this.x, this.y + 10));
	this.dir = _UP;
	this.tail = this.pix[this.pix.length - 1];
	this.toGrow = false;
}

Player.prototype.right = function()
{
	if (this.dir != _LEFT)
		this.dir = _RIGHT;
};

Player.prototype.left = function()
{
	if (this.dir != _RIGHT)
		this.dir = _LEFT;
};

Player.prototype.down = function()
{
	if (this.dir != _UP)
		this.dir = _DOWN;
};

Player.prototype.up = function()
{
	if (this.dir != _DOWN)
		this.dir = _UP;
};

Player.prototype.update = function()
{
	var head = this.pix.shift();
	switch(this.dir)
	{
		case _UP:
			this.y -= 10;
			break;
		case _RIGHT:
			this.x += 10;
			break;
		case _DOWN:
			this.y += 10;
			break;
		case _LEFT:
			this.x -= 10;
			break;
	}
	if (this.x <= -10 && this.dir == _LEFT)
		this.x = 100;
	if (this.x >= 110 && this.dir == _RIGHT)
		this.x = 0;
	if (this.y <= -10 && this.dir == _UP)
		this.y = 210;
	if (this.y >= 220 && this.dir == _DOWN)
		this.y = 0;
	if (this.toGrow)
		this.pix.unshift(new Pixel(head.x, head.y));
	head.y = this.y;
	head.x = this.x;
	this.pix.push(head);
	this.toGrow = false;
	if (vidas <= 0)
	{
		alert("Game Over :v \nPuntos = " + puntos);
		reset();
	}
};

Player.prototype.grow = function()
{
	this.toGrow = true;
};
Player.prototype.check = function()
{
	var head = this.pix.pop();
	this.body = this.pix;
	for (var i = 0; i < this.body.length; i++)
	{
		var b = this.body[i];
		if (b.x == head.x && b.y == head.y)
			vidas--;
		//alert("colision");
	}
	this.pix.push(head);
};

Player.prototype.draw = function()
{
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
	entidades.push(this);
}

Pared.prototype.update = function()
{
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
	draw();
	loops++;
	var px = entidades.length;
	for (var i = 0; i < px; i++)
	{
		var p = entidades[i];
		if (p != undefined)
			p.update();
	}

	var c = document.getElementById("points");
	var v = document.getElementById("lives");

	c.innerHTML = puntos;
	v.innerHTML = vidas;

}

function spawnApple()
{

	for (var i = 0; i < entidades.length; i++)
	{
		if (entidades[i] instanceof Punto)
			entidades[i] == null;
	}
	var xa = Math.floor(Math.random() * 10);
	if (xa == 0)
		xa += 10;
	var ya = Math.floor(Math.random() * 10);
	if (ya == 0)
		ya += 10;
	//alert("xa = " + xa * 10 + "\nya = " + ya * 10);
	entidades.push(new Punto(xa * 10, ya * 10));
}

function levelUp()
{
	level++;
	if (delay > 40)
		delay -= 20;
	clearInterval(clock);
	clock = setInterval(function()
	{
		update();
	}, delay);
	if (level >= 10)
		canMove = true;
}

//start(): Obviamente, inicia el juego, y deshabilita
//el boton START para evitar bugs. Tambien habilita
//el boton STOP para pausar la partida.
function start()
{
	running = true;
	document.getElementById('stop').disabled = false;
	document.getElementById('start').disabled = true;
	//esto ejecuta update() cada 0.2 segundos.
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
	stop();
	entidades = null;
	entidades = [];
	canMove = false;
	puntos = 0;
	level = 0;
	vidas = 5;
	loops = 0;
	delay = 500;
	player = new Player(40, 180);
	apple = new Punto();
}