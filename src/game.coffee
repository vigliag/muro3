window.muro3 = window.muro3 || {}

class window.muro3.Game
  constructor: (@canvas, @stage)->
      #divido lo schermo in 13 parti (posizioni disponibili)
      #TODO rimuovere
      @config = window.muro3.config
      @colWidth = Math.floor(@config.width/13)
      remainder = @config.width%13
      @leftMargin = Math.floor(remainder/2)

      @scaleInfo =
        ratio: 1
        currentWidth: @config.width
        currentHeight: @config.height

      @ladderPositions = [2,5,7,9]

      @scoreDisplay = new createjs.Text("", "bold 17px Arial", "#000000")
      @scoreDisplay.x = 20
      @scoreDisplay.y = 3


      #@scaleDisplay()
      #window.addEventListener("resize", @scaleDisplay, false)

      #key mapping
      @shoot = false
      @moveLeft = false
      @moveRight = false


      createjs.Ticker.useRAF = true
      createjs.Ticker.setFPS(@config.fps)

  scaleDisplay: =>
        @scaleInfo.currentWidth = window.innerWidth
        @scaleInfo.currentHeight = @scaleInfo.currentWidth * (@config.height/@config.width)

        if @scaleInfo.currentHeight > window.innerHeight
          @scaleInfo.currentHeight = window.innerHeight
          @scaleInfo.currentWidth = @scaleInfo.currentHeight * (@config.width/@config.height)

        @canvas.style.width = @scaleInfo.currentWidth + 'px'
        @canvas.style.height = @scaleInfo.currentHeight + 'px'

  getXPos : (position) ->
        @leftMargin + (position * @colWidth)

  gameOver : =>
        alert("Game Over. You scored " + @score + " points")
        @init()

  drawScore: =>
    @scoreDisplay.text = "Score: " + @score;

  touchToAction: ( evt ) =>
    middleX = @scaleInfo.currentWidth/2
    middleY = @scaleInfo.currentHeight/2

    if ( evt.stageY > middleY )
      @moveLeft=false;
      @moveRight=false;
      @shoot = true;
    else
      if( evt.stageX > middleX )
        @shoot = false;
        @moveLeft = false;
        @moveRight = true;
      else
        @shoot = false;
        @moveRight = false;
        @moveLeft = true;

    return false;

  keyToAction: (e) =>
    switch e.keyCode
      when 37 #left arrow
        @moveLeft = true;
        @moveRight = false;
      when 39 #right arrow
        @moveRight = true;
        @moveLeft = false;
      when 40
        @shoot = true;
      when 32 #space
        @shoot = true;
      when 80 #p
        createjs.Ticker.paused = !(createjs.Ticker.paused);

    return false

  gameTick: (evt)=>

    if evt.paused
      return

    if @player.position == 0 or @player.position == 12
      @player.charge()
      @shoot = false

    if @moveRight and @player.position < 12
      @player.position +=1
      @moveRight = false

    if @moveLeft and @player.position > 0
      @player.position -= 1
      @moveLeft = false

    if @shoot and @player.charged
      @player.uncharge()
      nstone = new window.muro3.Stone(@player.position, @stage, @assets)
      @stones.push nstone
      nstone.drawing.x = @getXPos(nstone.position)+20;

      @shoot = false

    if Math.random()<0.02
      @addZombie(@ladderPositions)

    @player.update()
    @player.drawing.y = 34;
    @player.drawing.x = @getXPos(@player.position);

    #aggiorno tutti gli zombie
    for zombie in @zombies
      zombie.update()
      if zombie.drawing.y < 100
        @gameOver()

    for stone in @stones
      stone.update()
      if stone.drawing.y > 600
        stone.toRemove = true

      for zombie in @zombies
        if stone.position == zombie.position and ( stone.drawing.y - zombie.drawing.y ) > 0
          zombie.toRemove = true
          stone.toRemove = true
          @score++

    newStones = []
    for stone in @stones
      if stone.toRemove
        @stage.removeChild(stone.drawing)
      else
        newStones.push(stone)

    newZombies = []
    for zombie in @zombies
      if zombie.toRemove
        @stage.removeChild(zombie.drawing)
      else
        newZombies.push(zombie)

    @stones = newStones
    @zombies = newZombies

    #disegno
    @drawScore(@score)
    @stage.update()

  addZombie : =>
          position = @ladderPositions[ Math.floor( ( Math.random() * @ladderPositions.length) ) ]
          newzombie = new window.muro3.Zombie(position, @stage, @assets)
          newzombie.drawing.x = @getXPos(position)
          @zombies.push(newzombie)

  init: =>
        @assets = window.muro3.assets
        console.dir(@assets)

        @stage.clear();
        @zombies = []
        @stones = []
        @score = 0

        #Disegno lo sfondo
        @stage.addChild(new createjs.Bitmap(@assets.bg))

        @stage.addChild(@scoreDisplay);

        #Aggiungo (e disegno) il giocatore
        @player = new window.muro3.Player(@stage, @assets)
        @player.addToStage()

        addLadder = (position)=>
          newLadder = @stage.addChild(new createjs.Bitmap(@assets.ladder))
          newLadder.x = @getXPos(position)
          newLadder.y = 110


        #Disegno le scale
        addLadder position for position in @ladderPositions

        document.onkeydown = @keyToAction;

        preventDefault = (e)=>
          e.preventDefault()

        #window.addEventListener('touchmove', preventDefault)
        #window.addEventListener('touchend', preventDefault)

        @stage.on 'stagemousedown', (e)=>
            #e.preventDefault();
            @touchToAction(e);
            #return false;

        #window.addEventListener 'touchstart', (e)=>
        #  e.preventDefault();
        #  @touchToAction(e.touches[0]);
        #  return false;

        #avvio il ciclo principale
        createjs.Ticker.removeAllEventListeners()
        createjs.Ticker.addEventListener('tick', @gameTick)
