
window.addEventListener "load", () ->
	canvas = document.getElementById("canvas")
	canvas.width = 800 #window.muro3.config.width
	canvas.height = 600 #window.muro3.config.height
	stage = new createjs.Stage(canvas)
	window.muro3.assets = {}
	game = new window.muro3.Game(canvas, stage)
	window.muro3.load(canvas, stage, game.init)
