var canvas = document.getElementById('tetris');
var pen = canvas.getContext('2d');
var loop;
var lcd;
var fondo = [];
var entidades = [];
var efectos = [];

var mapa = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1]
];
var running = false;
//var pixeles = [];
var player = new Pixel(50, 50);
player.bColor = "red";
player.iColor = "#739858";
player.rColor = "red";
entidades.push(player);
//entidades.push(pixeles);
var clock;

onkeydown = function (e) {
    //alert(e.keycode)
    var up = 87; //W
    var down = 83; //S
    var left = 65; //A
    var right = 68; //D
    var xb = 88; //X
    var zb = 90; //Z
    if (running) {
        switch (e.keyCode) {
            case up:
                player.up();
                break; // 10px arriba
            case down:
                player.down();
                break; // 10px abajo
            case left:
                player.left();
                break; // 10px izquierda
            case right:
                player.right();
                break; // 10px derecha
        }
        draw();
    }
};

function Pixel(ex, ey, tipo) {
    this.x = ex || 0;
    this.y = ey || 0;
    this.vx = 0;
    this.vy = 0;
    this.blink = false;
    this.bColor = "rgba(0, 0, 0, 1)";
    this.iColor = "#739858";
    this.rColor = "rgba(0, 0, 0, 1)";
    this.enabled = true;
    this.face = null;
    this.shape = '1';
    this.tipo = tipo || 'wall';
    switch(this.tipo){
        case 'wall':{
            this.bColor = "#969696";
            this.rColor = "#969696";}break;
        case 'void':{
            this.bColor = "#739858";
            this.rColor = "#739858";}break;
        case 'solid':{
            this.bColor = "black";
            this.rColor = "black";}break;
        case 'special':{
            this.bColor = "white";
            this.rColor = "white";}break;
    }
}
Pixel.prototype.up = function () {
    if (this.y > 0) this.y -= 10;
};
Pixel.prototype.down = function () {
    if (this.y < canvas.height - 10) this.y += 10;
};
Pixel.prototype.left = function () {
    if (this.x > 0) this.x -= 10;
};
Pixel.prototype.right = function () {
    if (this.x < canvas.width - 10) this.x += 10;
};

Pixel.prototype.update = function () {
    if (canvas.getContext) {
        pen.fillStyle = this.bColor;
        pen.fillRect(this.x, this.y, 10, 10);
        pen.fillStyle = this.iColor;
        pen.fillRect(this.x + 1, this.y + 1, 8, 8);
        pen.fillStyle = this.rColor;
        pen.fillRect(this.x + 2, this.y + 2, 6, 6);
    }
};

function draw() {

    if (canvas.getContext) {

        pen.fillStyle = "rgba(115, 152, 88, 0.9)";
        pen.fillRect(0, 0, 110, 220);
        //dibuja la decoracion
        for(var y = 0; y < fondo.length; ++y){
            for(var x = 0; x < fondo[y].length; ++x){
                fondo[y][x].update();}}
        //dibuja los entidades
        var px = entidades.length;
        for (var i = 0; i < px; i++) {
            var p = entidades[i];
            p.update();
        //dibuja los efectos
            /*
                pen.fillStyle = p.bColor;
                pen.fillRect(p.x,p.y,10,10);
                pen.fillStyle = p.iColor;
                pen.fillRect(p.x+1,p.y+1,8,8);
                pen.fillStyle = p.rColor;
                pen.fillRect(p.x+2,p.y+2,6,6);
                */
        }
    }
}

function start() {
    running = true;
    document.getElementById('stop').disabled = false;
    document.getElementById('start').disabled = true;
    clock = setInterval(function () {
        draw();
    }, 1000);
}

function stop() {
    running = false;
    clearInterval(clock);
    document.getElementById('stop').disabled = true;
    document.getElementById('start').disabled = false;
}