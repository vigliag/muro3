 
    //Classe principale
    function Game(gameContainer){
    
      var config = {
        width: 800,
        height: 600,
        fps : 30
      };
      
     
      
      var assets = {};

      
      var //variabili globali
        canvas,
        stage,
        loadingText,
        preload;
      
      //caricamento
      
      canvas = document.createElement('canvas');
      canvas.width = config.width;
      canvas.height = config.height;
      
      gameContainer.appendChild(canvas);
      
      stage = new createjs.Stage(canvas);
      
      //display loading screen
      loadingText = new createjs.Text("Loading", "bold 24px Arial", "#000000");
      loadingText.y = 50;
      loadingText.x = config.width/3;
      stage.addChild(loadingText);
      stage.update();
      
      //start loading content
      preload = new createjs.PreloadJS();
      preload.loadManifest(manifest);
      
      //loading files in assets
      preload.onFileLoad = function(e){
        switch(e.type)
        {
          case createjs.PreloadJS.IMAGE:
            var newImg = new Image();
            newImg.src = e.src;
            assets[e.id] = newImg
            break;
        }
      }
      
      var colWidth,
        remainder,
        initial;
        
      //divido lo schermo in 13 parti (posizioni disponibili)
      colWidth = Math.floor(config.width/13);
      remainder = config.width%13;
      
      console.log("width " + colWidth);
      console.log("remainder" + remainder);
      
      //quello che rimane lo divido (pixel più pixel meno) tra bordo destro e sinistro
      initial = Math.floor(remainder/2);
      
      //funzione per ricavare la x data la posizione (indicizzata da 0 a 12)
      var getXPos = function(position){
        return initial + (position * colWidth);
      }
      
      var scaleInfo = {
        ratio: 1,
        currentWidth: 0,
        currentHeight: 0
      }
      
      function scaleDisplay(){
        scaleInfo.currentWidth = window.innerWidth;
        scaleInfo.currentHeight = scaleInfo.currentWidth * (config.height/config.width);
        if(scaleInfo.currentHeight>window.innerHeight){
          scaleInfo.currentHeight=window.innerHeight;
          scaleInfo.currentWidth = scaleInfo.currentHeight * (config.width/config.height);
        }
        canvas.style.width = scaleInfo.currentWidth + 'px';
        canvas.style.height = scaleInfo.currentHeight + 'px';
      }
      scaleDisplay();
      window.addEventListener("resize", scaleDisplay, false);
      
      //Classe Player
      function Player(){
        this.standingBitmap = new createjs.Bitmap(assets.playerStanding);
        this.chargedBitmap = new createjs.Bitmap(assets.playerCharged);
        this.position = 1;
        this.charged = false;
        this.previousState = "standing";
        this.drawing = stage.addChild(this.standingBitmap);
      }
      Player.prototype.update = function(){
        if(this.charged && this.previousState=="standing"){
          stage.removeChild(this.drawing);
          this.drawing = stage.addChild(this.chargedBitmap);
          this.previousState = "charged";
        }
        if(!this.charged && this.previousState == "charged"){
          stage.removeChild(this.drawing);
          this.drawing = stage.addChild(this.standingBitmap);
          this.previousState = "standing";
        }
        this.drawing.y = 34;
        this.drawing.x = getXPos(this.position);
      }
      Player.prototype.charge = function(){
        this.charged = true;
      }
      Player.prototype.uncharge = function(){
        this.charged = false;
      }
      
      //Classe Zombie
      function Zombie(position){
        this.position = position;
        this.drawing = stage.addChild(new createjs.Bitmap(assets.zombie));
        this.drawing.x = getXPos(position);
        this.speed = (Math.random() * 1) + 0.5;
        this.drawing.y = 560;
      }
      Zombie.prototype.update = function(){
        this.drawing.y -= this.speed;
      }
    
      //Classe Stone
      function Stone(position){
        this.position = position;
        this.drawing = stage.addChild(new createjs.Bitmap(assets.stone));
        this.drawing.x = getXPos(position)+20;
        this.drawing.y = 95;
      };
      Stone.prototype.update=function(){
        this.drawing.y += 2;
      }
      
      //Funzione GameOver
      var gameOver = function(score){
        alert("Game Over. Hai fatto "+score+" punti");
        init();
        //window.location.reload(true);
      }
      
      //Inizializzo il gioco
      var init = preload.onComplete = function(){
        //Pulisco lo stage
        stage.clear();
        
        //Disegno lo sfondo
        stage.addChild(new createjs.Bitmap(assets.bg));
        
        //Setto i valori iniziali
        var ladderPositions = [2,5,7,9],
          player,
          zombies = [],
          stones = [],
          score = 0;
        
        //Disegno il mostra-punteggio
        //e creo la funzione per aggiornarlo
        var displayScore = (function(){
          var scoreText = "Punteggio: ",
            scoreDisplay = new createjs.Text(scoreText, "bold 17px Arial", "#000000");
          
          scoreDisplay.x = 20;
          scoreDisplay.y = 3;
          stage.addChild(scoreDisplay);
          
          return function(points){
            scoreDisplay.text = scoreText + points;
          };
        })();
        
        //Aggiungo (e disegno) il giocatore
        player = new Player();
        
        //Disegno le scale
        var _len = ladderPositions.length;
        for(var i=0; i<_len; i++){
          var pos = ladderPositions[i];
          var newLadder = stage.addChild(new createjs.Bitmap(assets.ladder));
          newLadder.x = getXPos(pos);
          newLadder.y = 110;
        }
        
        //funzione per generare zombie
        function generateZombie(positions){
          var _len = positions.length;
          var pos = positions[ Math.floor( (Math.random()*_len) ) ];
          var newZombie = new Zombie(pos);
          zombies.push(newZombie);
        }
        
        //key mapping
        var space = false,
          leftArrow = false,
          rightArrow = false;
        
        document.onkeydown = function(e){
          var keyCode = e.keyCode
          
          switch( keyCode ){
            case 37: //left arrow
              leftArrow = true;
              rightArrow = false;
              break;
            case 39: //right arrow
              rightArrow = true;
              leftArrow = false;
              break;
            case 32: //space
              space = true;
              break;
            case 80:
              createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
              break;
            default:
              return;
          }
          
          return false;
        }
        
        //document.onclick = touchToArrow;
        
        function preventDefault(e){e.preventDefault();}
        
        window.addEventListener('touchmove', preventDefault);
        window.addEventListener('touchend', preventDefault);

        window.addEventListener('click', function(e) {
            e.preventDefault();
            touchToArrow(e);
            return false;
        }, false);
        
        window.addEventListener('touchstart', function(e) {
          e.preventDefault();
          touchToArrow(e.touches[0]);
          return false;
        }, false);
        
        function touchToArrow( touch ){
            var middleX = scaleInfo.currentWidth/2,
              middleY = scaleInfo.currentHeight/2;
              
            if ( touch.pageY < middleY ){
              leftArrow=false;
              rightArrow=false;
              space = true;
            } else {
              if( touch.pageX > middleX ){
                space = false;
                leftArrow = false;
                rightArrow = true;
              } else {
                space = false;
                rightArrow = false;
                leftArrow = true;
              }
            }
            return false;
        }
        
        //avvio il ciclo principale
        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(config.fps);
        createjs.Ticker.removeAllListeners();
        createjs.Ticker.addListener(function(delta, current){
          
          displayScore(score);
          
          if(player.position==0 || player.position==12){player.charge(); space = false;}
          if(rightArrow && player.position<12) { player.position +=1; rightArrow = false;}
          if(leftArrow && player.position>0) { player.position -=1; leftArrow = false;}
          if(space && player.charged){
            player.uncharge();
            stones.push(new Stone(player.position));
            space = false;
          }
          if(Math.random()<0.02)
            generateZombie(ladderPositions);
          
          player.update();
          
          //aggiorno tutti gli zombie
          var _len = zombies.length;
          for(var i=0; i<_len; i++){
            var zombie = zombies[i];
            zombie.update();
            if(zombie.drawing.y<100){
              gameOver(score);
            }
          }
          
          //aggiorno tutti i sassi
          var _len = stones.length;
          for(var i=0; i<_len; i++){
            
            var stone = stones[i];
            stone.update();
            
            if(stone.drawing.y>600){
              stage.removeChild(stone.drawing);
              stones.remove(i);
              _len -= 1;
            }
            //controllo collisioni
            var _zlen = zombies.length;
            for(var j=0; j<_zlen; j++){
              var zombie = zombies[j];
              if(stone.position!=zombie.position){
              
              } else if((stone.drawing.y - zombie.drawing.y) > 0){
                stage.removeChild(zombie.drawing);
                stage.removeChild(stone.drawing);
                zombies.remove(j);
                stones.remove(i);
                _len -= 1;
                _zlen -= 1;
                score++;
              }
            }
          }
          
          //disegno
          stage.update();
          
        }); //fine ciclo
        
      }; //fine init
      
    }; //fine funzione Game
    
    $(document).ready(function(){
      Game(document.getElementById("game"));
    });