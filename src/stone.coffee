class window.muro3.Stone
  constructor: (position, stage, assets)->
    @position = position
    @drawing = stage.addChild(new createjs.Bitmap(assets.stone))
    @drawing.y = 95

  update: => 
    @drawing.y += 2

