function Player(x, y){
  this.x = x;
  this.y = y;
  this.ind = 5000;//Indestrutível durante 5000 ms
  this.left = false;
  this.right = false;
  this.fire = false;

  this.update = function(){
    if(this.left) this.x = max(w2, this.x - v * dt);
    if(this.right) this.x = min(width - w2, this.x + v * dt);
  }

  this.draw = function(){
    if(this.ind > 0){
      if(int(this.ind/300) % 2 == 0) image(ship, this.x, this.y);
      this.ind -= dt;
    }
    else image(ship, this.x, this.y);
  }

  this.playerMove = function() {
    if (inData == 48) {
      this.left = true;
      this.right = false;
    }
    if (inData == 49) {
      this.right = true;
      this.left = false;
    }
    if(inData == 115 && !this.fire) {
      this.fire = true;
      append(bullets, new Bullet(this.x, this.y-h2));
    }
    this.fire = false;
  }

  this.keyPressed = function(){
    if (keyCode == LEFT_ARROW) this.left = true;
    if (keyCode == RIGHT_ARROW) this.right = true;
    if(((keyCode == CONTROL ) || (key == 'Z')) && !this.fire){this.fire = true; append(bullets, new Bullet(this.x, this.y-h2));}
  }

  this.keyReleased = function(){
    if (keyCode == LEFT_ARROW) this.left = false;
    if (keyCode == RIGHT_ARROW) this.right = false;
    if ((keyCode == CONTROL) || (key == 'Z')) this.fire = false;
  }
}
