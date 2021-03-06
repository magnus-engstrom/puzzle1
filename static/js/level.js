class Level {
    constructor(levelid) {
        this.id = levelid;
        this.mapData = Maps.getMapById(levelid);
        this.grid = this.mapData.grid;
        this.resources = this.mapData.resources;
        this.tiles = [];
        this.name = this.mapData.name;
        this.ticker = 0;
        this.running = false;
        this.playerTile = 0;
        this.tileTypes = new Map([
            [ 0, EmptyTile ],
            [ 7, BlockedTile ],
            [ 1, WallTile ],
            [ 2, PullTile ],
            [ 3, PushTile ],
            [ 4, TargetTile ],
            [ 5, togglePullTile ],
            [ 6, togglePullTile ],
            [ 9, Player ],
          ]);
        this.grid.forEach((row, i) => {
            let tileRow = [];
            row.forEach((col, j) => {
                let objClass = this.tileTypes.get(col)
                let obj;
                if (col == 6) {
                    this.grid[i][j] = 5;
                    obj = new objClass(j, i, 1);
                } else {
                    obj = new objClass(j, i);
                }
                if (obj.type == 'player') this.player = obj;
                tileRow.push(obj);
            });
            this.tiles.push(tileRow);
        });
    }
    handleInput(x, y, typeId) {
        if (this.tiles[y][x].onInteraction == 'replace') {
            if (this.resourcesStorage().get(typeId) < 2) return;
            let objClass = this.tileTypes.get(typeId);
            let obj = new objClass(x, y, 0);
            this.tiles[y][x] = obj
            this.grid[y][x] = typeId;
            let i = this.resources.indexOf(typeId);
            this.resources.splice(i, 1);
            return;
        }
        if (this.tiles[y][x].onInteraction == 'undo') {
            this.resources.push(this.grid[y][x]);
            this.tiles[y][x] = new EmptyTile(x, y);
            this.grid[y][x] = 0;
            return;
        }
    }
    iterate() {
        let updateRender = false;
        this.ticker++;
        if (this.ticker > 2) this.ticker = 0;
        this.tiles.forEach((row) => {
            row.forEach((tile) => {
                if (tile.toggling) {
                    tile.toggle(this.ticker);
                    updateRender = true;
                }
            });
        });
        return updateRender;
    }
    updatePlayer() {
        let x = this.player.x;
        let y = this.player.y;
        this.grid[y][x] = this.playerTile;
        let objClass = this.tileTypes.get(this.playerTile);
        let obj = new objClass(x, y, 0);        
        this.tiles[y][x] = obj;
        this.player.step(this.tiles);
        if (this.tiles[this.player.y][this.player.x].obstacle) {
            this.player.moveToPosition(x, y);
        }
        this.playerTile = this.grid[this.player.y][this.player.x];
        this.player.tileType = this.tiles[this.player.y][this.player.x].type;
        if (this.tiles[this.player.y][this.player.x].onInteraction == 'undo') {
            this.playerTile = 0;
        }
        this.tiles[this.player.y][this.player.x] = this.player;
        this.grid[this.player.y][this.player.x] = 9;
    }

    getPlayer(x, y) {
        this.player.setPosition(x, y);
        return this.player;
    }

    resourcesStorage() {
        return this.resources.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    }

    getResources() {
        let resources = [];
        [...this.resourcesStorage().keys()].forEach((r) => {
            let obj = this.tileTypes.get(r);
            resources.push(obj.getAsset(r, this.resourcesStorage().get(r), obj.getType()));
        });
        return resources;
    }

    getObjFromGrid(col, row) {
        return this.tiles[row][col];
    }
    getGridSize() {
        return {
            'columns': this.grid[0].length, 
            'rows': this.grid.length, 
        }
    }
    run() {
        if (!this.running) {
            this.running = true;
            this.ticker = 0;
        }
    }
}