var fps;        //contador de loops
var clock;          //variable del timer
var lose = false;

var cubes = []; //array de los bloques rojos
var player;
player = new Blue(50,50);
function getB(){return Math.random()<0.5;} //devuelve 1/0

function getR() //devuelve un N entre 0-100 de 10 en 10
{
    var rx = Math.floor(Math.random()*10);
    rx = rx*10;
    return rx;
}
function getVel(){
var hd = document.getElementById("hard");
    var h = hd.checked;
    //alert("H = " + h);
    if(h){vel = 150;}
    else{vel = 400;}
    return vel;
}



function init(){
    
    for(var y = 0;y<5;y++){
        for(var x =0;x<5;x++){
            var i = cubes.length;
            var ya = -(y)*10;
            cubes[i] = new Bala('d',ya,getR());
        }}
    /* 
    for(var i = 0; i<9;i++)
    {
        cubes[i] = new Bala('l');
    }
    for(var a = 0; a<5;a++)
    {
        cubes[a+9] = new Bala('d');
    }
    for(var b = 0; b<5;b++)
    {
        cubes[b+14] = new Bala('u');
    }
    for(var c = 0; c<5;c++)
    {
        cubes[c+19] = new Bala('r');
    }
    */
}

function Blue(ejex, ejey){
    this.x = ejex;
    this.y = ejey;   
}
//Blue.prototype.draw = function(){};
Blue.prototype.up = function(){if(this.y>0)this.y-=10;};
Blue.prototype.down = function(){if(this.y<90)this.y+=10;};
Blue.prototype.left = function(){if(this.x>0)this.x-=10;};
Blue.prototype.right = function(){if(this.x<90)this.x+=10;};

function Bala(dir, ejex, ejey)
{
    this.y = ejey || 0;
    this.x = ejex || getR();
    this.d = dir || 'd';
}

//se encarga de mover los bloques.
Bala.prototype.update = function() 
{
    switch(this.d)
    {
        case'u':this.y-=10;break;
        case'd':this.y+=10;break;
        case'l':this.x-=10;break;
        case'r':this.x+=10;break;
    }
};

//var shoot = new Bala(getR());

//alert(shoot.x);
onkeydown = function(e)
{
    //alert(e.keycode)
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
function update()
{
    if(fps%50 === 0){
        //alert("rotando");
        for(var a = 0; a<cubes.length;a++){
            var p = cubes[a];
            switch(p.d){
                case'd':p.d = 'r';break;
                case'r':p.d = 'u';break;
                case'u':p.d = 'l';break;
                case'l':p.d = 'd';break;
            }
        }
    }
        
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
        
        c.update();
    }
}
/* Chequea que los bloques no hayan tocado al personaje
   y en caso de colision, termina el juego y llama a 
   las funciones necesarias.
*/
function check()
{
    var px = player.x;
    var py = player.y;
    for(var i=0;i<cubes.length;i++)
    {
        var c = cubes[i];
        if(c.y == player.y && c.x == player.x)
        {
            alert("PERDISTE\nPuntos = " + fps);
            cubes = [];
            player.x = 50;
            player.y = 50;
            stop();
        }
    }
}

function start(){ //Inicio de variables y juego
    var boton = document.getElementById('st');
    boton.disabled = true;
    fps = 0;
    init();
    draw();
    clock = setInterval(function(){loop();}, getVel());
}
function stop(){
    var boton = document.getElementById('st');
    clearInterval(clock);
    boton.disabled = false;
}


function loop(){ //bucle principal del juego
    fps++;
    check();
    update();
    var count = document.getElementById("ticks");
    count.innerHTML = fps;
    draw();
}