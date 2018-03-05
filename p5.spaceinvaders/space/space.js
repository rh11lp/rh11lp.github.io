var myCanvas;
var game;
var font;
var ship;//Imagem
var ships = [];//Imagens
var song;
var explosion, invaderKilled, shoot, invader;
var p;//Player
var ufoBox;
var ufos = [];
var booms = [];
var walls = [];
var bullets = [];
var ufoBullets = [];
var stars = [];
var v = 0.1;//Player speed
var vUfoA;//Updated Ufos speed
var vUfo;//Initial Ufos speed
var vvUfo;//Vertical Ufos speed
var d = 30;//Distance between Ufos
var h = 10;//Ufos vertical movement
var w2 = 10;//Ufos half-width
var h2 = 7.5;//Ufos half-height
var ww2 = 5;//Blocks half-width
var wh2 = 3.75;//Blocks half-height
var vBullet = 0.15;//Bullet speed
var lives;
var score;
var initialUfos;
var dt;
var pTime;

function preload(){
  font = loadFont("space/data/minecrafter_3.ttf");
  song = loadSound("space/data/song.mp3");
  explosion = loadSound("space/data/explosion.wav");
  invaderKilled = loadSound("space/data/invaderkilled.wav");
  shoot = loadSound("space/data/shoot.wav");
  invader = loadSound("space/data/invader.wav");
  ship = loadImage("space/data/player.png");
  ships[0] = loadImage("space/data/alien1.png");
  ships[1] = loadImage("space/data/alien2.png");
  ships[2] = loadImage("space/data/alien3.png");
}

function setup() {

  serial = new p5.SerialPort();    // make a new instance of the serialport library
  serial.on('data', serialEvent);  // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.open('COM3');           // open a serial port

  myCanvas = createCanvas(600, 450);
  myCanvas.parent('myContainer');
  ellipseMode(CENTER);
  rectMode(CENTER);
  imageMode(CENTER);
  textFont(font);
  textAlign(RIGHT);
  pTime = millis();
  ship.resize(w2*2, h2*2);
  ships[0].resize(w2*2, h2*2);
  ships[1].resize(w2*2, h2*2);
  ships[2].resize(w2*2, h2*2);
  for(var n = 0; n < 20; n++) stars[n] = new Star();
  ufoBox = new UfoBox();
  startGame();
  game = false;
  song.loop();
}

function serialError(err) {
  console.log('Something went wrong with the serial port: ', err);
}

function draw() {
  dt = millis() - pTime;
  pTime = millis();
  background(0);
  for(var n = 0; n < stars.length; n++) stars[n].draw();
  fill(255);
  removeObjects();
  drawScore();
  p.draw();
  for(var n = 0; n < walls.length; n++) walls[n].draw();
  for(var n = 0; n < ufos.length; n++) ufos[n].draw();
  for(var n = 0; n < bullets.length; n++) bullets[n].draw();
  for(var n = 0; n < ufoBullets.length; n++) ufoBullets[n].draw();
  for(var n = 0; n < booms.length; n++) booms[n].draw();
  if(game){
    p.update();
    for(var n = 0; n < ufos.length; n++) ufos[n].update();
    ufoBox.update();
    if(ufos.length == 0) createUfos();
    game = lives > 0;
  }
  else drawIntro();
}

function keyPressed(){
  if(game) p.keyPressed();
  else if(keyCode == SHIFT) startGame();
}

function keyReleased(){
  if(game) p.keyReleased();
}

function createUfos(){
  vUfoA = 0.05;
  vUfo = 0.05;
  vvUfo = 0;
  ufos = [];
  for(var m = 0; m < 6; m++)
    for(var n = 0; n < 12; n++) append(ufos, new Ufo(d + d * n, d + d * m, m % 3));
  initialUfos = ufos.length;
}

function startGame(){
  lives = 3;
  score = 0;
  p = new Player(width/2, height-10);
  createWalls();
  createUfos();
  game = true;
}

function drawIntro(){
  textAlign(CENTER);
  textSize(42);
  fill(160);
  text("SPACE INVADERS", width/2, height*3/5);
  textSize(12);
  if(score == 0){
    switch(int(millis()/5000) % 5){
      case 0: text("(c) 2016 Caldas Lopes. All rights reserved", width/2, height*2/3); break;
      case 1: text("Released under the GNU General Public License (Version 3)", width/2, height*2/3); break;
      case 2: text("MineCrafter 3 font by MadPixel / CC BY ND", width/2, height*2/3); break;
      case 3: text("Keys: LEFT, RIGHT, CONTROL or Z", width/2, height*2/3); break;
      case 4: text("Press SHIFT to Start", width/2, height*2/3); break;
    }
  }
  else{
    switch(int(millis()/5000) % 3){
      case 0: text("Final Score: " + score, width/2, height*2/3); break;
      case 1: text("Keys: LEFT, RIGHT, CONTROL or Z", width/2, height*2/3); break;
      case 2: text("Press SHIFT to Start", width/2, height*2/3); break;
    }
  }
  fill(255);
  textSize(6);
}

function drawScore(){
  for(var n = 0; n < lives; n++) image(ship, w2+n*w2*2, w2, w2, h2);
  text(score, width-w2*2, w2*2);
}

function createWalls(){
  walls = [];
  for(var k = -2; k < 3; k++)
    for(var l = -2; l < 3; l++)
      for(var m = 0; m < 7; m++)
        append(walls, new Wall(width/2 + l*ww2*2 + k*ww2*20, height-h2*4-m*wh2*2));
}

function removeObjects(){
  for (var n = booms.length-1; n >= 0; n--) if(booms[n].destroy) booms.splice(n, 1);
  for (var n = walls.length-1; n >= 0; n--) if(walls[n].destroy) walls.splice(n, 1);
  for (var n = ufos.length-1; n >= 0; n--) if(ufos[n].destroy) ufos.splice(n, 1);
  for (var n = bullets.length-1; n >= 0; n--) if(bullets[n].destroy) bullets.splice(n, 1);
  for (var n = ufoBullets.length-1; n >= 0; n--) if(ufoBullets[n].destroy) ufoBullets.splice(n, 1);
}

function mousePressed() {
  var fs = fullScreen();
  fullScreen(!fs);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
