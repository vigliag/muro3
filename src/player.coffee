class window.muro3.Player
  constructor: (@stage, assets) ->
    @standingBitmap = new createjs.Bitmap(assets.playerStanding)
    @chargedBitmap = new createjs.Bitmap(assets.playerCharged)
    @position = 1
    @charged = false
    @previousState = "standing"
  
  addToStage: =>
    @drawing = @stage.addChild(@standingBitmap)

  update: => 
    if @charged && @previousState=="standing"
      @stage.removeChild(@drawing);
      @drawing = @stage.addChild(@chargedBitmap);
      @previousState = "charged";

    if !@charged && @previousState == "charged"
      @stage.removeChild(@drawing);
      @drawing = @stage.addChild(@standingBitmap);
      @previousState = "standing";

  charge : => 
    @charged = true

  uncharge : => 
    @charged = false

