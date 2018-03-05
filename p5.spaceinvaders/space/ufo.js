function Ufo(x, y, i){
  this.x = x;
  this.y = y;
  this.i = i;
  this.destroy = false;

  this.update = function(){
    this.x += vUfo * dt;
    this.y += vvUfo * dt;
    if(random(1000) < initialUfos/ufos.length) append(ufoBullets,new UfoBullet(this.x, this.y-h2));
    if(this.y >= height-h2) lives = 0;
  }

  this.draw = function(){
    image(ships[this.i], this.x, this.y);
  }
}

function UfoBox(){
  this.left;
  this.right;
  this.down = 0;

  this.update = function(){
    this.left = width;
    this.right = 0;
    for (var n = 0; n < ufos.length; n++){
      this.left = min(this.left, ufos[n].x-w2);
      this.right = max(this.right, ufos[n].x+w2);
    }
    if(this.down >= 0) this.down -= vvUfo*dt;
    if((this.left <= 0 || this.right >= width) && vUfo != 0){
      this.down = h;
      vUfo = 0;
      vvUfo = 0.05;
      vUfoA = vUfoA + 0.01;
    }
    if(vUfo == 0 && this.down <= 0){
      if(this.left <= 0){
        vUfo = vUfoA;
        vvUfo = 0;
      }
      else{
        vUfo = -vUfoA;
        vvUfo = 0;
      }
    }
  }
}
