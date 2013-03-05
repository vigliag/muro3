class window.muro3.Zombie
  constructor: (@position, stage, assets)->
    @drawing = stage.addChild(new createjs.Bitmap(assets.zombie));
    @speed = (Math.random() * 1) + 0.5;
    @drawing.y = 560;
  
  update: => 
    @drawing.y -= @speed;
    
