function Bullet(x, y){
  this.x = x;
  this.y = y;
  this.destroy = false;
  shoot.play();

  this.draw = function(){
    this.y -= dt * vBullet;
    for(var n = 0; n < walls.length ; n++){
      if(this.x > walls[n].x-ww2 && this.x < walls[n].x+ww2 && (this.y > walls[n].y-wh2 && this.y < walls[n].y+wh2*4)){
        this.destroy = true;
        walls[n].destroy = true;
        break;
      }
    }
    for(var n = 0; n < ufos.length ; n++){
      if(this.x > ufos[n].x-w2 && this.x < ufos[n].x+w2 && this.y > ufos[n].y-h2 && this.y < ufos[n].y+h2*2){
        score++;
        append(booms, new Boom(this.x, this.y, 500));
        this.destroy = true;
        ufos[n].destroy = true;
        invaderKilled.play();
        break;
      }
    }
    if(this.y < 0) destroy = true;
    ellipse(this.x, this.y, 5, 5);
  }
}

function UfoBullet(x, y){
  this.destroy = false;
  this.x = x;
  this.y = y;
  invader.play();

  this.draw = function(){
    this.y += dt * vBullet;
    for(var n = walls.length-1; n >= 0; n--){
      if(this.x > walls[n].x-ww2 && this.x < walls[n].x+ww2 && this.y > walls[n].y-wh2*4 && this.y < walls[n].y+wh2){
        this.destroy = true;
        walls[n].destroy = true;
        break;
      }
    }
    if(this.x > p.x-w2 && this.x < p.x+w2 && this.y > p.y-h2 && this.y < p.y+h2 && p.ind <= 0){
      lives--;
      append(booms, new Boom(p.x, p.y, 1000));
      explosion.play();
      p = new Player(width/2, height-10);
    }
    if(y > height) this.destroy = true;
    rect(this.x, this.y, 3, 7);
  }
}

function Boom(x, y, t){
  this.x = x;
  this.y = y;
  this.t = t;
  this.ti = t;
  this.destroy = false;

  this.draw = function(){
    var d = (this.ti-this.t)*0.08;
    ellipse(this.x, this.y, d, d);
    this.t -= dt;
    this.destroy = this.t < 0;
  }
}
