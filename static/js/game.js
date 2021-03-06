const Game = (() => {
    let currentLevel, cWidth, cHeight, canvasContext, tileSize, levelSize;
    let clickTracking = false;
    let canvas = document.getElementById('game-canvas');
    let ui = document.getElementById('user-ui');
    let scoreCount = document.getElementById('total-score');
    let selectedResource = -1;
    let tickerStarted = false;
    let totalScore = -100;
    setupClickTracking = () => {
        clickTracking = true;
        canvas.onclick = (e) => {
            if (!currentLevel.running) {
                currentLevel.mapData.hint = [];
                let x = e.clientX - e.target.getBoundingClientRect().left;
                let y = e.clientY - e.target.getBoundingClientRect().top;
                currentLevel.handleInput(Math.floor(x / tileSize), Math.floor(y / tileSize), selectedResource);
                renderLevel();
                updateUI();
                totalScore--;
            }
        }
    }
    updateLevel = () => {
        if (currentLevel.iterate() || currentLevel.running) {
            if (currentLevel.running) {
                currentLevel.updatePlayer();
                totalScore--;
            }
            renderLevel();
            if (currentLevel.player.tileType == 'exit') {
                loadLevel(currentLevel.mapData.nextMap);
            }
        }
        setTimeout( () => {
            window.requestAnimationFrame(updateLevel);
        }, 500 );
    };
    setupCanvas = () => {
        canvasContext = canvas.getContext('2d');
        cWidth = canvas.offsetWidth;
        cHeight = canvas.offsetHeight;
    };
    updateUI = () => {
        currentLevel.getResources().forEach((r) => {
            let counterEl = document.getElementById(r.dataset.type + '_counter');
            counterEl.innerText = r.dataset.count-1;
        });
    };
    setupUI = (tileSize, resources) => {
        ui.innerHTML = '';
        resources.forEach((r, i) => {
            addResourceToUI(r, i, tileSize);
        });
        let play = document.createElement("div");
        play.id = 'play';  
        let image = new Image();
        image.src = Tile.getAsset(-1, 0, 'play').src;
        image.style.width = parseInt(tileSize).toString() + 'px';
        image.style.height = parseInt(tileSize).toString() + 'px'; 
        image.addEventListener('click', (e)=>{
            if (!currentLevel.running) {
                e.target.src = image = Tile.getAsset(-1, 0, 'reload').src;
                [...document.getElementsByClassName('resource')].forEach((i) => {
                    i.style.visibility = 'hidden';
                });
                runLevel();
            } else {
                totalScore--;
                loadLevel(currentLevel.id);
            }
        });
        play.appendChild(image);
        ui.appendChild(play);
        let levelCounter = document.createElement("div");
        levelCounter.id = 'level-counter';
        levelCounter.innerHTML = currentLevel.name + '<br />10';
        ui.appendChild(levelCounter);
    };
    addResourceToUI = (r, i) => {
        let container = document.createElement("div");
        container.className = 'resource';
        r.style.width = parseInt(tileSize).toString() + 'px';
        r.style.height = parseInt(tileSize).toString() + 'px';
        r.className = 'icon';
        r.addEventListener('click', (e) => {
            [...document.getElementsByClassName('icon')].forEach((i) => {
                i.className = 'icon';
            });
            e.target.className = 'icon selected';
            selectedResource = parseInt(e.target.dataset.id);
        });
        if (i == 0) {
            r.className = 'icon selected';
            selectedResource = parseInt(r.dataset.id);               
        }
        container.appendChild(r);
        let counterEl = document.createElement("div");
        counterEl.id = r.dataset.type + '_counter';
        counterEl.className = 'counter';
        counterEl.innerText = r.dataset.count-1;
        container.appendChild(counterEl);
        ui.appendChild(container);
    }
    loadLevel = (id) => {
        currentLevel = new Level(id);
        levelSize = currentLevel.getGridSize();
        tileSize = cWidth / levelSize.columns;
        if (!clickTracking) setupClickTracking();
        setTimeout( () => {
            if (id != 'level11') {
                setupUI(tileSize, currentLevel.getResources());
                totalScore += 100;
                console.log("Total score: " + totalScore);
            } else {
                document.getElementById('end').style.display = 'block';
                ui.style.display = 'none';
            }
            scoreCount.innerHTML = '🏅 ' + totalScore;
            renderLevel();
            if (!tickerStarted) updateLevel();
            tickerStarted = true;
        }, 100 );
        fetch('/stats?id='+id);
    };
    renderLevel = () => {
        canvasContext.clearRect(0, 0, cWidth, cHeight);
        canvasContext.shadowBlur = 5;
        canvasContext.shadowOffsetX = 2;
        canvasContext.shadowOffsetY = 2;
        for (let r=0;r<levelSize.rows;r++) {
            for (let c=0;c<levelSize.columns;c++) {
                let gameObj = currentLevel.getObjFromGrid(r, c);
                let t = Math.ceil(tileSize);
                if (gameObj.render) {
                    if (gameObj.useAsset) {
                        let img = Tile.getAsset(-1, 0, gameObj.type);
                        if (gameObj.drawShadow) {
                            canvasContext.shadowColor = 'rgba(20, 20, 20, 0.2)';
                        } else {
                            canvasContext.shadowColor = 'rgba(20, 20, 20, 0.0)';
                        }
                        canvasContext.drawImage(img, gameObj.x*t, gameObj.y*t, Math.ceil(t), Math.ceil(t));
                    }
                }
            }
        }
        if (currentLevel.mapData.hint.length > 0) {
            let img = Tile.getAsset(-1, 0, 'hint');
            canvasContext.drawImage(img, currentLevel.mapData.hint[0]*tileSize, currentLevel.mapData.hint[1]*tileSize, Math.ceil(tileSize), Math.ceil(tileSize));
        }
    };
    runLevel = () => {
        currentLevel.run();
    };
    return {
        load: (levelId='level1') => {
            setupCanvas();
            loadLevel(levelId);
        },
        run: () => {
            runLevel();
        }
    };
})();

Game.load();