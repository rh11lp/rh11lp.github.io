function Star(){
  this.reset = function(){
    this.y = -random(height);
    this.x = random(width);
    this.v = 0.1 + random(0.2);
    this.c = color(random(255), random(255), random(255));
  }
  this.reset();

  this.draw = function(){
    this.y += dt * v;
    if(this.y > height) this.reset();
    fill(this.c);
    ellipse(this.x, this.y, 5, 5);
  }
}
