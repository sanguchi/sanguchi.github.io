var fps;        //contador de loops
var cubes = []; //array de los bloques rojos
var player;     //Jugador

player = new Blue(50,50);

//devuelve 1/0
function getB(){return Math.random()<0.5;}

 //devuelve un N entre 0-100 de 10 en 10
function getR()
{
    var rx = Math.floor(Math.random()*10);
    rx = rx*10;
    return rx;
}

function init(){
    
    for(var y = 0;y<5;y++)
    {
        for(var x =0;x<5;x++)
        {
            var i = cubes.length;
            var ya = -(y)*10;
            cubes[i] = new Wall(ya,getR());
        }
    }   
}

function Blue(ejex, ejey)
{
    this.x = ejex;
    this.y = ejey;   
}

Blue.prototype.up = function(){update('d');};
Blue.prototype.down = function(){update('u');};
Blue.prototype.left = function(){update('r');};
Blue.prototype.right = function(){update('l');};

function Wall(ejex, ejey)
{
    this.y = ejey || 0;
    this.x = ejex || getR();
    this.d = null;
}

//se encarga de mover los bloques.
Wall.prototype.update = function(dir) 
{
    this.d = dir;
    switch(this.d)
    {
        case'u':this.y-=10;break;
        case'd':this.y+=10;break;
        case'l':this.x-=10;break;
        case'r':this.x+=10;break;
    }
};

onkeydown = function(e)
{
  var up = 87;   //W
  var down = 83; //S
  var left = 65; //A
  var right = 68;//D
  var xb = 88;    //X
  var zb = 90;    //Z
  switch (e.keyCode)
  {
      case up:player.up();break;        // 10px arriba
      case down:player.down();break;    // 10px abajo
      case left:player.left();break;    // 10px izquierda
      case right:player.right();break;   // 10px derecha
  }
    loop();
    draw();
};

function draw()
{
        var canvas = document.getElementById('tutorial');
        if (canvas.getContext)
        {            
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "silver";//borra todo
            ctx.fillRect(0,0,100,100);
            ctx.fillStyle = "blue";
            ctx.fillRect(player.x,player.y,10,10);
            ctx.fillStyle = "red";
            for(var i=0;i< cubes.length;i++)
            {
                var s = cubes[i];
                ctx.fillRect(s.x,s.y,10,10);
            }
        }
}

/* Hace que los bloques que se salen de la pantalla
   vuelvan a su posicion original y les da un valor
   aleatorio por donde empezar.
*/
function update(dir)
{  
    for(var i=0;i<cubes.length;i++)
    {
        var c = cubes[i];           
        if(c.y == 100 && c.d == 'd')
        {
            c.y = -10;
            c.x = getR();
        }
        if(c.x == 100 && c.d == 'r')
        {
            c.x = -10;
            c.y = getR();
        }
        if(c.x == -10 && c.d == 'l')
        {
            c.x = 110;
            c.y = getR();
        }
        
        if(c.y == -10 && c.d == 'u')
        {
            c.y = 110;
            c.x = getR();
        }        
        c.update(dir);
    }
}

//Inicio de variables y juego
function start()
{ 
    var boton = document.getElementById('st');
    boton.disabled = true;
    fps = 0;
    init();
    draw();
}

//bucle principal del juego
function loop()
{ 
    fps++;
    var count = document.getElementById("ticks");
    count.innerHTML = fps;
    draw();
}