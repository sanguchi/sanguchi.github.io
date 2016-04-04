/**
 * @author Peka
 */

//13-Sept: Empece a las 23:27
var clock;
var last = 0;
var colores = [];
var secuencia = [];
var running = false;
var score = 0;
var esperando = false;
var level = 3;
var score = 0;
var index = 0;
var check = 0;
var waitDelay = 6;
var current = null;
var locked = true;
var red = document.getElementById('red');
var blue = document.getElementById('blue');
var green = document.getElementById('green');
var yellow = document.getElementById('yellow');
colores[0] = red;
colores[1] = blue;
colores[2] = green;
colores[3] = yellow;

red.onclick = function()
{
	click(0);
};
blue.onclick = function()
{
	click(1);
};
green.onclick = function()
{
	click(2);
};
yellow.onclick = function()
{
	click(3);
};
function init()
{
	for (var i = 0; i < 3; i++)
	{
		secuencia[i] = getRand();
	}
}

function getRand()
{
	var r = Math.floor(Math.random() * 10);
	while ((r > 3) || (r == last))
	{
		r = Math.floor(Math.random() * 10);
	}
	last = r;
	return r;
}

//alert(secuencia);
var delay = 0;
function update()
{
	if (running && !esperando)
	{
		if (delay >= 5)
		{
			delay = 0;
			colores[secuencia[index]].style.opacity = "0.8";
			index++;
		}
		if (index == secuencia.length)
		{
			esperando = true;
			return;
			index = 0;
		}

		var local = colores[secuencia[index]];
		delay++;
		var op = (delay * 2) / 10;
		local.style.opacity = op;
	}
	if (running && esperando)
	{
		if (check == secuencia.length)
		{
			if (waitDelay > 4)
			{
				document.getElementById("turno").innerHTML = "Muy Bien!";
			}
			else
			{
				document.getElementById("turno").innerHTML = "Calculando...";
			}

			if (waitDelay == 0)
			{
				waitDelay = 6;
				check = 0;
				esperando = false;
				secuencia.push(getRand());
				//alert(secuencia);
				document.getElementById("turno").innerHTML = "Tu Turno.";
			}
			waitDelay--;
		}
		if ((current != null) && (!locked))
		{
			if (current == secuencia[check])
			{
				check++;
				locked = true;
				score++;
				index = 0;
			}
			else
			{
				alert("Perdiste!");
				reset();
			}

		}
	}
	var s = document.getElementById("score");
	s.innerHTML = score;
	if (esperando)
	{
		document.getElementById("turno").style.display = "block";
	}
	else
	{
		document.getElementById("turno").style.display = "none";
	}
}

function click(a)
{
	if (running && esperando)
	{
		//alert("click numero " + a);
		current = a;
		locked = false;
	}
}

function start()
{
	init();
	running = true;
	document.getElementById('reset').disabled = false;
	document.getElementById('start').disabled = true;
	//esto ejecuta update() cada 0.25 segundos.
	clock = setInterval(function()
	{
		update();
	}, 250);
}

//stop(): hace lo contrario que start() :v
function stop()
{
	reset();
	document.getElementById("turno").style.display = "none";
}

function reset()
{
	running = false;
	clearInterval(clock);
	document.getElementById('reset').disabled = true;
	document.getElementById('start').disabled = false;
	secuencia = [];
	delay = 0;
	index = 0;
	check = 0;
	score = 0;
	esperando = false;
	current = null;
	locked = true;
}