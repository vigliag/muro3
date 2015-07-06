window.muro3 = window.muro3 || {}

window.muro3.load = (canvas, stage, oncomplete)->
    config = window.muro3.config
    manifest = window.muro3.manifest

    loadingText = new createjs.Text("Loading", "bold 24px Arial", "#000000");
    loadingText.y = 50;
    loadingText.x = canvas.width/3
    stage.addChild(loadingText)
    stage.update()

    #start loading content
    preload = new createjs.PreloadJS()

    #loading files in assets
    window.muro3.assets = {}
    preload.onFileLoad = (e) ->
      switch e.type
        when createjs.PreloadJS.IMAGE
          newImg = new Image()
          newImg.src = e.src
          window.muro3.assets[e.id] = newImg

    preload.onComplete = oncomplete
    preload.loadManifest(manifest)
