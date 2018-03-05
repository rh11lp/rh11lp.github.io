function Wall(x, y){
  this.x = x;
  this.y = y;
  destroy = false;

  this.draw = function(){
    rect(this.x, this.y, ww2*2, wh2*2);
  }
}
