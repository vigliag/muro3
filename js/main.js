// Generated by CoffeeScript 1.9.3
(function() {
  window.addEventListener("load", function() {
    var canvas, game, stage;
    canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 600;
    stage = new createjs.Stage(canvas);
    window.muro3.assets = {};
    game = new window.muro3.Game(canvas, stage);
    return window.muro3.load(canvas, stage, game.init);
  });

}).call(this);
